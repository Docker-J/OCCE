import { getGoogleAuth } from "./googleAuth.js";

async function getTargetTokens(env, targetRole = "all") {
  const nowEpoch = Math.floor(Date.now() / 1000);

  if (!targetRole || targetRole === "all") {
    const { results } = await env.DB.prepare(
      "SELECT token FROM fcm_tokens WHERE expires_at > ?"
    ).bind(nowEpoch).all();
    return (results || []).map((r) => r.token);
  }

  const roles = Array.isArray(targetRole) ? targetRole : [targetRole];
  const tokenSet = new Set();

  for (const role of roles) {
    if (role === "GardenKeeper") {
      // Members who lead active gardens
      const { results } = await env.DB.prepare(`
        SELECT f.token 
        FROM fcm_tokens f
        JOIN gardens g ON f.member_id = g.leader_member_id
        WHERE g.is_active = 1 AND f.expires_at > ?
      `).bind(nowEpoch).all();
      (results || []).forEach((r) => tokenSet.add(r.token));
    } else if (role === "Staff" || role === "교역자") {
      // Clergy members
      const { results } = await env.DB.prepare(`
        SELECT f.token 
        FROM fcm_tokens f
        JOIN church_members m ON f.member_id = m.id
        WHERE m.position = '교역자' AND m.status = 'ACTIVE' AND f.expires_at > ?
      `).bind(nowEpoch).all();
      (results || []).forEach((r) => tokenSet.add(r.token));
    }
  }

  return Array.from(tokenSet);
}

async function sendMessages(env, tokens, message, accessToken, projectId) {
  try {
    if (!tokens || tokens.length <= 0) {
      console.log("[FCM] No active target tokens found for broadcast.");
      return;
    }

    // Pack 20 tokens into a single queue message to stay within subrequest limits
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
            tokens: tokenGroup,
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
        console.log(`Queued batch of ${batchMessages.length} FCM messages (${chunk.length} tokens).`);
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
  const tokens = await getTargetTokens(env, targetRole);

  if (tokens.length === 0) {
    console.log(`[FCM] No recipients found for target role: ${JSON.stringify(targetRole)}`);
    return;
  }

  const cleanPath = pathname.replace(/^\/+/, "");
  const clickAction = pathname.startsWith("http")
    ? pathname
    : `https://oncce.ca/${cleanPath}`;

  const iconUrl = "https://oncce.ca/favicons/android-icon-192x192.png";

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
