import { DeleteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient } from "../api/dynamodb.js";
import { deleteImages, uploadImage } from "./images.controller.js";
import { purgeCache } from "../api/cloudflare.js";

const TABLENAME = "Albums";
const PAGE_SIZE = 12;

export const getAlbumsController = async (c) => {
  const yearStr = c.req.query("year");
  const year = yearStr ? parseInt(yearStr, 10) : null;
  const lastVisibleID = c.req.query("lastVisible");
  const timeStamp = c.req.query("timeStamp");

  const docClient = getDocClient(c.env);

  const param = {
    TableName: TABLENAME,
    IndexName: year ? "yearTimeStamp" : "sortTimestamp",
    Limit: PAGE_SIZE,
    ProjectionExpression: "ID, Title, #t, Cover",
    ScanIndexForward: false,
    KeyConditionExpression: year ? "#year = :year" : "#sort = :sort",
    ExpressionAttributeNames: {
      "#t": "Timestamp",
      ...(year ? { "#year": "year" } : { "#sort": "sort" }),
    },
    ExpressionAttributeValues: year ? { ":year": year } : { ":sort": 0 },
  };

  if (lastVisibleID != null) {
    param.ExclusiveStartKey = {
      ID: lastVisibleID,
      Timestamp: timeStamp,
      ...(year ? { year: year } : { sort: 0 }),
    };
  }

  const command = new QueryCommand(param);

  const result = await docClient.send(command);

  const dataArray = [];
  result.Items.forEach((data) => {
    dataArray.push(data);
  });

  return c.json(dataArray);
};

export const getAlbumController = async (c) => {
  const id = c.req.param("id");
  const docClient = getDocClient(c.env);

  const queryParam = {
    TableName: TABLENAME,
    ProjectionExpression: "Title, Images",
    KeyConditionExpression: "ID = :albumID",
    ExpressionAttributeValues: {
      ":albumID": id,
    },
  };

  const command = new QueryCommand(queryParam);
  const result = await docClient.send(command);

  if (!result.Items || result.Items.length === 0) {
    return c.body(null, 404);
  }

  return c.json({ title: result.Items[0].Title, images: result.Items[0].Images });
};

export const postAlbumController = async (c) => {
  const formData = await c.req.formData();
  const title = formData.get("title");
  const date = formData.get("date");
  const coverIndex = parseInt(formData.get("cover") || "0", 10);
  const images = formData.getAll("images"); // Array of File objects

  if (images.length === 0) {
    return c.text("No images provided", 400);
  }

  const docClient = getDocClient(c.env);

  const results = await Promise.all(
    images.map((image) => uploadImage(c.env, image))
  );

  const ids = {};
  results.forEach((result, index) => {
    ids[index] = result;
  });

  const command = new PutCommand({
    TableName: TABLENAME,
    Item: {
      ID: crypto.randomUUID(), // Native crypto API in Cloudflare Workers
      Title: title,
      Timestamp: date,
      Cover: ids[coverIndex] || ids[0],
      Images: ids,
      year: new Date(date).getFullYear(),
      sort: 0,
    },
  });

  const response = await docClient.send(command);
  console.log(response);

  await purgeCache(c.env);
  return c.body(null, 201);
};

export const deleteAlbumController = async (c) => {
  const id = c.req.param("id");
  const docClient = getDocClient(c.env);

  const getAlbumCommand = new QueryCommand({
    TableName: TABLENAME,
    ProjectionExpression: "Images, #t",
    KeyConditionExpression: "ID = :albumID",
    ExpressionAttributeNames: {
      "#t": "Timestamp",
    },
    ExpressionAttributeValues: {
      ":albumID": id,
    },
  });

  const result = await docClient.send(getAlbumCommand);

  if (!result.Items || result.Items.length === 0) {
    return c.body(null, 404);
  }

  const images = Object.values(result.Items[0].Images);

  if (images.length > 0) {
    await deleteImages(c.env, images);
  }

  const deleteAlbumCommand = new DeleteCommand({
    TableName: TABLENAME,
    Key: {
      ID: id,
      Timestamp: result.Items[0].Timestamp,
    },
  });

  await docClient.send(deleteAlbumCommand);

  await purgeCache(c.env);
  return c.body(null, 200);
};
