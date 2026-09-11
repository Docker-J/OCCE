import { Hono } from "hono";
import { cors } from "hono/cors";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { getDocClient } from "./api/dynamodb.js";

import user from "./routes/user.routes.js";
import announcements from "./routes/announcements.routes.js";
import column from "./routes/columns.routes.js";
import weeklyupdate from "./routes/weeklyupdate.routes.js";
import albums from "./routes/albums.routes.js";
import meditationon from "./routes/meditationon.routes.js";
import notification from "./routes/notification.routes.js";
import schedules from "./routes/schedules.routes.js";
import images from "./routes/images.routes.js";
import attendance from "./routes/attendance.routes.js";
import bible291 from "./routes/bible291.routes.js";

import { handleScheduled } from "./jobs/scheduled.js";
import { linkPreviewMiddleware } from "./middleware/linkPreview.js";

const app = new Hono();

app.onError((err, c) => {
  console.error(`[Global Error] ${c.req.method} ${c.req.url} -`, err);
  return c.json({ error: "Internal Server Error", details: err.message }, 500);
});

app.use("*", cors());
app.use("*", (c, next) => linkPreviewMiddleware(c, next, app));

// Mount sub-routers
app.route("/api/user", user);
app.route("/api/announcements", announcements);
app.route("/api/columns", column);
app.route("/api/weekly-update", weeklyupdate);
app.route("/api/albums", albums);
app.route("/api/schedules", schedules);
app.route("/api/meditation-on", meditationon);
app.route("/api/notification", notification);
app.route("/api/images", images);
app.route("/api/attendance", attendance);
app.route("/api/bible291", bible291);

export default {
  /**
   * Queue handler to process background tasks like FCM notifications.
   */
  async queue(batch, env, ctx) {
    console.log(`Processing FCM Queue batch of ${batch.messages.length} messages`);
    
    // With max_batch_size=1, batch.messages.length is 1.
    // Each message contains up to 20 tokens (tokens array).
    const sendPromises = batch.messages.flatMap((msg) => {
      const { tokens, payloadTemplate, accessToken, projectId } = msg.body;
      
      return tokens.map(async (token) => {
        const payload = {
          message: {
            token: token,
            ...payloadTemplate,
          }
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
            console.error(`FCM send error for token ${token}:`, errText);
            
            if (errText.includes("UNREGISTERED") || errText.includes("NotRegistered")) {
              console.log(`Token ${token} is unregistered. Deleting from DynamoDB...`);
              const docClient = getDocClient(env);
              const deleteCmd = new DeleteItemCommand({
                TableName: "FCMToken",
                Key: {
                  token: { S: token }
                }
              });
              await docClient.send(deleteCmd);
              console.log(`Successfully deleted unregistered token: ${token}`);
            }
          } else {
            // Must consume or cancel response body to release HTTP socket and prevent deadlock in Cloudflare Workers
            await res.body?.cancel();
          }
        } catch (err) {
          console.error(`FCM network error for token ${token}:`, err);
        }
      });
    });

    await Promise.all(sendPromises);
  },

  /**
   * Fetch handler to route HTTP requests through Hono.
   */
  fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  },

  /**
   * Scheduled handler to perform background cron tasks
   * delegated to backend/jobs/scheduled.js.
   */
  async scheduled(event, env, ctx) {
    console.log(`[Wrangler Scheduled Trigger] Cron: ${event.cron}`);
    ctx.waitUntil(handleScheduled(event, env, ctx));
  },
};
