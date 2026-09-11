import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { getCognitoClient } from "../api/cognito.js";
import {
  getSheetsClient,
  getDriveClient,
  findDriveFileId,
} from "../api/googleClients.js";

// Helper to fetch user attributes from Cognito using Access Token (fallback)
const getCognitoUserAttributes = async (c) => {
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
const getUserAssignedGardens = async (c, user) => {
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
const gardenFolderIdCache = new Map();
// In-flight promise tracker to prevent duplicate requests from concurrently creating folders
const pendingFolderPromises = new Map();

const getGardenFolderId = async (
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

export const getGardensController = async (c) => {
  try {
    const env = c.env;
    const user = c.get("user");
    const spreadsheetId = env.ATTENDANCE_SHEET_ID;

    if (!spreadsheetId) {
      return c.json(
        {
          error: "ConfigError",
          message: "출석부 스프레드시트 ID가 설정되지 않았습니다.",
        },
        500,
      );
    }

    const isStaff = user["cognito:groups"]?.includes("Staff") || false;
    let assignedGardens = [];

    if (!isStaff) {
      assignedGardens = await getUserAssignedGardens(c, user);
      if (assignedGardens.length === 0) {
        return c.json(
          {
            error: "NotAssignedLeader",
            message: "계정에 배정된 소속 정원이 없습니다. 온교회 관리자(스태프)에게 문의해 주세요.",
          },
          403,
        );
      }
    }

    const sheets = getSheetsClient(env);

    // 1. Read sheet metadata (tab names) with minimal fields
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: "sheets.properties.title",
    });

    const sheetNames = (spreadsheet.data.sheets || []).map((s) => s.properties.title);

    const gardensData = {};

    // Unify and fetch all target garden member lists in ONE single batchGet request
    const targetGardenTabs = isStaff
      ? sheetNames.filter(
          (name) =>
            name !== "정원지기" &&
            name !== "종합통계" &&
            name !== "출석부" &&
            name !== "출석보고" &&
            name !== "정원모임보고" &&
            !/^\d{4}-\d{2}-\d{2}$/.test(name),
        )
      : assignedGardens
          .map((g) => sheetNames.find((s) => s.trim() === g.trim()))
          .filter(Boolean);

    // If only garden names/tabs are needed, return immediately without loading member rosters
    const namesOnly = c.req.query("namesOnly") === "true";
    if (namesOnly) {
      return c.json({
        isStaff,
        assignedGarden: assignedGardens[0] || null,
        gardenNames: targetGardenTabs,
        gardens: {},
      });
    }

    if (targetGardenTabs.length > 0) {
      const ranges = targetGardenTabs.map((name) => `${name}!A:A`);
      const batchResponse = await sheets.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges,
      });

      batchResponse.data.valueRanges.forEach((vr, idx) => {
        const gardenName = targetGardenTabs[idx];
        const rows = vr.values || [];
        const members = rows
          .map((r) => r[0]?.toString().trim())
          .filter((name) => name && name !== "이름" && name !== "성명");
        gardensData[gardenName] = members;
      });
    }

    return c.json({
      isStaff,
      assignedGarden: assignedGardens[0] || null, // Default to first assigned garden
      gardens: gardensData,
    });
  } catch (error) {
    console.error("getGardensController Error:", error);
    return c.json(
      {
        error: "GetGardensError",
        message:
          error.message ||
          "정원 및 교인 목록을 불러오는 중 오류가 발생했습니다.",
      },
      500,
    );
  }
};

