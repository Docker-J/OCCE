import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

let cachedDocClient = null;

/**
 * Dynamically gets the DynamoDB Document Client using environment variables.
 * Uses a singleton pattern to cache the connection in the worker isolate.
 * @param {any} env - Hono environment variables (c.env).
 * @returns {DynamoDBDocumentClient}
 */
export const getDocClient = (env) => {
  if (cachedDocClient) {
    return cachedDocClient;
  }

  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials are not configured in environment variables.");
  }

  const client = new DynamoDBClient({
    region: env.AWS_REGION || "us-west-2",
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });
  
  cachedDocClient = DynamoDBDocumentClient.from(client);
  return cachedDocClient;
};
