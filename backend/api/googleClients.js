import { google } from "googleapis";
import { getGoogleAuth } from "./googleAuth.js";

const DEFAULT_SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
];

/**
 * Returns a configured Google Sheets API client
 * @param {any} env
 * @param {string[]} [scopes]
 */
export const getSheetsClient = (env, scopes = DEFAULT_SCOPES) => {
  const auth = getGoogleAuth(env, scopes);
  return google.sheets({ version: "v4", auth });
};

/**
 * Returns a configured Google Drive API client
 * @param {any} env
 * @param {string[]} [scopes]
 */
export const getDriveClient = (env, scopes = DEFAULT_SCOPES) => {
  const auth = getGoogleAuth(env, scopes);
  return google.drive({ version: "v3", auth });
};

// In-memory cache for drive file IDs (3 minutes TTL): key = `${folderId}_${fileName}` -> fileId
const fileIdCache = new Map();

/**
 * Finds a file in a Google Drive folder (including Shared Drives) with in-memory caching
 * @param {any} drive - Google Drive client instance
 * @param {string} folderId - Target Google Drive folder ID
 * @param {string} fileName - Exact filename to find
 * @returns {Promise<string|null>}
 */
export const findDriveFileId = async (drive, folderId, fileName) => {
  if (!folderId) return null;
  const cacheKey = `${folderId}_${fileName}`;
  const cached = fileIdCache.get(cacheKey);
  const now = Date.now();
  if (cached && now < cached.expiresAt) {
    return cached.fileId;
  }

  const searchResponse = await drive.files.list({
    q: `'${folderId}' in parents and name = '${fileName}' and trashed = false`,
    spaces: "drive",
    fields: "files(id, name)",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  const filesList = searchResponse.data.files || [];
  const fileId = filesList.length > 0 ? filesList[0].id : null;

  if (fileId) {
    fileIdCache.set(cacheKey, { fileId, expiresAt: now + 3 * 60 * 1000 });
  }
  return fileId;
};
