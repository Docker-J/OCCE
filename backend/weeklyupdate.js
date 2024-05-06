import express from "express";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "./api/dynamodb.js";
import { upload } from "./middleware/multer.js";
import sendNotification from "./api/sendNotification.js";

const router = express.Router();

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const BUCKET = "weeklyupdate";
const TABLENAME = "WeeklyUpdate";
const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

var RECENTDATE;

const getRecentdate = async () => {
  const scanParam = {
    TableName: TABLENAME,
    IndexName: "SortDate",
    Limit: 1,
    ScanIndexForward: false,
    KeyConditionExpression: "#sort = :sort",
    ExpressionAttributeNames: {
      "#sort": "sort",
    },
    ExpressionAttributeValues: {
      ":sort": 0,
    },
  };

  try {
    const command = new QueryCommand(scanParam);
    const result = await docClient.send(command);

    RECENTDATE = result.Items[0].Date;
  } catch (error) {
    console.log(error);
  }
};

router.get("/RecentDate", async (req, res) => {
  if (RECENTDATE) {
    res.send(RECENTDATE);
  } else {
    await getRecentdate();
    res.send(RECENTDATE);
  }
});

router.get("/GetBulletin", async (req, res) => {
  console.log("get");
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: req.query.date,
    });

    const result = await R2.send(command);

    res.setHeader("Content-Type", "application/pdf");
    result.Body.pipe(res);
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

// Prepare R2
router.put("/PostBulletin", upload.single("images"), async (req, res) => {
  const data = req.file.buffer;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: req.body.date,
    Body: data,
    ContentType: "application/pdf",
  });

  try {
    await R2.send(command);
    if (req.body.date > RECENTDATE) {
      RECENTDATE = req.body.date;
    }
    const dbCommand = new PutCommand({
      TableName: TABLENAME,
      Item: {
        Date: req.body.date,
        sort: 0,
      },
    });
    await docClient.send(dbCommand);

    res.send(req.body.date);

    sendNotification(
      "새로운 주보가 업로드 되었습니다",
      req.body.date,
      `weeklyupdate/${req.body.date}`
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default router;