export const getReportController = async (c) => {
  try {
    const env = c.env;
    const user = c.get("user");
    const spreadsheetId = env.ATTENDANCE_SHEET_ID;
    const folderId = env.DRIVE_WEEKLY_FOLDER_ID;

    if (!spreadsheetId || !folderId) {
      return c.json(
        {
          error: "ConfigError",
          message:
            "출석부 설정(스프레드시트 ID 또는 드라이브 폴더 ID)이 누락되었습니다.",
        },
        500,
      );
    }

    const date = c.req.query("date");
    const gardenName = c.req.query("gardenName");

    if (!date || !gardenName) {
      return c.json(
        {
          error: "MissingRequiredParams",
          message: "날짜(date)와 정원명(gardenName) 파라미터가 필요합니다.",
        },
        400,
      );
    }

    const isStaff = user["cognito:groups"]?.includes("Staff") || false;

    if (!isStaff) {
      const assignedGardens = await getUserAssignedGardens(c, user);
      if (!assignedGardens.map((g) => g.trim()).includes(gardenName.trim())) {
        return c.json(
          {
            error: "UnauthorizedGardenReport",
            message: "본인이 담당하지 않은 정원의 출석을 조회할 수 없습니다.",
          },
          403,
        );
      }
    }

    const sheets = getSheetsClient(env);
    const drive = getDriveClient(env);
    const fileName = `OCCE_정원출석부_${date}`;

    // 1. Search for weekly spreadsheet in Drive
    const weeklySpreadsheetId = await findDriveFileId(drive, folderId, fileName);

    if (!weeklySpreadsheetId) {
      return c.json({ reported: false });
    }

    // 2. Fetch both '종합통계' and `${gardenName}` rowData with cell notes in ONE single batch call!
    let sheetResp;
    try {
      sheetResp = await sheets.spreadsheets.get({
        spreadsheetId: weeklySpreadsheetId,
        ranges: ["'종합통계'!A:B", `'${gardenName}'!A:B`],
        fields:
          "sheets(properties(title),data(rowData(values(userEnteredValue,formattedValue,note))))",
      });
    } catch (err) {
      // If garden tab or range does not exist in weekly spreadsheet
      return c.json({ reported: false });
    }

    const sheetsList = sheetResp.data.sheets || [];
    const summarySheet = sheetsList.find(
      (s) => s.properties?.title === "종합통계",
    );
    const gardenSheet = sheetsList.find(
      (s) => s.properties?.title === gardenName,
    );

    if (!gardenSheet) {
      return c.json({ reported: false });
    }

    let isReported = false;
    if (summarySheet) {
      const summaryRows = summarySheet.data?.[0]?.rowData || [];
      for (let i = 1; i < summaryRows.length; i++) {
        const cells = summaryRows[i]?.values || [];
        const gName = cells[1]?.formattedValue?.trim();
        if (gName === gardenName.trim()) {
          const val =
            cells[0]?.userEnteredValue?.boolValue ??
            cells[0]?.formattedValue;
          isReported = val === true || val === "TRUE" || val === "true";
          break;
        }
      }
    }

    if (!isReported) {
      return c.json({ reported: false });
    }

    // 3. Extract member attendance and absence notes
    const rowData = gardenSheet.data?.[0]?.rowData || [];
    const attendees = [];
    const absentees = [];
    const absenceReasons = {};

    rowData.forEach((row) => {
      const cells = row.values || [];
      const memberName =
        cells[0]?.userEnteredValue?.stringValue ||
        cells[0]?.formattedValue?.trim();

      if (!memberName || memberName === "이름" || memberName === "성명") {
        return;
      }

      const isPresent = cells[1]?.userEnteredValue?.boolValue ?? false;
      const note = cells[1]?.note?.trim() || "";

      if (isPresent) {
        attendees.push(memberName);
      } else {
        absentees.push(memberName);
        if (note) {
          absenceReasons[memberName] = note;
        }
      }
    });

    return c.json({
      reported: true,
      date,
      gardenName,
      attendees,
      absentees,
      absenceReasons,
    });
  } catch (error) {
    console.error("getReportController Error:", error);
    return c.json(
      {
        error: "GetReportError",
        message:
          error.message || "출석 보고 내역을 조회하는 중 오류가 발생했습니다.",
      },
      500,
    );
  }
};

