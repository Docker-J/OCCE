import docClient from "../api/dynamodb.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const TABLENAME = "FCMToken";

export const registerController = async (req, res) => {
  const command = new PutCommand({
    TableName: TABLENAME,
    Item: {
      token: req.body.token,
      timestamp: new Date().toISOString(),
    },
  });

  try {
    await docClient.send(command);
    res.sendStatus(200);
  } catch (err) {}
};
