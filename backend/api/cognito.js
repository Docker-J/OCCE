import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

let cachedCognitoClient = null;

export const resetCognitoClient = () => {
  cachedCognitoClient = null;
};

/**
 * Dynamically gets the Cognito Identity Provider Client using environment variables.
 * Uses a singleton pattern to cache the connection in the worker isolate.
 * @param {any} env - Hono environment variables (c.env).
 * @returns {CognitoIdentityProviderClient}
 */
export const getCognitoClient = (env) => {
  if (cachedCognitoClient) {
    return cachedCognitoClient;
  }

  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials are not configured in environment variables.");
  }

  cachedCognitoClient = new CognitoIdentityProviderClient({
    region: env.AWS_REGION || "us-west-2",
    maxAttempts: 3,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  return cachedCognitoClient;
};
