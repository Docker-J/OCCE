import express from "express";
const router = express.Router();
import { db, fcm } from "./api/firebase.js";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "./api/dynamodb.js";

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const BUCKET = "weeklyupdate";
const TABLE_NAME = "WeeklyUpdate";
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
    TableName: TABLE_NAME,
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
    // const snapshot = await db
    //   .collection("Misc")
    //   .doc("RecentWeeklyBulletin")
    //   .get();

    // RECENTDATE = snapshot.data().date;

    const command = new QueryCommand(scanParam);
    const result = await docClient.send(command);

    res.send(result.Items[0].Date);
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
  try {
    const snapshot = await db
      .collection("weeklyBulletin")
      .doc(req.query.date)
      .get();
    res.send(snapshot.data().file);
  } catch {}
});

// router.put("/PostBulletin", async (req, res) => {
//   const data = {
//     file: req.body.file,
//   };
//   try {
//     await db.collection("weeklyBulletin").doc(req.body.date).set(data);
//     if (req.body.date > RECENTDATE) {
//       RECENTDATE = req.body.date;
//       const data = {
//         date: req.body.date,
//       };
//       await db.collection("Misc").doc("RecentWeeklyBulletin").set(data);
//     }
//     res.send(RECENTDATE);
//   } catch {
//     res.send("Error");
//   }
// });

// Prepare R2
router.put("/PostBulletin", async (req, res) => {
  const command = new PutObjectCommand({
    Body: req.body.file,
    Bucket: BUCKET,
    Key: req.body.date,
  });

  try {
    await R2.send(command);
    if (req.body.date > RECENTDATE) {
      RECENTDATE = req.body.date;
    }
    const dbCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        Date: req.body.date,
        sort: 0,
      },
    });
    await docClient.send(dbCommand);

    res.send(RECENTDATE);
  } catch (error) {}
});

export default router;
