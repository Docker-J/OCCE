import { getDocClient } from "../api/dynamodb.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

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
