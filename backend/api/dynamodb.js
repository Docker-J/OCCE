import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

/**
 * Dynamically gets the DynamoDB Document Client using environment variables.
 * @param {any} env - Hono environment variables (c.env).
 * @returns {DynamoDBDocumentClient}
 */
export const getDocClient = (env) => {
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
  return DynamoDBDocumentClient.from(client);
};
