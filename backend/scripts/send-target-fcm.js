import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { getGoogleAuth } from "../api/googleAuth.js";

dotenv.config();

const serviceAccountPath = path.resolve("church-4385c-ceedf27e8d20.json");
const serviceAccountContent = fs.readFileSync(serviceAccountPath, "utf8");

const env = {
  GOOGLE_SERVICE_ACCOUNT_JSON: serviceAccountContent,
};

// Target tokens provided by the user
const targetTokens = [
  "cT0fz0IIR7N4E60rQI8Lfe:APA91bH16jQJ-bYkMf8LScXYJWQJTXre269kmkmo55vSlHAK2JeRyEFb-Bx6zDAUqD4N8HFh_-_P6FWFIKJ-4NWb76R58zqSPAJKo2xMhDavFW35Hlc74yY",
  "c0yMVGQgoEsn5DT6ic_1JW:APA91bHzGBNyyY_BT1KAmUGj094kNhxkNnpbhOnCMSWb1cW3nwBI-x4zBUx3uLKWBsDxEynEAzvVVc4PJqEIrrYyZ1ii1w7S1KEfmHEu_8gWTrAciAeqPHo",
  "eMDqebQ2v9oIzNUjWUnvpO:APA91bELFu08jB2RcjkcBPd7kbMnyP0v9w9SfUSWCuajEXGy9U3SMbNpoMaa59hWaLwUQwYOn6uQHMjabNsVUx2ZVs6Pl8CwO6mTcfJv-aTtnEbZysylGzQ"
];

async function main() {
  const auth = getGoogleAuth(env, ["https://www.googleapis.com/auth/firebase.messaging"]);
  const credentials = await auth.getCredentials();
  const projectId = credentials.project_id || "church-4385c";
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const accessToken = tokenResponse.token;

  const clickAction = "https://www.youtube.com/playlist?list=PL-MVshquUXWHipi5sSMqiQgrkA0vuZd6t";
  const title = "291일 성경 1독";
  const body = "7월 16일\n오늘의 1독 말씀은 \"창세기 23-25장\" 입니다.";

  for (const token of targetTokens) {
    console.log("Sending target FCM notification to token:", token.slice(0, 20));

    const payload = {
      message: {
        token: token,
        data: {
          title: title,
          body: body,
          click_action: clickAction,
        },
        android: {
          priority: "high"
        },
        webpush: {
          headers: {
            Urgency: "high"
          }
        },
        apns: {
          headers: {
            "apns-priority": "5",
            "apns-push-type": "background"
          },
          payload: {
            aps: {
              "content-available": 1
            }
          }
        }
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

      const resJson = await res.json();
      if (res.ok) {
        console.log(`✅ Success: Notification sent successfully to ${token.slice(0, 10)}! Response:`, JSON.stringify(resJson));
      } else {
        console.error(`❌ FCM send error for ${token.slice(0, 10)}:`, JSON.stringify(resJson));
      }
    } catch (err) {
      console.error(`❌ Error sending to ${token.slice(0, 10)}:`, err);
    }
  }
}

main();
