import {
  getSheetsClient,
  getDriveClient,
  findDriveFileId,
  setDriveFileIdCache,
} from "../api/googleClients.js";

import {
  getUserAssignedGardens,
  getGardenFolderId,
} from "./attendance.helpers.js";

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
            message:
              "본인이 담당하지 않은 정원의 모임 보고를 조회할 수 없습니다.",
          },
          403,
        );
      }
    }

    const sheets = getSheetsClient(env);
    const drive = getDriveClient(env);
    const fileName = `${gardenName}_${date}`;

    // 1. Garden folder ID lookup (do NOT create folder on GET)
    const gardenFolderId = await getGardenFolderId(
      drive,
      env,
      folderId,
      gardenName,
      {
        createIfNotExists: false,
      },
    );

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
    const gardenFolderId = await getGardenFolderId(
      drive,
      env,
      folderId,
      gardenName,
      {
        createIfNotExists: false,
      },
    );

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

    const datePattern = new RegExp(
      `^${gardenName.trim()}_(\\d{4}-\\d{2}-\\d{2})`,
    );
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

    if (!isStaff) {
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
    setDriveFileIdCache(gardenFolderId, fileName, weeklySpreadsheetId);
    setDriveFileIdCache(folderId, fileName, weeklySpreadsheetId);

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
