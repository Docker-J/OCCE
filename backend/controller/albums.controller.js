import { DeleteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import docClient from "../api/dynamodb.js";
import { deleteImages, uploadImage } from "./images.controller.js";

const TABLENAME = "Albums";
const PAGE_SIZE = 12;

export const getAlbumsController = async (req, res) => {
  console.log(req.params.year);
  const lastVisibleID = req.query.lastVisible;

  const scanParam = {
    TableName: TABLENAME,
    IndexName: "SortTimestamp",
    Limit: PAGE_SIZE,
    ProjectionExpression: "ID, Title, #t, Cover",
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

export const getAlbumController = async (req, res) => {
  try {
    const scanParam = {
      TableName: TABLENAME,
      ProjectionExpression: "Title, Images",
      KeyConditionExpression: "ID = :albumID",
      ExpressionAttributeValues: {
        ":albumID": req.params.id,
      },
    };

    const command = new QueryCommand(scanParam);

    const result = await docClient.send(command);

    res.send({ title: result.Items[0].Title, images: result.Items[0].Images });
  } catch (error) {
    console.log(error);
  }
};

export const postAlbumController = async (req, res) => {
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
        Title: req.body.title,
        Timestamp: req.body.date,
        Cover: ids[req.body.cover],
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

export const deleteAlbumController = async (req, res) => {
  const getAlbumCommand = new QueryCommand({
    TableName: TABLENAME,
    ProjectionExpression: "Images, #t",
    KeyConditionExpression: "ID = :albumID",
    ExpressionAttributeNames: {
      "#t": "Timestamp",
    },
    ExpressionAttributeValues: {
      ":albumID": req.params.id,
    },
  });

  try {
    const result = await docClient.send(getAlbumCommand);

    const images = Object.values(result.Items[0].Images);

    await deleteImages(images);

    const deleteAlbumCommand = new DeleteCommand({
      TableName: TABLENAME,
      Key: {
        ID: req.params.id,
        Timestamp: result.Items[0].Timestamp,
      },
    });

    await docClient.send(deleteAlbumCommand);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
