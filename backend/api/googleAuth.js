import { google } from "googleapis";

/**
 * Dynamically gets a Google Auth client using environment variables.
 * @param {any} env - Hono environment variables (c.env).
 * @param {string[]} scopes - Google API OAuth scopes.
 * @returns {any} GoogleAuth client.
 */
export const getGoogleAuth = (env, scopes) => {
  let credentials;

  if (env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      credentials = typeof env.GOOGLE_SERVICE_ACCOUNT_JSON === "string" 
        ? JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON) 
        : env.GOOGLE_SERVICE_ACCOUNT_JSON;
    } catch (e) {
      console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON env variable:", e);
    }
  }

  if (!credentials) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not defined or invalid.");
  }

  return new google.auth.GoogleAuth({
    credentials,
    scopes,
  });
};
