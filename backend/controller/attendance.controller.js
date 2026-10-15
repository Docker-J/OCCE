import {
  getSheetsClient,
  getDriveClient,
  findDriveFileId,
  setDriveFileIdCache,
} from "../api/googleClients.js";

import {
  getUserAssignedGardens,
  initializeWeeklySpreadsheet,
} from "./attendance.helpers.js";

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

    // 2. Search for existing weekly file named 'OCCE_정원출석부_[date]' in DRIVE_FOLDER_ID
    const fileName = `OCCE_정원출석부_${date}`;
    console.log(
      `Searching for file '${fileName}' in Shared Drive folder '${folderId}'...`,
    );
    let weeklySpreadsheetId = await findDriveFileId(drive, folderId, fileName);
    let targetTabId = null;
    let summaryTabId = null;

    if (weeklySpreadsheetId) {
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
      if (!summaryTabId) {
        console.log(`⚠️ '종합통계' tab missing from ${fileName}, initializing...`);
        summaryTabId = await initializeWeeklySpreadsheet(
          sheets,
          weeklySpreadsheetId,
        );
      }
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
      summaryTabId = await initializeWeeklySpreadsheet(
        sheets,
        weeklySpreadsheetId,
      );

      const weeklySpreadsheetInfo = await sheets.spreadsheets.get({
        spreadsheetId: weeklySpreadsheetId,
        fields: "sheets(properties(sheetId,title))",
      });
      const weeklySheets = weeklySpreadsheetInfo.data.sheets || [];
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
    setDriveFileIdCache(folderId, fileName, weeklySpreadsheetId);

    // Invalidate admin attendance dashboard KV summary cache for this weekly sheet
    if (env.weeklyupdate_kv && weeklySpreadsheetId) {
      try {
        await env.weeklyupdate_kv.delete(`admin_att_summary_${weeklySpreadsheetId}`);
      } catch (kvDelErr) {
        console.warn(
          `[Attendance] Failed to invalidate KV cache for ${weeklySpreadsheetId}:`,
          kvDelErr,
        );
      }
    }

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

