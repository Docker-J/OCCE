import { getGoogleAuth } from "./googleAuth.js";

async function getTokens(env, targetRole = "all") {
  const db = env.DB;
  const nowEpoch = Math.floor(Date.now() / 1000);

  if (!targetRole || targetRole === "all") {
    const res = await db
      .prepare("SELECT token FROM fcm_tokens WHERE expires_at > ?")
      .bind(nowEpoch)
      .all();
    return (res.results || []).map((r) => r.token);
  }

  const roles = Array.isArray(targetRole) ? targetRole : [targetRole];
  if (roles.length === 0) return [];

  const placeholders = roles.map(() => "?").join(", ");
  const sql = `
    SELECT DISTINCT fcm_tokens.token 
    FROM fcm_tokens, json_each(COALESCE(NULLIF(fcm_tokens.roles, ''), '[]')) 
    WHERE json_each.value IN (${placeholders}) AND fcm_tokens.expires_at > ?
  `;
  const res = await db.prepare(sql).bind(...roles, nowEpoch).all();
  return (res.results || []).map((r) => r.token);
}

async function sendMessages(env, tokens, message, accessToken, projectId) {
  try {
    if (!Array.isArray(tokens) || tokens.length === 0) {
      return;
    }

    // To save Queue operations cost, we pack 20 tokens into a single queue message.
    // A single queue message will trigger 20 fetch requests + up to 20 delete requests in the consumer, 
    // guaranteeing we stay under the strict 50 subrequests limit.
    const tokensPerMessage = 20;
    const messagesPerBatch = 100; // Cloudflare Queue sendBatch limit is 100
    const tokensPerBatch = tokensPerMessage * messagesPerBatch; // 2000

    for (let i = 0; i < tokens.length; i += tokensPerBatch) {
      const chunk = tokens.slice(i, i + tokensPerBatch);
      const batchMessages = [];

      for (let j = 0; j < chunk.length; j += tokensPerMessage) {
        const tokenGroup = chunk.slice(j, j + tokensPerMessage);
        batchMessages.push({
          body: {
            tokens: tokenGroup, // Array of up to 20 tokens
            payloadTemplate: {
              data: message.data,
              android: message.android,
              webpush: message.webpush,
              apns: message.apns,
            },
            accessToken: accessToken,
            projectId: projectId,
          },
        });
      }

      try {
        await env.FCM_QUEUE.sendBatch(batchMessages);
        console.log(`Queued batch of ${batchMessages.length} FCM messages.`);
      } catch (err) {
        console.error("Failed to enqueue FCM messages:", err);
      }
    }
  } catch (err) {
    console.error("FCM Send Messages Error:", err);
    throw err;
  }
}

const sendNotification = async (env, title, body, pathname, targetRole = "all") => {
  const tokens = await getTokens(env, targetRole);

  if (!tokens || tokens.length === 0) {
    console.log("No active FCM tokens found for target role:", targetRole);
    return;
  }

  const cleanPath = pathname.replace(/^\/+/, "");
  const clickAction = pathname.startsWith("http")
    ? pathname
    : `https://oncce.ca/${cleanPath}`;

  const iconUrl = "https://oncce.ca/favicons/android-icon-192x192.png";
  const badgeUrl = "https://oncce.ca/favicons/favicon-32x32.png";

  const message = {
    data: {
      title: title,
      body: body,
      click_action: clickAction,
      icon: iconUrl,
    },
    android: {
      priority: "high",
      notification: {
        icon: iconUrl,
        color: "#FF6B00",
      },
    },
    webpush: {
      headers: {
        Urgency: "high",
      },
      fcm_options: {
        link: clickAction,
      },
    },
    apns: {
      headers: {
        "apns-priority": "5",
        "apns-push-type": "alert",
      },
      payload: {
        aps: {
          alert: {
            title: title,
            body: body,
          },
          sound: "default",
        },
      },
    },
  };

  // Get access token for FCM once per notification broadcast
  const auth = getGoogleAuth(env, [
    "https://www.googleapis.com/auth/firebase.messaging",
  ]);
  const credentials = await auth.getCredentials();
  const projectId = credentials.project_id || "church-4385c";
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const accessToken = tokenResponse.token;

  await sendMessages(env, tokens, message, accessToken, projectId);
};

export default sendNotification;
