import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import docClient from "../api/dynamodb.js";
import { uploadImage } from "./images.controller.js";

const TABLENAME = "MeditationON";
const PAGE_SIZE = 12;

export const getMeditationONsController = async (req, res) => {
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
};

export const getMeditationONController = async (req, res) => {
  try {
    const scanParam = {
      TableName: TABLENAME,
      ProjectionExpression: "Images, #ts ",
      KeyConditionExpression: "ID = :postID",
      ExpressionAttributeValues: {
        ":postID": req.params.id,
      },
      ExpressionAttributeNames: {
        "#ts": "Timestamp",
      },
    };

    const command = new QueryCommand(scanParam);

    const result = await docClient.send(command);

    res.send(result.Items[0]);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

export const postMeditationONController = async (req, res) => {
  const ids = {};
  const images = req.files;

  try {
    for (const [index, image] of images.entries()) {
      const result = await uploadImage(image);

      ids[index] = result;
    }

    const command = new PutCommand({
      TableName: TABLENAME,
      Item: {
        ID: uuid(),
        Timestamp: req.query.date,
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
};