export const getGatheringReportController = async (c) => {
  try {
    const env = c.env;
    const user = c.get("user");
    const spreadsheetId = env.ATTENDANCE_SHEET_ID;
    const folderId = env.DRIVE_GATHERING_FOLDER_ID;

    if (!spreadsheetId || !folderId) {
      return c.json(
        {
          error: "ConfigError",
          message:
            "정원 모임 드라이브 폴더 설정(스프레드시트 ID 또는 드라이브 폴더 ID)이 누락되었습니다.",
        },
        500,
      );
    }

    const date = c.req.query("date");
    const gardenName = c.req.query("gardenName");

    if (!date || !gardenName) {
      return c.json(
        {
          error: "MissingRequiredParams",
          message: "날짜(date)와 정원명(gardenName) 파라미터가 필요합니다.",
        },
        400,
      );
    }

    const isStaff = user["cognito:groups"]?.includes("Staff") || false;

    if (!isStaff) {
      const assignedGardens = await getUserAssignedGardens(c, user);
      if (!assignedGardens.map((g) => g.trim()).includes(gardenName.trim())) {
        return c.json(
          {
            error: "UnauthorizedGardenReport",
            message: "본인이 담당하지 않은 정원의 모임 보고를 조회할 수 없습니다.",
          },
          403,
        );
      }
    }

    const sheets = getSheetsClient(env);
    const drive = getDriveClient(env);
    const fileName = `${gardenName}_${date}`;

    // 1. Garden folder ID lookup (do NOT create folder on GET)
    const gardenFolderId = await getGardenFolderId(drive, env, folderId, gardenName, {
      createIfNotExists: false,
    });

    // 2. Search for existing file in garden subfolder (if folder exists)
    let gatheringSpreadsheetId = null;
    if (gardenFolderId) {
      gatheringSpreadsheetId = await findDriveFileId(
        drive,
        gardenFolderId,
        fileName,
      );
    }

    if (!gatheringSpreadsheetId) {
      return c.json({ reported: false });
    }

    // 3. Directly batchGet '모임정보' and gardenName in ONE call
    let batchGetResp;
    try {
      batchGetResp = await sheets.spreadsheets.values.batchGet({
        spreadsheetId: gatheringSpreadsheetId,
        ranges: ["'모임정보'!A1:B10", `'${gardenName}'!A:B`],
      });
    } catch (err) {
      console.warn("batchGet failed for gathering report:", err.message);
      return c.json({ reported: false });
    }

    const valueRanges = batchGetResp.data.valueRanges || [];
    const infoValues = valueRanges[0]?.values || [];
    const memberValues = valueRanges[1]?.values || [];

    const infoMap = {};
    infoValues.forEach(([k, v]) => {
      if (k) infoMap[k.trim()] = v;
    });

    const gatheringDateTime = (infoMap["모임일시"] || "").trim();
    let time = "";
    if (gatheringDateTime.includes(" ")) {
      time = gatheringDateTime.split(" ")[1] || "";
    }
    const location = infoMap["모임장소"] || "";
    const notes = infoMap["모임내용 및 기도제목"] || "";

    const attendees = [];
    const absentees = [];

    memberValues.forEach((row) => {
      const memberName = (row[0] || "").toString().trim();
      const attendedVal = row[1];
      if (!memberName || memberName === "이름" || memberName === "성명") return;

      if (attendedVal === true || attendedVal === "TRUE") {
        attendees.push(memberName);
      } else {
        absentees.push(memberName);
      }
    });

    return c.json({
      reported: true,
      date,
      time,
      location,
      notes,
      attendees,
      absentees,
    });
  } catch (error) {
    console.error("getGatheringReportController Error:", error);
    return c.json(
      {
        error: "GetGatheringReportError",
        message:
          error.message ||
          "기존 정원 모임 보고를 불러오는 중 오류가 발생했습니다.",
      },
      500,
    );
  }
};

