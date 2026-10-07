import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { HTTPException } from "hono/http-exception";

import apiRouter from "./routes/index.js";
import { handleScheduled } from "./jobs/scheduled.js";
import { linkPreviewMiddleware } from "./middleware/linkPreview.js";

const app = new Hono();

// ==========================================
// 1. Global Pre-Routing Middlewares
// ==========================================

// HTTP Request / Response logger
app.use("*", logger());

// Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
app.use("*", secureHeaders());

// Allowed origins regular expression:
// - Local development: http://localhost:port or http://127.0.0.1:port
// - Production & staging: https://oncce.ca, https://*.oncce.ca, https://*.workers.dev
const ALLOWED_ORIGIN_REGEX =
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$|^https:\/\/([a-z0-9-]+\.)*oncce\.ca$|^https:\/\/([a-z0-9-]+\.)*workers\.dev$/i;

const isAllowedOrigin = (origin) => {
  if (!origin) return false;
  return ALLOWED_ORIGIN_REGEX.test(origin);
};

// CORS configuration with credentials and method control
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return "https://oncce.ca";
      return isAllowedOrigin(origin) ? origin : "https://oncce.ca";
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
    credentials: true,
  })
);

// Dynamic OpenGraph / Twitter meta-tag rewriter for bot crawlers
app.use("*", (c, next) => linkPreviewMiddleware(c, next, app));

// ==========================================
// 2. Error & Not Found Handlers
// ==========================================

// Global exception handler
app.onError((err, c) => {
  console.error(`[Global Error] ${c.req.method} ${c.req.url} -`, err);

  // Handle Hono HTTP exceptions (e.g. 400 Bad Request, 401 Unauthorized)
  if (err instanceof HTTPException) {
    return c.json(
      {
        error: err.name || "HTTPException",
        message: err.message,
      },
      err.status
    );
  }

  const isDev = c.env?.ENVIRONMENT === "development";

  // Handle unexpected internal server errors (mask details in non-development environments)
  return c.json(
    {
      error: "InternalServerError",
      message: isDev
        ? err.message || "An unexpected error occurred"
        : "서버 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    },
    500
  );
});

// Global 404 handler returning uniform JSON specification
app.notFound((c) => {
  return c.json(
    {
      error: "NotFound",
      message: `Cannot ${c.req.method} ${c.req.path}`,
    },
    404
  );
});

// ==========================================
// 3. API Router Registration
// ==========================================
app.route("/api", apiRouter);

// ==========================================
// 4. Cloudflare Worker Life Cycle Handlers
// ==========================================
export default {
  /**
   * Fetch handler routing incoming HTTP traffic through Hono.
   */
  fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  },

  /**
   * Cloudflare Queue handler to process asynchronous background tasks (e.g. FCM push notifications).
   */
  async queue(batch, env, ctx) {
    console.log(`[Queue] Processing FCM batch of ${batch.messages.length} message(s)`);

    const sendPromises = batch.messages.flatMap((msg) => {
      const { tokens, payloadTemplate, accessToken, projectId } = msg.body || {};

      if (!Array.isArray(tokens) || tokens.length === 0) {
        return [];
      }

      return tokens.map(async (token) => {
        const payload = {
          message: {
            token: token,
            ...payloadTemplate,
          },
        };

        try {
          const res = await fetch(
            `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          );

          if (!res.ok) {
            const errText = await res.text();
            console.error(`[FCM] Send error for token ${token}:`, errText);

            // Clean up stale / unregistered tokens from D1
            if (
              errText.includes("UNREGISTERED") ||
              errText.includes("NotRegistered")
            ) {
              console.log(`[FCM] Token ${token} is unregistered. Removing from D1 fcm_tokens...`);
              try {
                await env.DB.prepare("DELETE FROM fcm_tokens WHERE token = ?")
                  .bind(token)
                  .run();
                console.log(`[FCM] Successfully deleted unregistered token: ${token}`);
              } catch (delErr) {
                console.error(`[FCM] Failed to delete token ${token} from D1:`, delErr);
              }
            }
          } else {
            // Cancel response body stream to release worker socket and avoid memory leaks
            await res.body?.cancel();
          }
        } catch (err) {
          console.error(`[FCM] Network exception for token ${token}:`, err);
        }
      });
    });

    await Promise.all(sendPromises);
  },

  /**
   * Scheduled cron triggers delegated to backend/jobs/scheduled.js.
   */
  async scheduled(event, env, ctx) {
    console.log(`[Scheduled] Cron trigger: ${event.cron}`);
    ctx.waitUntil(handleScheduled(event, env, ctx));
  },
};
