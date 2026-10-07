import { getUserVerifier } from "../middleware/auth.js";
import sendNotification from "../api/sendNotification.js";
import sendBroadcastSms from "../api/sendSms.js";

function getExpirationEpoch() {
  const now = new Date();
  now.setMonth(now.getMonth() + 3); // 3 months expiration TTL
  return Math.floor(now.getTime() / 1000);
}

export const registerController = async (c) => {
  try {
    const body = await c.req.json();
    if (!body?.token) {
      return c.json({ error: "BadRequest", message: "Token is required." }, 400);
    }

    const db = c.env.DB;
    let roles = [];
    let sub = null;

    // Check if an authenticated user session exists
    const authHeader = c.req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const verifier = getUserVerifier(c.env);
        const payload = await verifier.verify(token);

        if (payload?.sub) {
          sub = payload.sub;
        }

        // Only assign roles if explicitly requested for a trusted personal device (isRemembered === true)
        if (body.isRemembered) {
          const groups = payload["cognito:groups"] || [];
          // Filter only valid system roles
          roles = groups.filter((g) => ["GardenKeeper", "Staff"].includes(g));
        }
      } catch (authErr) {
        console.warn("FCM register auth token verification skipped:", authErr.message);
      }
    }

    const expiresAt = getExpirationEpoch();
    const rolesJson = JSON.stringify(roles || []);

    await db
      .prepare(
        `INSERT INTO fcm_tokens (token, sub, roles, expires_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(token) DO UPDATE SET
           sub = excluded.sub,
           roles = excluded.roles,
           expires_at = excluded.expires_at`
      )
      .bind(body.token, sub, rolesJson, expiresAt)
      .run();

    return c.json({ success: true }, 200);
  } catch (err) {
    console.error("Register notification token error:", err);
    return c.json({ error: "RegisterTokenError", message: err.message }, 500);
  }
};

export const unlinkRoleController = async (c) => {
  try {
    const body = await c.req.json();
    if (!body?.token) {
      return c.json({ error: "BadRequest", message: "Token is required." }, 400);
    }
    const db = c.env.DB;

    await db
      .prepare("UPDATE fcm_tokens SET roles = '[]', sub = NULL WHERE token = ?")
      .bind(body.token)
      .run();

    return c.json({ success: true }, 200);
  } catch (err) {
    console.error("Unlink notification token role error:", err);
    return c.json({ error: "UnlinkRoleError", message: err.message }, 500);
  }
};

export const unregisterController = async (c) => {
  try {
    const body = await c.req.json();
    if (!body?.token) {
      return c.json({ error: "BadRequest", message: "Token is required." }, 400);
    }
    const db = c.env.DB;

    await db
      .prepare("DELETE FROM fcm_tokens WHERE token = ?")
      .bind(body.token)
      .run();

    return c.json({ success: true }, 200);
  } catch (err) {
    console.error("Unregister notification token error:", err);
    return c.json({ error: "UnregisterTokenError", message: err.message }, 500);
  }
};

export const broadcastController = async (c) => {
  try {
    const body = await c.req.json();
    const {
      title,
      body: notificationBody,
      pathname,
      targetRole = "all",
      sendPush = true,
      sendSms = false,
      smsTarget = "no_push_only",
    } = body;

    if (!title || !notificationBody) {
      return c.json({ error: "Title and body are required" }, 400);
    }

    if (!sendPush && !sendSms) {
      return c.json(
        { error: "At least one broadcast channel (push or sms) must be selected" },
        400
      );
    }

    const tasks = [];
    let pushPromise = null;
    let smsPromise = null;

    if (sendPush) {
      pushPromise = sendNotification(
        c.env,
        title,
        notificationBody,
        pathname || "",
        targetRole || "all"
      );
      tasks.push(pushPromise);
    }

    if (sendSms) {
      smsPromise = sendBroadcastSms(
        c.env,
        title,
        notificationBody,
        pathname || "",
        smsTarget || "no_push_only"
      );
      tasks.push(smsPromise);
    }

    await Promise.all(tasks);

    const smsResult = smsPromise ? await smsPromise : null;

    return c.json(
      {
        success: true,
        pushSent: !!sendPush,
        smsResult,
      },
      200
    );
  } catch (err) {
    console.error("Broadcast notification error:", err);
    return c.json({ error: "Internal Server Error", message: err.message }, 500);
  }
};

