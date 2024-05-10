import express from "express";
import axios from "axios";
import FormData from "form-data";
import { v4 as uuid } from "uuid";

import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "../api/dynamodb.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;

const TABLENAME = "MeditationON";
const PAGE_SIZE = 12;

router.get("/getPosts", async (req, res) => {
  const lastVisibleID = req.query.lastVisible;

  const scanParam = {
    TableName: TABLENAME,
    IndexName: "SortTimestamp",
    Limit: PAGE_SIZE,
    ProjectionExpression: "ID, #t, Cover",
    ScanIndexForward: false,
    KeyConditionExpression: "#sort = :sort",
    ExpressionAttributeNames: {
      "#t": "Timestamp",
      "#sort": "sort",
    },
    ExpressionAttributeValues: {
      ":sort": 0,
    },
  };

  if (lastVisibleID != null) {
    scanParam.ExclusiveStartKey = {
      ID: lastVisibleID,
      Timestamp: req.query.timeStamp,
      sort: 0,
    };
  }

  const command = new QueryCommand(scanParam);

  try {
    const result = await docClient.send(command);

    const dataArray = [];
    result.Items.forEach((data) => {
      dataArray.push(data);
    });

    res.send(dataArray);
  } catch (error) {
    console.log(error);
  }
});

router.get("/getPostDetail", async (req, res) => {
  try {
    const scanParam = {
      TableName: TABLENAME,
      ProjectionExpression: "Images",
      KeyConditionExpression: "ID = :postID",
      ExpressionAttributeValues: {
        ":postID": req.query.id,
      },
    };

    const command = new QueryCommand(scanParam);

    const result = await docClient.send(command);

    res.send(result.Items[0].Images);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

router.post("/uploadImage", upload.any("images"), async (req, res) => {
  const ids = {};
  const images = req.files;

  try {
    for (const [index, image] of images.entries()) {
      const formData = new FormData();
      formData.append("file", image.buffer, image.originalname);

      const result = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
        formData,
        {
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
          },
        }
      );

      ids[index] = result.data.result.id;
    }

    const command = new PutCommand({
      TableName: TABLENAME,
      Item: {
        ID: uuid(),
        Timestamp: new Date().toISOString(),
        Cover: ids[0],
        Images: ids,
        sort: 0,
      },
    });

    const response = await docClient.send(command);
    console.log(response);

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
  }
});

export default router;
