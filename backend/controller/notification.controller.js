import { getDocClient } from "../api/dynamodb.js";
import { PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const TABLENAME = "FCMToken";

function getExpirationEpoch() {
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  return Math.floor(now.getTime() / 1000);
}

export const registerController = async (c) => {
  try {
    const body = await c.req.json();
    const docClient = getDocClient(c.env);

    const command = new PutCommand({
      TableName: TABLENAME,
      Item: {
        token: body.token,
        expiresAt: getExpirationEpoch(),
      },
    });

    await docClient.send(command);
    return c.body(null, 200);
  } catch (err) {
    console.error("Register notification token error:", err);
    return c.body(null, 500);
  }
};

export const unregisterController = async (c) => {
  try {
    const body = await c.req.json();
    const docClient = getDocClient(c.env);

    const command = new DeleteCommand({
      TableName: TABLENAME,
      Key: {
        token: body.token,
      },
    });

    await docClient.send(command);
    return c.body(null, 200);
  } catch (err) {
    console.error("Unregister notification token error:", err);
    return c.body(null, 500);
  }
};

export const broadcastController = async (c) => {
  try {
    const body = await c.req.json();
    const { title, body: notificationBody, pathname } = body;

    if (!title || !notificationBody) {
      return c.json({ error: "Title and body are required" }, 400);
    }

    // Import sendNotification dynamically or call it
    const { default: sendNotification } = await import("../api/sendNotification.js");
    await sendNotification(c.env, title, notificationBody, pathname || "");

    return c.json({ success: true }, 200);
  } catch (err) {
    console.error("Broadcast notification error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

