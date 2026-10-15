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

/**
 * Initializes a copied weekly attendance spreadsheet:
 * - Creates '종합통계' sheet tab at index 0 if not present
 * - Populates formulas and initial checkboxes across all garden tabs
 * - Sets data validations and percentage formatting
 * @param {any} sheets - Google Sheets client
 * @param {string} weeklySpreadsheetId - Spreadsheet ID
 * @returns {Promise<number|null>} sheetId of '종합통계' tab
 */
export const initializeWeeklySpreadsheet = async (
  sheets,
  weeklySpreadsheetId,
) => {
  const weeklySpreadsheetInfo = await sheets.spreadsheets.get({
    spreadsheetId: weeklySpreadsheetId,
    fields: "sheets(properties(sheetId,title))",
  });
  const weeklySheets = weeklySpreadsheetInfo.data.sheets || [];
  const weeklySheetNames = weeklySheets.map((s) => s.properties.title);

  let summaryTab = weeklySheets.find((s) => s.properties.title === "종합통계");
  let summaryTabId = summaryTab ? summaryTab.properties.sheetId : null;

  if (!summaryTabId) {
    const batchRequests = [
      {
        addSheet: {
          properties: {
            title: "종합통계",
            index: 0,
          },
        },
      },
    ];

    const batchResponseUpdate = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: weeklySpreadsheetId,
      requestBody: {
        requests: batchRequests,
      },
    });

    summaryTabId =
      batchResponseUpdate.data.replies[0].addSheet.properties.sheetId;
  }

  // Filter to get only garden tabs
  const gardenTabs = weeklySheetNames.filter(
    (name) =>
      name !== "정원지기" &&
      name !== "종합통계" &&
      name !== "정원모임보고" &&
      !/^\d{4}-\d{2}-\d{2}$/.test(name),
  );

  if (gardenTabs.length === 0) {
    return summaryTabId;
  }

  // Fetch members count of all garden tabs to populate '종합통계' and initialize checkboxes
  const ranges = gardenTabs.map((name) => `${name}!A:A`);
  const batchResponse = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: weeklySpreadsheetId,
    ranges,
  });

  const summaryRows = [
    ["보고여부", "정원", "총원", "출석", "결석", "출석율"],
  ];

  const validationRequests = [];
  const updateValueRequests = [
    {
      range: "종합통계!A1",
      values: summaryRows,
    },
  ];

  gardenTabs.forEach((gardenTabName, idx) => {
    const vr = batchResponse.data.valueRanges[idx];
    const rows = vr.values || [];
    const members = rows
      .map((r) => r[0]?.toString().trim())
      .filter((name) => name && name !== "이름" && name !== "성명");

    const memberCount = members.length;
    const rowIdx = idx + 2; // 1-based index (header is 1)

    summaryRows.push([
      false,
      gardenTabName,
      `=COUNTA('${gardenTabName}'!A1:A200)`,
      `=COUNTIF('${gardenTabName}'!B1:B200, TRUE)`,
      `=COUNTIF('${gardenTabName}'!B1:B200, FALSE)`,
      `=IFERROR(D${rowIdx}/C${rowIdx}, 0)`,
    ]);

    const currentTab = weeklySheets.find(
      (s) => s.properties.title === gardenTabName,
    );
    const currentTabId = currentTab ? currentTab.properties.sheetId : null;

    if (currentTabId && memberCount > 0) {
      const falseValues = Array(memberCount).fill([false]);
      updateValueRequests.push({
        range: `${gardenTabName}!B1:B${memberCount}`,
        values: falseValues,
      });

      validationRequests.push({
        setDataValidation: {
          range: {
            sheetId: currentTabId,
            startRowIndex: 0,
            endRowIndex: memberCount,
            startColumnIndex: 1,
            endColumnIndex: 2,
          },
          rule: {
            condition: {
              type: "BOOLEAN",
            },
            showCustomUi: true,
          },
        },
      });
    }
  });

  // Write '종합통계' values and initialize checkboxes in a single batch values update
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: weeklySpreadsheetId,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data: updateValueRequests,
    },
  });

  // Add '종합통계' percentage formatting and column-wide checkbox data validation
  if (summaryTabId && gardenTabs.length > 0) {
    validationRequests.push({
      repeatCell: {
        range: {
          sheetId: summaryTabId,
          startRowIndex: 1,
          endRowIndex: gardenTabs.length + 1,
          startColumnIndex: 5,
          endColumnIndex: 6,
        },
        cell: {
          userEnteredFormat: {
            numberFormat: {
              type: "PERCENT",
              pattern: "0%",
            },
          },
        },
        fields: "userEnteredFormat.numberFormat",
      },
    });

    validationRequests.push({
      setDataValidation: {
        range: {
          sheetId: summaryTabId,
          startRowIndex: 1,
          endRowIndex: gardenTabs.length + 1,
          startColumnIndex: 0,
          endColumnIndex: 1,
        },
        rule: {
          condition: {
            type: "BOOLEAN",
          },
          showCustomUi: true,
        },
      },
    });
  }

  // Apply batch validations and formatting
  if (validationRequests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: weeklySpreadsheetId,
      requestBody: {
        requests: validationRequests,
      },
    });
  }

  return summaryTabId;
};

