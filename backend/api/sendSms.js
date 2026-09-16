import { PublishCommand } from "@aws-sdk/client-sns";
import { ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { getSnsClient } from "./sns.js";
import { getCognitoClient } from "./cognito.js";
import { getDocClient } from "./dynamodb.js";

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
 * Fetch subs of users who currently have active Web Push tokens in DynamoDB FCMToken table.
 */
async function fetchActiveNotificationSubs(env) {
  try {
    const docClient = getDocClient(env);
    const res = await docClient.send(
      new ScanCommand({
        TableName: "FCMToken",
        ProjectionExpression: "#sub",
        ExpressionAttributeNames: { "#sub": "sub" },
      })
    );
    return new Set(
      (res.Items || [])
        .map((item) => (item.sub?.S ? item.sub.S : item.sub))
        .filter(Boolean)
    );
  } catch (err) {
    console.warn("Could not scan FCM tokens for active push users:", err.message);
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

  const snsClient = getSnsClient(env);
  let sentCount = 0;
  let failedCount = 0;

  // 3. Send SMS in small concurrent batches (concurrency: 5)
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

export default sendBroadcastSms;
