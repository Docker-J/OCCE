import { google } from "googleapis";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getGoogleAuth } from "../api/googleAuth.js";

// Helper to get Cognito client
const getCognitoClient = (env) => {
  return new CognitoIdentityProviderClient({
    region: env.AWS_REGION || "us-west-2",
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });
};

// Helper to fetch user attributes from Cognito using Access Token
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

// Helper to get Google Sheets client
const getSheetsClient = (env) => {
  const auth = getGoogleAuth(env, [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ]);
  return google.sheets({ version: "v4", auth });
};

// Helper to get Google Drive client
const getDriveClient = (env) => {
  const auth = getGoogleAuth(env, [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ]);
  return google.drive({ version: "v3", auth });
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
    let cleanUserPhone = "";

    // Only non-staff need to verify mapping against '정원지기' tab
    if (!isStaff) {
      const userAttributes = await getCognitoUserAttributes(c);
      const rawPhone = userAttributes.phone_number || "";
      cleanUserPhone = rawPhone.replace(/\D/g, "");
    }

    const sheets = getSheetsClient(env);

    // 1. Read sheet metadata to get tab names
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetNames = spreadsheet.data.sheets.map((s) => s.properties.title);

    let assignedGardens = [];

    if (!isStaff) {
      // 2. Read Garden Keepers mapping sheet
      if (!sheetNames.includes("정원지기")) {
        return c.json(
          {
            error: "SheetTabNotFound",
            message: "스프레드시트에 '정원지기' 탭이 존재하지 않습니다.",
          },
          500,
        );
      }

      const keepersResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "정원지기!A:D",
      });
      const keeperRows = keepersResponse.data.values || [];

      // Dynamically skip header if it exists
      const startIdx =
        keeperRows[0]?.[0] === "이름" || keeperRows[0]?.[0] === "성명" ? 1 : 0;

      for (const row of keeperRows.slice(startIdx)) {
        const phone = row[2]?.toString().replace(/\D/g, "") || "";
        const gardensStr = row[3]?.toString().trim() || "";

        if (
          cleanUserPhone.length >= 10 &&
          phone.length >= 10 &&
          phone.slice(-10) === cleanUserPhone.slice(-10)
        ) {
          assignedGardens = gardensStr
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean);
          break;
        }
      }

      // Authorization: Non-staff users must be mapped to at least one garden
      if (assignedGardens.length === 0) {
        return c.json(
          {
            error: "NotAssignedLeader",
            message:
              "이 계정의 전화번호가 스프레드시트의 '정원지기' 명단에 존재하지 않거나 담당 정원이 매핑되지 않았습니다.",
          },
          403,
        );
      }
    }

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
          error.message || "정원 및 교인 목록을 불러오는 중 오류가 발생했습니다.",
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
          message: "필수 입력 항목(날짜, 정원명, 출석/결석 명단)이 누락되었습니다.",
        },
        400,
      );
    }

    const isStaff = user["cognito:groups"]?.includes("Staff") || false;
    let cleanUserPhone = "";
    let reporterName = isStaff ? "목회자/스태프" : "";

    // Only non-staff need to verify mapping against '정원지기' tab
    if (!isStaff) {
      const userAttributes = await getCognitoUserAttributes(c);
      const rawPhone = userAttributes.phone_number || "";
      cleanUserPhone = rawPhone.replace(/\D/g, "");
      reporterName = userAttributes.name || user.name || "";
    }

    const sheets = getSheetsClient(env);
    const drive = getDriveClient(env);

    let assignedGardens = [];

    if (!isStaff) {
      // 1. Read keepers mapping from the master spreadsheet to check authorization and get reporterName
      const keepersResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "정원지기!A:D",
      });
      const keeperRows = keepersResponse.data.values || [];
      const startIdx =
        keeperRows[0]?.[0] === "이름" || keeperRows[0]?.[0] === "성명" ? 1 : 0;

      for (const row of keeperRows.slice(startIdx)) {
        const phone = row[2]?.toString().replace(/\D/g, "") || "";
        const name = row[0]?.toString().trim();
        const gardensStr = row[3]?.toString().trim() || "";

        if (
          cleanUserPhone.length >= 10 &&
          phone.length >= 10 &&
          phone.slice(-10) === cleanUserPhone.slice(-10)
        ) {
          assignedGardens = gardensStr
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean);
          reporterName = name || reporterName || "";
          break;
        }
      }

      // Security check for non-staff
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

      // Find '정원지기' tab to delete
      const keepersSheet = weeklySheets.find(
        (s) => s.properties.title === "정원지기",
      );
      const keepersSheetId = keepersSheet
        ? keepersSheet.properties.sheetId
        : null;

      // Create '종합통계' sheet tab at index 0 and delete '정원지기' sheet tab
      console.log("Creating '종합통계' tab and deleting '정원지기' tab...");
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
      if (keepersSheetId) {
        batchRequests.push({
          deleteSheet: {
            sheetId: keepersSheetId,
          },
        });
      }

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
          message: "필수 입력 항목(날짜, 정원명, 출석/결석 명단)이 누락되었습니다.",
        },
        400,
      );
    }

    const isStaff = user["cognito:groups"]?.includes("Staff") || false;
    let cleanUserPhone = "";
    let reporterName = isStaff ? "목회자/스태프" : "";

    if (!isStaff) {
      const userAttributes = await getCognitoUserAttributes(c);
      const rawPhone = userAttributes.phone_number || "";
      cleanUserPhone = rawPhone.replace(/\D/g, "");
      reporterName = userAttributes.name || user.name || "";
    }

    const sheets = getSheetsClient(env);
    const drive = getDriveClient(env);

    let assignedGardens = [];

    if (!isStaff) {
      // 1. Read keepers mapping from the master spreadsheet to check authorization and get reporterName
      const keepersResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "정원지기!A:D",
      });
      const keeperRows = keepersResponse.data.values || [];
      const startIdx =
        keeperRows[0]?.[0] === "이름" || keeperRows[0]?.[0] === "성명" ? 1 : 0;

      for (const row of keeperRows.slice(startIdx)) {
        const phone = row[2]?.toString().replace(/\D/g, "") || "";
        const name = row[0]?.toString().trim();
        const gardensStr = row[3]?.toString().trim() || "";

        if (
          cleanUserPhone.length >= 10 &&
          phone.length >= 10 &&
          phone.slice(-10) === cleanUserPhone.slice(-10)
        ) {
          assignedGardens = gardensStr
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean);
          reporterName = name || reporterName || "";
          break;
        }
      }

      // Security check for non-staff
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

    // 2. Search for existing file named '[GardenName]_[Date]' in DRIVE_FOLDER_ID
    const fileName = `${gardenName}_${date}`;
    console.log(
      `Searching for existing file '${fileName}' in Shared Drive folder '${folderId}'...`,
    );
    const searchResponse = await drive.files.list({
      q: `name = '${fileName}' and '${folderId}' in parents and trashed = false`,
      spaces: "drive",
      fields: "files(id, name)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    const filesList = searchResponse.data.files || [];
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
            console.warn(`Failed to clean duplicate file ${extraFile.id}:`, err.message);
          }
        }
      }
    } else {
      // 3-B. File does not exist: Copy master spreadsheet to folderId
      console.log(
        `Gathering spreadsheet not found. Copying master spreadsheet ${spreadsheetId} to '${fileName}'...`,
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
    // Adjust to local timezone KST (UTC+9)
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
          error.message || "정원 모임 보고서를 제출하는 중 오류가 발생했습니다.",
      },
      500,
    );
  }
};
