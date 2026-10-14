import { PublishCommand } from "@aws-sdk/client-sns";
import { ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { getSnsClient } from "./sns.js";
import { getCognitoClient } from "./cognito.js";

/**
 * Normalizes phone numbers to standard E.164 format.
 * Defaults to North America (+1) if 10 digits provided.
 */
function normalizePhoneNumber(rawPhone) {
  if (!rawPhone) return null;
  const cleaned = rawPhone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) {
    return cleaned.length >= 11 ? cleaned : null;
  }
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+${cleaned}`;
  }
  return null;
}

/**
 * Fetch all users from Cognito User Pool with pagination.
 */
async function fetchAllCognitoUsers(env) {
  const cognitoClient = getCognitoClient(env);
  let allUsers = [];
  let paginationToken = null;

  do {
    const command = new ListUsersCommand({
      UserPoolId: env.AWS_COGNITO_USER_POOL_ID,
      PaginationToken: paginationToken,
    });

    const response = await cognitoClient.send(command);
    if (response.Users) {
      allUsers = allUsers.concat(response.Users);
    }
    paginationToken = response.PaginationToken;
  } while (paginationToken);

  return allUsers;
}

/**
 * Fetch subs of users who currently have active Web Push tokens in D1 fcm_tokens table.
 */
async function fetchActiveNotificationSubs(env) {
  try {
    const db = env.DB;
    const nowEpoch = Math.floor(Date.now() / 1000);
    const res = await db
      .prepare(
        "SELECT DISTINCT sub FROM fcm_tokens WHERE sub IS NOT NULL AND expires_at > ?"
      )
      .bind(nowEpoch)
      .all();
    return new Set(
      (res.results || [])
        .map((item) => item.sub)
        .filter(Boolean)
    );
  } catch (err) {
    console.warn("Could not query D1 for active push users:", err.message);
    return new Set();
  }
}

/**
 * Sends broadcast SMS to registered church members via AWS SNS.
 * 
 * @param {object} env - Cloudflare Worker environment variables.
 * @param {string} title - Announcement title.
 * @param {string} body - Announcement body.
 * @param {string} pathname - Optional link URL or relative path.
 * @param {string} smsTarget - "no_push_only" (default, cost-saving) or "all".
 * @returns {Promise<{ totalRecipients: number, sentCount: number, failedCount: number, skippedPushCount: number }>}
 */
export const sendBroadcastSms = async (
  env,
  title,
  body,
  pathname = "",
  smsTarget = "no_push_only"
) => {
  const cleanPath = (pathname || "").trim().replace(/^\/+/, "");
  const link = cleanPath
    ? (cleanPath.startsWith("http") ? cleanPath : `https://oncce.ca/${cleanPath}`)
    : "";

  let messageText = `[OCCE 공지]\n${title.trim()}\n\n${body.trim()}`;
  if (link) {
    messageText += `\n\n${link}`;
  }

  // 1. Fetch Cognito users and active FCM subscribers in parallel
  const [cognitoUsers, activePushSubs] = await Promise.all([
    fetchAllCognitoUsers(env),
    smsTarget === "no_push_only" ? fetchActiveNotificationSubs(env) : Promise.resolve(new Set()),
  ]);

  // 2. Filter target phone numbers
  const recipientMap = new Map(); // phone -> { name, sub }
  let skippedPushCount = 0;

  for (const user of cognitoUsers) {
    if (user.Enabled === false) continue;

    const attrs = {};
    (user.Attributes || []).forEach((attr) => {
      attrs[attr.Name] = attr.Value;
    });

    const sub = attrs.sub || "";
    const name = attrs.name || "";
    const rawPhone = attrs.phone_number || (user.Username?.startsWith("+") ? user.Username : null);
    const phone = normalizePhoneNumber(rawPhone);

    if (!phone) continue;

    // Skip if user already receives web push notifications and cost-saving mode is on
    if (smsTarget === "no_push_only" && sub && activePushSubs.has(sub)) {
      skippedPushCount++;
      continue;
    }

    if (!recipientMap.has(phone)) {
      recipientMap.set(phone, { name, sub });
    }
  }

  const recipients = Array.from(recipientMap.keys());
  const totalRecipients = recipients.length;

  if (totalRecipients === 0) {
    return {
      totalRecipients: 0,
      sentCount: 0,
      failedCount: 0,
      skippedPushCount,
    };
  }

  // If Cloudflare Queue is available, decouple into worker queue batches
  if (env.FCM_QUEUE) {
    const recipientsPerMessage = 20; // 20 SNS calls per queue invocation stays well within 50 subrequests limit
    const messagesPerBatch = 100;
    const recipientsPerBatch = recipientsPerMessage * messagesPerBatch;

    for (let i = 0; i < recipients.length; i += recipientsPerBatch) {
      const chunk = recipients.slice(i, i + recipientsPerBatch);
      const batchMessages = [];

      for (let j = 0; j < chunk.length; j += recipientsPerMessage) {
        const phoneGroup = chunk.slice(j, j + recipientsPerMessage);
        batchMessages.push({
          body: {
            type: "sms",
            phoneNumbers: phoneGroup,
            messageText,
          },
        });
      }

      await env.FCM_QUEUE.sendBatch(batchMessages);
      console.log(`[SMS] Queued ${batchMessages.length} message(s) for ${chunk.length} recipients in FCM_QUEUE.`);
    }

    return {
      totalRecipients,
      sentCount: totalRecipients,
      failedCount: 0,
      skippedPushCount,
      queued: true,
    };
  }

  // Fallback: synchronous sending when queue binding is not present
  console.warn("FCM_QUEUE binding not available; sending SMS synchronously.");
  const snsClient = getSnsClient(env);
  let sentCount = 0;
  let failedCount = 0;

  const CONCURRENCY = 5;
  for (let i = 0; i < recipients.length; i += CONCURRENCY) {
    const batch = recipients.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (phoneNumber) => {
        try {
          const command = new PublishCommand({
            PhoneNumber: phoneNumber,
            Message: messageText,
            MessageAttributes: {
              "AWS.SNS.SMS.SMSType": {
                DataType: "String",
                StringValue: "Transactional",
              },
            },
          });
          await snsClient.send(command);
          sentCount++;
        } catch (err) {
          failedCount++;
          console.error(`Failed to send SMS to ${phoneNumber}:`, err.message);
        }
      })
    );
  }

  return {
    totalRecipients,
    sentCount,
    failedCount,
    skippedPushCount,
  };
};

/**
 * Cloudflare Queue worker consumer handler for processing SMS message chunks.
 *
 * @param {object} env - Cloudflare Worker environment.
 * @param {object} body - Decoupled queue message payload { phoneNumbers, messageText }.
 */
export const processSmsQueueMessage = async (env, body) => {
  const { phoneNumbers, messageText } = body || {};
  if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0 || !messageText) {
    return;
  }

  const snsClient = getSnsClient(env);
  const CONCURRENCY = 5;

  for (let i = 0; i < phoneNumbers.length; i += CONCURRENCY) {
    const batch = phoneNumbers.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (phoneNumber) => {
        try {
          const command = new PublishCommand({
            PhoneNumber: phoneNumber,
            Message: messageText,
            MessageAttributes: {
              "AWS.SNS.SMS.SMSType": {
                DataType: "String",
                StringValue: "Transactional",
              },
            },
          });
          await snsClient.send(command);
        } catch (err) {
          console.error(`[Queue SMS] Failed to send SMS to ${phoneNumber}:`, err.message);
        }
      })
    );
  }
};

export default sendBroadcastSms;

