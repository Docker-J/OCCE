import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { getCognitoClient } from "../api/cognito.js";

// Helper to fetch user attributes from Cognito using Access Token (fallback)
export const getCognitoUserAttributes = async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) return {};

    const token = authHeader.split(" ")[1];
    const client = getCognitoClient(c.env);
    const command = new GetUserCommand({ AccessToken: token });
    const response = await client.send(command);
    const attributes = {};
    for (const attr of response.UserAttributes || []) {
      attributes[attr.Name] = attr.Value;
    }
    return attributes;
  } catch (err) {
    console.error("Failed to get Cognito user attributes:", err);
    return {};
  }
};

// Helper to extract assigned gardens for a user from JWT token or Cognito attributes
export const getUserAssignedGardens = async (c, user) => {
  if (user && user["custom:garden"]) {
    return user["custom:garden"].split(",").map((g) => g.trim()).filter(Boolean);
  }
  const attrs = await getCognitoUserAttributes(c);
  if (attrs && attrs["custom:garden"]) {
    return attrs["custom:garden"].split(",").map((g) => g.trim()).filter(Boolean);
  }
  return [];
};

// In-memory cache for garden subfolder IDs (10 minutes TTL): key = gardenName -> folderId
export const gardenFolderIdCache = new Map();
// In-flight promise tracker to prevent duplicate requests from concurrently creating folders
export const pendingFolderPromises = new Map();

export const getGardenFolderId = async (
  drive,
  env,
  rootFolderId,
  gardenName,
  { createIfNotExists = false } = {},
) => {
  const trimmedName = gardenName.trim();
  const cacheKey = `${rootFolderId}_${trimmedName}_${createIfNotExists}`;

  if (pendingFolderPromises.has(cacheKey)) {
    return await pendingFolderPromises.get(cacheKey);
  }

  const execution = (async () => {
    const cached = gardenFolderIdCache.get(trimmedName);
    const now = Date.now();
    if (cached && now < cached.expiresAt) {
      return cached.folderId;
    }

    // 1. Try reading from Cloudflare KV
    if (env?.weeklyupdate_kv) {
      try {
        const kvFolders =
          (await env.weeklyupdate_kv.get("gathering_garden_folders", "json")) ||
          {};
        if (kvFolders[trimmedName]) {
          const folderId = kvFolders[trimmedName];
          gardenFolderIdCache.set(trimmedName, {
            folderId,
            expiresAt: now + 10 * 60 * 1000,
          });
          return folderId;
        }
      } catch (err) {
        console.warn("Failed to get garden folder from KV:", err);
      }
    }

    // 2. Search for existing folder in Google Drive
    const query = `'${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${trimmedName}' and trashed = false`;
    const res = await drive.files.list({
      q: query,
      spaces: "drive",
      fields: "files(id, name, createdTime)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    const filesList = res.data.files || [];
    let folderId = null;

    if (filesList.length > 0) {
      folderId = filesList[0].id;
    } else if (createIfNotExists) {
      // 3. Create folder ONLY when explicitly requested (e.g. POST submission)
      console.log(
        `Garden folder '${trimmedName}' not found in '${rootFolderId}'. Creating folder...`,
      );
      const createRes = await drive.files.create({
        requestBody: {
          name: trimmedName,
          mimeType: "application/vnd.google-apps.folder",
          parents: [rootFolderId],
        },
        fields: "id",
        supportsAllDrives: true,
      });
      folderId = createRes.data.id;
      console.log(`Created garden folder '${trimmedName}' with ID: ${folderId}`);
    }

    // 4. Update memory cache & KV
    if (folderId) {
      gardenFolderIdCache.set(trimmedName, {
        folderId,
        expiresAt: now + 10 * 60 * 1000,
      });

      if (env?.weeklyupdate_kv) {
        try {
          const kvFolders =
            (await env.weeklyupdate_kv.get(
              "gathering_garden_folders",
              "json",
            )) || {};
          kvFolders[trimmedName] = folderId;
          await env.weeklyupdate_kv.put(
            "gathering_garden_folders",
            JSON.stringify(kvFolders),
          );
        } catch (err) {
          console.warn("Failed to save garden folder to KV:", err);
        }
      }
    }

    return folderId;
  })();

  pendingFolderPromises.set(cacheKey, execution);
  try {
    return await execution;
  } finally {
    pendingFolderPromises.delete(cacheKey);
  }
};