export const getGatheringHistoryController = async (c) => {
  try {
    const env = c.env;
    const user = c.get("user");
    const spreadsheetId = env.ATTENDANCE_SHEET_ID;
    const folderId = env.DRIVE_GATHERING_FOLDER_ID;

    if (!spreadsheetId || !folderId) {
      return c.json(
        {
          error: "ConfigError",
          message:
            "정원 모임 드라이브 폴더 설정(스프레드시트 ID 또는 드라이브 폴더 ID)이 누락되었습니다.",
        },
        500,
      );
    }

    const gardenName = c.req.query("gardenName");
    if (!gardenName) {
      return c.json(
        {
          error: "MissingRequiredParams",
          message: "정원명(gardenName) 파라미터가 필요합니다.",
        },
        400,
      );
    }

    const isStaff = user["cognito:groups"]?.includes("Staff") || false;

    if (!isStaff) {
      const assignedGardens = await getUserAssignedGardens(c, user);
      if (!assignedGardens.map((g) => g.trim()).includes(gardenName.trim())) {
        return c.json(
          {
            error: "UnauthorizedGardenReport",
            message:
              "본인이 담당하지 않은 정원의 모임 보고 내역을 조회할 수 없습니다.",
          },
          403,
        );
      }
    }

    const drive = getDriveClient(env);

    // 1. Garden folder ID lookup (do NOT create folder on GET)
    const gardenFolderId = await getGardenFolderId(drive, env, folderId, gardenName, {
      createIfNotExists: false,
    });

    // 2. Query files in garden subfolder only (if folder exists)
    if (!gardenFolderId) {
      return c.json({ dates: [] });
    }

    const subfolderList = await drive.files.list({
      q: `'${gardenFolderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
      spaces: "drive",
      fields: "files(id, name)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      pageSize: 500,
    });

    const allFiles = subfolderList.data.files || [];

    const datePattern = new RegExp(`^${gardenName.trim()}_(\\d{4}-\\d{2}-\\d{2})`);
    const dateSet = new Set();

    for (const f of allFiles) {
      const match = f.name?.match(datePattern);
      if (match && match[1]) {
        dateSet.add(match[1]);
      }
    }

    const dates = Array.from(dateSet).sort().reverse();
    return c.json({ dates });
  } catch (error) {
    console.error("getGatheringHistoryController Error:", error);
    return c.json(
      {
        error: "GetGatheringHistoryError",
        message:
          "정원 모임 보고 내역 조회 중 오류가 발생했습니다: " + error.message,
      },
      500,
    );
  }
};

export const postReportController = async (c) => {
  try {
    const env = c.env;
    const user = c.get("user");
    const spreadsheetId = env.ATTENDANCE_SHEET_ID;
    const folderId = env.DRIVE_WEEKLY_FOLDER_ID;

    if (!spreadsheetId) {
      return c.json(
        {
          error: "ConfigError",
          message: "출석부 스프레드시트 ID가 설정되지 않았습니다.",
        },
        500,
      );
    }
    if (!folderId) {
      return c.json(
        {
          error: "ConfigError",
          message: "주간 출석부 드라이브 폴더 ID가 설정되지 않았습니다.",
        },
        500,
      );
    }

    const body = await c.req.json();
    const { date, gardenName, attendees, absentees, absenceReasons } = body;
    if (!date || !gardenName || !attendees || !absentees) {
      return c.json(
        {
          error: "MissingRequiredFields",
          message:
            "필수 입력 항목(날짜, 정원명, 출석/결석 명단)이 누락되었습니다.",
        },
        400,
      );
    }

    const isStaff = user["cognito:groups"]?.includes("Staff") || false;
    let reporterName = isStaff ? "목회자/스태프" : (user.name || "");

    if (!isStaff) {
      if (!reporterName) {
        const userAttributes = await getCognitoUserAttributes(c);
        reporterName = userAttributes.name || "정원지기";
      }

      const assignedGardens = await getUserAssignedGardens(c, user);
      if (!assignedGardens.map((g) => g.trim()).includes(gardenName.trim())) {
        return c.json(
          {
            error: "UnauthorizedGardenReport",
            message: "본인이 담당하지 않은 정원의 출석을 보고할 수 없습니다.",
          },
          403,
        );
      }
    }

    const sheets = getSheetsClient(env);
    const drive = getDriveClient(env);

    // 2. Search for existing weekly file named 'OCCE_정원출석부_[date]' in DRIVE_FOLDER_ID
    const fileName = `OCCE_정원출석부_${date}`;
    console.log(
      `Searching for file '${fileName}' in Shared Drive folder '${folderId}'...`,
    );
    const searchResponse = await drive.files.list({
      q: `'${folderId}' in parents and name = '${fileName}' and trashed = false`,
      spaces: "drive",
      fields: "files(id, name)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    const filesList = searchResponse.data.files || [];
    let weeklySpreadsheetId = null;
    let targetTabId = null;
    let summaryTabId = null;

    if (filesList.length > 0) {
      weeklySpreadsheetId = filesList[0].id;
      console.log(`Found existing weekly spreadsheet: ${weeklySpreadsheetId}`);

      // Fetch only essential properties (sheetId, title) in a lightweight call
      const spreadsheetInfo = await sheets.spreadsheets.get({
        spreadsheetId: weeklySpreadsheetId,
        fields: "sheets(properties(sheetId,title))",
      });
      const targetTab = spreadsheetInfo.data.sheets.find(
        (s) => s.properties.title === gardenName,
      );
      if (!targetTab) {
        return c.json(
          {
            error: "GardenTabNotFound",
            message: `'${gardenName}' 탭이 스프레드시트에 존재하지 않습니다.`,
          },
          404,
        );
      }
      targetTabId = targetTab.properties.sheetId;

      const summaryTab = spreadsheetInfo.data.sheets.find(
        (s) => s.properties.title === "종합통계",
      );
      summaryTabId = summaryTab ? summaryTab.properties.sheetId : null;
    } else {
      // 3. File does not exist: Copy master spreadsheet to folderId
      console.log(
        `Weekly spreadsheet not found. Copying master spreadsheet ${spreadsheetId}...`,
      );
      const copyResponse = await drive.files.copy({
        fileId: spreadsheetId,
        requestBody: {
          name: fileName,
          parents: [folderId],
        },
        supportsAllDrives: true,
      });
      weeklySpreadsheetId = copyResponse.data.id;
      console.log(
        `Master spreadsheet copied successfully. New ID: ${weeklySpreadsheetId}`,
      );

      // 4. Initialize the copied weekly spreadsheet: Add '종합통계' tab and configure all garden tabs
      const weeklySpreadsheetInfo = await sheets.spreadsheets.get({
        spreadsheetId: weeklySpreadsheetId,
        fields: "sheets(properties(sheetId,title))",
      });
      const weeklySheets = weeklySpreadsheetInfo.data.sheets || [];
      const weeklySheetNames = weeklySheets.map((s) => s.properties.title);

      const targetTab = weeklySheets.find(
        (s) => s.properties.title === gardenName,
      );
      if (!targetTab) {
        return c.json(
          {
            error: "GardenTabNotFound",
            message: `'${gardenName}' 탭이 스프레드시트에 존재하지 않습니다.`,
          },
          404,
        );
      }
      targetTabId = targetTab.properties.sheetId;

      // Create '종합통계' sheet tab at index 0
      console.log("Creating '종합통계' tab...");
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

      // Filter to get only garden tabs
      const gardenTabs = weeklySheetNames.filter(
        (name) =>
          name !== "정원지기" &&
          name !== "종합통계" &&
          name !== "정원모임보고" &&
          !/^\d{4}-\d{2}-\d{2}$/.test(name),
      );

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
    }

    // 5. Update reported garden attendance in its tab & update '보고여부' in '종합통계' sheet in a single batch
    console.log(`Updating attendance in tab '${gardenName}'...`);
    const batchGetResp = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: weeklySpreadsheetId,
      ranges: [`${gardenName}!A:A`, "종합통계!A:F"],
    });
    const rowsList = batchGetResp.data.valueRanges[0].values || [];
    const summaryRowsData = batchGetResp.data.valueRanges[1].values || [];

    const members = rowsList
      .map((r) => r[0]?.toString().trim())
      .filter((name) => name && name !== "이름" && name !== "성명");

    let gardenRowIdx = -1;
    for (let i = 1; i < summaryRowsData.length; i++) {
      if (summaryRowsData[i][1]?.toString().trim() === gardenName.trim()) {
        gardenRowIdx = i; // 0-based index
        break;
      }
    }

    const updateRequests = [];

    if (members.length > 0) {
      const rowsData = members.map((name) => {
        const isPresent = attendees.includes(name);
        const reason = absenceReasons?.[name] || "";
        return {
          values: [
            {
              userEnteredValue: {
                boolValue: isPresent,
              },
              note: !isPresent && reason ? reason : "",
            },
          ],
        };
      });

      updateRequests.push({
        updateCells: {
          rows: rowsData,
          fields: "userEnteredValue,note",
          range: {
            sheetId: targetTabId,
            startRowIndex: 0,
            endRowIndex: members.length,
            startColumnIndex: 1,
            endColumnIndex: 2,
          },
        },
      });
    }

    if (summaryTabId && gardenRowIdx !== -1) {
      updateRequests.push({
        updateCells: {
          rows: [
            {
              values: [
                {
                  userEnteredValue: {
                    boolValue: true,
                  },
                },
              ],
            },
          ],
          fields: "userEnteredValue",
          range: {
            sheetId: summaryTabId,
            startRowIndex: gardenRowIdx,
            endRowIndex: gardenRowIdx + 1,
            startColumnIndex: 0,
            endColumnIndex: 1,
          },
        },
      });
    }

    if (updateRequests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: weeklySpreadsheetId,
        requestBody: {
          requests: updateRequests,
        },
      });
    }

    // Cache fileId for fast subsequent lookups
    fileIdCache.set(`${folderId}_${fileName}`, {
      fileId: weeklySpreadsheetId,
      expiresAt: Date.now() + 3 * 60 * 1000,
    });

    console.log(
      `✅ Attendance reported successfully for ${gardenName} on ${date} (Weekly Sheet updated with native checkboxes and comments)`,
    );
    return c.body(null, 200);
  } catch (error) {
    console.error("postReportController Error:", error);
    return c.json(
      {
        error: "PostReportError",
        message:
          error.message || "출석 보고서를 제출하는 중 오류가 발생했습니다.",
      },
      500,
    );
  }
};

export const postGatheringReportController = async (c) => {
  try {
    const env = c.env;
    const user = c.get("user");
    const spreadsheetId = env.ATTENDANCE_SHEET_ID;
    const folderId = env.DRIVE_GATHERING_FOLDER_ID;

    if (!spreadsheetId) {
      return c.json(
        {
          error: "ConfigError",
          message: "출석부 스프레드시트 ID가 설정되지 않았습니다.",
        },
        500,
      );
    }
    if (!folderId) {
      return c.json(
        {
          error: "ConfigError",
          message: "정원 모임 드라이브 폴더 ID가 설정되지 않았습니다.",
        },
        500,
      );
    }

    const body = await c.req.json();
    const { date, time, location, notes, gardenName, attendees, absentees } =
      body;
    if (!date || !gardenName || !attendees || !absentees) {
      return c.json(
        {
          error: "MissingRequiredFields",
          message:
            "필수 입력 항목(날짜, 정원명, 출석/결석 명단)이 누락되었습니다.",
        },
        400,
      );
    }

    const isStaff = user["cognito:groups"]?.includes("Staff") || false;
    let reporterName = isStaff ? "목회자/스태프" : (user.name || "");

    if (!isStaff) {
      if (!reporterName) {
        const userAttributes = await getCognitoUserAttributes(c);
        reporterName = userAttributes.name || "정원지기";
      }

      const assignedGardens = await getUserAssignedGardens(c, user);
      if (!assignedGardens.map((g) => g.trim()).includes(gardenName.trim())) {
        return c.json(
          {
            error: "UnauthorizedGardenReport",
            message: "본인이 담당하지 않은 정원의 출석을 보고할 수 없습니다.",
          },
          403,
        );
      }
    }

    const sheets = getSheetsClient(env);
    const drive = getDriveClient(env);

    // 2. Search for existing file named '[GardenName]_[Date]' in garden subfolder or root folder
    const fileName = `${gardenName}_${date}`;
    const gardenFolderId = await getGardenFolderId(
      drive,
      env,
      folderId,
      gardenName,
      { createIfNotExists: true },
    );

    console.log(
      `Searching for existing file '${fileName}' in garden folder '${gardenFolderId}'...`,
    );
    let searchResponse = await drive.files.list({
      q: `name = '${fileName}' and '${gardenFolderId}' in parents and trashed = false`,
      spaces: "drive",
      fields: "files(id, name)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    let filesList = searchResponse.data.files || [];

    let weeklySpreadsheetId = null;

    if (filesList.length > 0) {
      // 3-A. File already exists: reuse the existing file (fast update without copying/trashing)
      weeklySpreadsheetId = filesList[0].id;
      console.log(
        `Existing gathering spreadsheet found (${weeklySpreadsheetId}). Updating in-place...`,
      );

      // Clean up extra duplicates if any exist from past runs
      if (filesList.length > 1) {
        for (const extraFile of filesList.slice(1)) {
          try {
            await drive.files.update({
              fileId: extraFile.id,
              requestBody: { trashed: true },
              supportsAllDrives: true,
            });
          } catch (err) {
            console.warn(
              `Failed to clean duplicate file ${extraFile.id}:`,
              err.message,
            );
          }
        }
      }
    } else {
      // 3-B. File does not exist: Copy master spreadsheet to garden subfolder
      console.log(
        `Gathering spreadsheet not found. Copying master spreadsheet ${spreadsheetId} to '${fileName}' in garden folder '${gardenFolderId}'...`,
      );
      const copyResponse = await drive.files.copy({
        fileId: spreadsheetId,
        requestBody: {
          name: fileName,
          parents: [gardenFolderId],
        },
        supportsAllDrives: true,
      });
      weeklySpreadsheetId = copyResponse.data.id;
      console.log(
        `Spreadsheet copied successfully. New ID: ${weeklySpreadsheetId}`,
      );

      // 4. Initialize the newly copied spreadsheet: Add '모임정보' tab, keep only 'gardenName' tab
      const weeklySpreadsheetInfo = await sheets.spreadsheets.get({
        spreadsheetId: weeklySpreadsheetId,
        fields: "sheets(properties(sheetId,title))",
      });
      const weeklySheets = weeklySpreadsheetInfo.data.sheets || [];

      const currentTab = weeklySheets.find(
        (s) => s.properties.title === gardenName,
      );
      const currentTabId = currentTab ? currentTab.properties.sheetId : null;

      const batchRequests = [
        { addSheet: { properties: { title: "모임정보", index: 0 } } },
      ];

      // Queue deletion of all other tabs except the active gardenName
      weeklySheets.forEach((sheet) => {
        const title = sheet.properties.title;
        const id = sheet.properties.sheetId;
        if (title !== gardenName) {
          batchRequests.push({ deleteSheet: { sheetId: id } });
        }
      });

      // Get members from master tab to count for initial validation rule
      const membersInitResp = await sheets.spreadsheets.values.get({
        spreadsheetId: weeklySpreadsheetId,
        range: `${gardenName}!A:A`,
      });
      const initRows = membersInitResp.data.values || [];
      const initMembers = initRows
        .map((r) => r[0]?.toString().trim())
        .filter((name) => name && name !== "이름" && name !== "성명");
      const initMemberCount = initMembers.length;

      if (currentTabId && initMemberCount > 0) {
        batchRequests.push({
          setDataValidation: {
            range: {
              sheetId: currentTabId,
              startRowIndex: 0,
              endRowIndex: initMemberCount,
              startColumnIndex: 1,
              endColumnIndex: 2,
            },
            rule: {
              condition: { type: "BOOLEAN" },
              showCustomUi: true,
            },
          },
        });
      }

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: weeklySpreadsheetId,
        requestBody: { requests: batchRequests },
      });
    }

    // 5. Get current members from column A of the garden tab
    const membersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: weeklySpreadsheetId,
      range: `${gardenName}!A:A`,
    });
    const rows = membersResponse.data.values || [];
    const members = rows
      .map((r) => r[0]?.toString().trim())
      .filter((name) => name && name !== "이름" && name !== "성명");
    const memberCount = members.length;

    // 6. Write gathering info to '모임정보' tab and attendance checkboxes in a single batch values update
    const localNow = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstNow = new Date(localNow.getTime() + kstOffset);
    const timestamp = kstNow.toISOString().replace("T", " ").substring(0, 16);
    const gatheringDateTime = `${date} ${time}`;

    const infoRows = [
      ["구분", "내용"],
      ["모임정원", gardenName],
      ["모임일시", gatheringDateTime],
      ["모임장소", location || ""],
      ["총원", `=COUNTA('${gardenName}'!A1:A200)`],
      ["참석", `=COUNTIF('${gardenName}'!B1:B200, TRUE)`],
      ["결석", `=COUNTIF('${gardenName}'!B1:B200, FALSE)`],
      ["모임내용 및 기도제목", notes || ""],
      ["보고일시", timestamp],
    ];

    const checkboxValues = members.map((name) => [attendees.includes(name)]);

    const updateData = [
      {
        range: "모임정보!A1",
        values: infoRows,
      },
    ];

    if (memberCount > 0) {
      updateData.push({
        range: `${gardenName}!B1:B${memberCount}`,
        values: checkboxValues,
      });
    }

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: weeklySpreadsheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: updateData,
      },
    });

    // Cache fileId for fast subsequent lookups
    fileIdCache.set(`${gardenFolderId}_${fileName}`, {
      fileId: weeklySpreadsheetId,
      expiresAt: Date.now() + 3 * 60 * 1000,
    });
    fileIdCache.set(`${folderId}_${fileName}`, {
      fileId: weeklySpreadsheetId,
      expiresAt: Date.now() + 3 * 60 * 1000,
    });

    console.log(
      `✅ Garden gathering report submitted successfully for '${fileName}' (Spreadsheet ID: ${weeklySpreadsheetId})`,
    );
    return c.body(null, 200);
  } catch (error) {
    console.error("postGatheringReportController Error:", error);
    return c.json(
      {
        error: "PostGatheringReportError",
        message:
          error.message ||
          "정원 모임 보고서를 제출하는 중 오류가 발생했습니다.",
      },
      500,
    );
  }
};
