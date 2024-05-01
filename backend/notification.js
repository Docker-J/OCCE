import express from "express";

import docClient from "./api/dynamodb.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const router = express.Router();

const TABLENAME = "FCMToken";

router.put("/fcmToken", async (req, res) => {
  const command = new PutCommand({
    TableName: TABLENAME,
    Item: {
      token: req.body.token,
      timestamp: new Date().toISOString(),
    },
  });

  try {
    const response = await docClient.send(command);
  } catch (err) {}
});

export default router;
