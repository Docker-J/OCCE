import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "../api/dynamodb.js";

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
export const getRecentWeelyUpdateDate = async () => {
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

  const command = new QueryCommand(scanParam);

  try {
    const result = await docClient.send(command);

    RECENTDATE = result.Items[0].Date;
  } catch (error) {
    console.log(error);
  }
};

export const getRecentWeeklyUpdateDateController = async (_, res) => {
  res.send(RECENTDATE);
};

export const getWeeklyUpdateController = async (req, res) => {
  const key = `${req.params.date}${res.locals.authenticated ? "_member" : ""}`;

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });
    const result = await R2.send(command);

    result.Body.pipe(res); // Stream the data directly to the response
  } catch (error) {
    if (res.locals.authenticated) {
      // Retry without "_member" for authenticated users
      try {
        const retryCommand = new GetObjectCommand({
          Bucket: BUCKET,
          Key: req.params.date,
        });
        const retryResult = await R2.send(retryCommand);
        retryResult.Body.pipe(res);
      } catch (retryError) {
        // Second attempt failed for authenticated user, send 404
        console.error(retryError);
        res.sendStatus(404);
      }
    } else {
      // First attempt failed for unauthenticated user, send 404
      console.error(error);
      res.sendStatus(404);
    }
  }
};

export const uploadWeeklyUpdateController = async (req, res) => {
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

    // sendNotification(
    //   "새로운 주보가 업로드 되었습니다",
    //   req.body.date,
    //   `weeklyupdate/${req.body.date}`
    // );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
