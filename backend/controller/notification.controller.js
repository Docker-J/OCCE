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
    const env = c.env;
    let memberId = null;

    if (!body?.token) {
      return c.json({ error: "BadRequest", message: "Token is required." }, 400);
    }

    // Check if an authenticated user session exists
    const authHeader = c.req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const verifier = getUserVerifier(env);
        const payload = await verifier.verify(token);

        if (payload?.sub) {
          const member = await env.DB.prepare(
            "SELECT id FROM church_members WHERE cognito_sub = ? LIMIT 1"
          ).bind(payload.sub).first();
          if (member) {
            memberId = member.id;
          }
        }
      } catch (authErr) {
        console.warn("FCM register auth token verification skipped:", authErr.message);
      }
    }

    const expiresAt = getExpirationEpoch();
    const deviceInfo = body.deviceInfo || null;

    await env.DB.prepare(`
      INSERT INTO fcm_tokens (token, member_id, device_info, expires_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(token) DO UPDATE SET
        member_id = excluded.member_id,
        device_info = excluded.device_info,
        expires_at = excluded.expires_at
    `).bind(body.token, memberId, deviceInfo, expiresAt).run();

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
    const env = c.env;

    await env.DB.prepare(
      "UPDATE fcm_tokens SET member_id = NULL WHERE token = ?"
    ).bind(body.token).run();

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
    const env = c.env;

    await env.DB.prepare(
      "DELETE FROM fcm_tokens WHERE token = ?"
    ).bind(body.token).run();

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

