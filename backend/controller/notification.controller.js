import { getDocClient } from "../api/dynamodb.js";
import { PutCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getUserVerifier } from "../middleware/auth.js";
import sendNotification from "../api/sendNotification.js";

const TABLENAME = "FCMToken";

function getExpirationEpoch() {
  const now = new Date();
  now.setMonth(now.getMonth() + 3); // 3 months expiration TTL
  return Math.floor(now.getTime() / 1000);
}

export const registerController = async (c) => {
  try {
    const body = await c.req.json();
    const docClient = getDocClient(c.env);
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

    const item = {
      token: body.token,
      roles: roles,
      expiresAt: getExpirationEpoch(),
    };
    if (sub) {
      item.sub = sub;
    }

    const command = new PutCommand({
      TableName: TABLENAME,
      Item: item,
    });

    await docClient.send(command);
    return c.body(null, 200);
  } catch (err) {
    console.error("Register notification token error:", err);
    return c.body(null, 500);
  }
};

export const unlinkRoleController = async (c) => {
  try {
    const body = await c.req.json();
    if (!body?.token) {
      return c.body(null, 400);
    }
    const docClient = getDocClient(c.env);

    const command = new UpdateCommand({
      TableName: TABLENAME,
      Key: {
        token: body.token,
      },
      UpdateExpression: "SET #roles = :emptyRoles REMOVE #sub",
      ExpressionAttributeNames: {
        "#roles": "roles",
        "#sub": "sub",
      },
      ExpressionAttributeValues: {
        ":emptyRoles": [],
      },
    });

    await docClient.send(command);
    return c.body(null, 200);
  } catch (err) {
    console.error("Unlink notification token role error:", err);
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
    const { title, body: notificationBody, pathname, targetRole } = body;

    if (!title || !notificationBody) {
      return c.json({ error: "Title and body are required" }, 400);
    }

    await sendNotification(
      c.env,
      title,
      notificationBody,
      pathname || "",
      targetRole || "all"
    );

    return c.json({ success: true }, 200);
  } catch (err) {
    console.error("Broadcast notification error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

