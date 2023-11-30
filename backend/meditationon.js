const express = require("express");
const router = express.Router();
const { fcm } = require("./api/firebase.js");
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");
const uuid = require("uuid");

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  QueryCommand,
  PutCommand,
  DynamoDBDocumentClient,
} = require("@aws-sdk/lib-dynamodb");

const CLOUDFLARE_ACCOUNT_ID = "f4b5f3fab40742f7a3975f012a237dc7";
const CLOUDFLARE_IMG_API_KEY = process.env.CLOUDFLARE_IMG_API_KEY;

const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const TABLE_NAME = "MeditationON";
const PAGE_SIZE = 12;

router.get("/getPosts", async (req, res) => {
  const lastVisibleID = req.query.lastVisible;

  const scanParam = {
    TableName: TABLE_NAME,
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
      TableName: TABLE_NAME,
      Limit: PAGE_SIZE,
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
            Authorization: `Bearer ${CLOUDFLARE_IMG_API_KEY}`,
          },
        }
      );

      ids[index] = result.data.result.id;
    }

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ID: uuid.v4(),
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

module.exports = router;
