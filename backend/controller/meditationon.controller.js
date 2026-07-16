import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient } from "../api/dynamodb.js";
import { uploadImage } from "./images.controller.js";

const TABLENAME = "MeditationON";
const PAGE_SIZE = 12;

export const getMeditationONsController = async (c) => {
  const lastVisibleID = c.req.query("lastVisible");
  const timeStamp = c.req.query("timeStamp");
  const docClient = getDocClient(c.env);

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
      Timestamp: timeStamp,
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

    return c.json(dataArray);
  } catch (error) {
    console.error("Get meditation list error:", error);
    return c.body(null, 500);
  }
};

export const getMeditationONController = async (c) => {
  const id = c.req.param("id");
  const docClient = getDocClient(c.env);

  try {
    const scanParam = {
      TableName: TABLENAME,
      ProjectionExpression: "Images, #ts ",
      KeyConditionExpression: "ID = :postID",
      ExpressionAttributeValues: {
        ":postID": id,
      },
      ExpressionAttributeNames: {
        "#ts": "Timestamp",
      },
    };

    const command = new QueryCommand(scanParam);
    const result = await docClient.send(command);

    if (!result.Items || result.Items.length === 0) {
      return c.body(null, 404);
    }

    return c.json(result.Items[0]);
  } catch (error) {
    console.error("Get meditation error:", error);
    return c.body(null, 500);
  }
};

export const postMeditationONController = async (c) => {
  try {
    const formData = await c.req.formData();
    const images = formData.getAll("images"); // Array of File objects
    const date = c.req.query("date");

    if (images.length === 0) {
      return c.text("No images provided", 400);
    }

    const docClient = getDocClient(c.env);

    const ids = {};
    for (const [index, image] of images.entries()) {
      const result = await uploadImage(c.env, image);
      ids[index] = result;
    }

    const command = new PutCommand({
      TableName: TABLENAME,
      Item: {
        ID: crypto.randomUUID(), // Native crypto API in Cloudflare Workers
        Timestamp: date,
        Cover: ids[0],
        Images: ids,
        sort: 0,
      },
    });

    const response = await docClient.send(command);
    console.log(response);

    return c.body(null, 201);
  } catch (error) {
    console.error("Post meditation error:", error);
    return c.body(null, 500);
  }
};
