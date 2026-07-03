import { DeleteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient } from "../api/dynamodb.js";
import { deleteImages, uploadImage } from "./images.controller.js";

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

  try {
    const result = await docClient.send(command);

    const dataArray = [];
    result.Items.forEach((data) => {
      dataArray.push(data);
    });

    return c.json(dataArray);
  } catch (error) {
    console.error("Get albums error:", error);
    return c.body(null, 500);
  }
};

export const getAlbumController = async (c) => {
  const id = c.req.param("id");
  const docClient = getDocClient(c.env);

  try {
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
  } catch (error) {
    console.error("Get album error:", error);
    return c.body(null, 500);
  }
};

export const postAlbumController = async (c) => {
  try {
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

    return c.body(null, 201);
  } catch (error) {
    console.error("Post album error:", error);
    return c.body(null, 500);
  }
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

  try {
    const result = await docClient.send(getAlbumCommand);

    if (!result.Items || result.Items.length === 0) {
      return c.body(null, 404);
    }

    const images = Object.values(result.Items[0].Images);

    await deleteImages(c.env, images);

    const deleteAlbumCommand = new DeleteCommand({
      TableName: TABLENAME,
      Key: {
        ID: id,
        Timestamp: result.Items[0].Timestamp,
      },
    });

    await docClient.send(deleteAlbumCommand);

    return c.body(null, 200);
  } catch (error) {
    console.error("Delete album error:", error);
    return c.body(null, 500);
  }
};
