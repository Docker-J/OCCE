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

    // Chunk the requests to prevent socket exhaustion
    const chunkSize = 50;
    for (let i = 0; i < tokens.length; i += chunkSize) {
      const chunk = tokens.slice(i, i + chunkSize);

      const sendPromises = chunk.map(async (token) => {
        const payload = {
          message: {
            token: token,
            data: message.data,
            webpush: message.webpush,
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
            console.error(`FCM send error for token ${token}:`, errText);
          }
        } catch (err) {
          console.error(`FCM network error for token ${token}:`, err);
        }
      });

      await Promise.all(sendPromises);
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

  const clickAction = pathname.startsWith("http") ? pathname : `https://oncce.ca/${pathname}`;

  const message = {
    data: {
      title: title,
      body: body,
      click_action: clickAction,
    },
  };

  // Get access token for FCM once per notification broadcast
  const auth = getGoogleAuth(env, ["https://www.googleapis.com/auth/firebase.messaging"]);
  const credentials = await auth.getCredentials();
  const projectId = credentials.project_id || "church-4385c";
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const accessToken = tokenResponse.token;

  await sendMessages(env, scanParam, message, accessToken, projectId);
};

export default sendNotification;
