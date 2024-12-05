import docClient from "../api/dynamodb.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const TABLENAME = "FCMToken";

function getExpirationEpoch() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return Math.floor(nextMonth.getTime() / 1000);
}

export const registerController = async (req, res) => {
  const command = new PutCommand({
    TableName: TABLENAME,
    Item: {
      token: req.body.token,
      expiresAt: getExpirationEpoch(),
    },
  });

  try {
    await docClient.send(command);
    res.sendStatus(200);
  } catch (err) {}
};
