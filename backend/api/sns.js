import { SNSClient } from "@aws-sdk/client-sns";

let cachedSnsClient = null;

export const resetSnsClient = () => {
  cachedSnsClient = null;
};

/**
 * Dynamically gets the SNS Client using environment variables.
 * Uses a singleton pattern to cache the connection in the worker isolate.
 * @param {any} env - Hono environment variables (c.env).
 * @returns {SNSClient}
 */
export const getSnsClient = (env) => {
  if (cachedSnsClient) {
    return cachedSnsClient;
  }

  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials are not configured in environment variables.");
  }

  cachedSnsClient = new SNSClient({
    region: env.AWS_REGION || "us-west-2",
    maxAttempts: 3,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  return cachedSnsClient;
};
