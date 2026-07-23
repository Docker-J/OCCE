import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { getDocClient } from "./dynamodb.js";
import { getGoogleAuth } from "./googleAuth.js";

const TABLENAME = "FCMToken";

async function sendMessages(env, scanParam, message, accessToken, projectId) {
  try {
    const docClient = getDocClient(env);
    const command = new ScanCommand(scanParam);
    const result = await docClient.send(command);
    const tokens = result.Items ? result.Items.map((item) => item.token.S) : [];

    if (tokens.length <= 0) {
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

    if (typeof result.LastEvaluatedKey !== "undefined") {
      scanParam.ExclusiveStartKey = result.LastEvaluatedKey;
      await sendMessages(env, scanParam, message, accessToken, projectId); // Recursive call
    }
  } catch (err) {
    console.error("FCM Send Messages Error:", err);
  }
}

const sendNotification = async (env, title, body, pathname) => {
  const scanParam = {
    TableName: TABLENAME,
    ProjectionExpression: "#tkn",
    ExpressionAttributeNames: { "#tkn": "token" },
    Limit: 499,
  };

  const clickAction = pathname.startsWith("http")
    ? pathname
    : `https://oncce.ca/${pathname}`;

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
      notification: {
        title: title,
        body: body,
        icon: iconUrl,
        badge: badgeUrl,
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

  await sendMessages(env, scanParam, message, accessToken, projectId);
};

export default sendNotification;
