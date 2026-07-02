import { google } from "googleapis";
import path from "path";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const KEY_PATH = path.join(process.cwd(), "church-4385c-ceedf27e8d20.json");

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

// Helper to get Google Sheets client
const getSheetsClient = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });
  return google.sheets({ version: "v4", auth });
};

// Helper to get actual name from Cognito profile
const getCognitoUserName = async (accessToken) => {
  try {
    const command = new GetUserCommand({ AccessToken: accessToken });
    const response = await cognitoClient.send(command);
    const nameAttr = response.UserAttributes.find(
      (attr) => attr.Name === "name",
    );
    return nameAttr ? nameAttr.Value : "";
  } catch (error) {
    console.error("Error fetching Cognito user name:", error);
    throw error;
  }
};

// Helper to get Google Drive client
const getDriveClient = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });
  return google.drive({ version: "v3", auth });
};

export const getGardensController = async (req, res) => {
  const spreadsheetId = process.env.ATTENDANCE_SHEET_ID;
  if (!spreadsheetId) {
    return res
      .status(500)
      .json({ error: "Attendance Sheet ID is not configured." });
  }

  const isStaff = req.user["cognito:groups"]?.includes("Staff") || false;
  const cleanUserPhone = req.user.username.replace(/\D/g, ""); // e.g. "17801234567"

  try {
    const sheets = getSheetsClient();

    // 1. Read sheet metadata to get tab names
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetNames = spreadsheet.data.sheets.map((s) => s.properties.title);

    // 2. Read Garden Keepers mapping sheet
    if (!sheetNames.includes("정원지기")) {
      return res
        .status(500)
        .json({ error: "'정원지기' tab not found in the spreadsheet." });
    }

    const keepersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "정원지기!A:D",
    });
    const keeperRows = keepersResponse.data.values || [];

    // Dynamically skip header if it exists
    const startIdx =
      keeperRows[0]?.[0] === "이름" || keeperRows[0]?.[0] === "성명" ? 1 : 0;
    let assignedGardens = [];
    for (const row of keeperRows.slice(startIdx)) {
      const phone = row[2]?.toString().replace(/\D/g, "") || "";
      const gardensStr = row[3]?.toString().trim() || "";

      if (phone.slice(-10) === cleanUserPhone.slice(-10)) {
        assignedGardens = gardensStr
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean);
        break;
      }
    }

    // Authorization: Non-staff users must be mapped to at least one garden
    if (!isStaff && assignedGardens.length === 0) {
      return res.status(403).json({
        error: "NotAssignedLeader",
        message:
          "이 계정의 전화번호가 스프레드시트의 '정원지기' 명단에 존재하지 않거나 정원이 매핑되지 않았습니다.",
      });
    }

    const gardensData = {};

    if (isStaff) {
      // Staff can see all gardens. Filter out metadata tabs.
      const gardenTabs = sheetNames.filter(
        (name) =>
          name !== "정원지기" &&
          name !== "출석보고" &&
          !/^\d{4}-\d{2}-\d{2}$/.test(name),
      );

      if (gardenTabs.length > 0) {
        // Use batchGet to fetch all garden member lists in one API request
        const ranges = gardenTabs.map((name) => `${name}!A:A`);
        const batchResponse = await sheets.spreadsheets.values.batchGet({
          spreadsheetId,
          ranges,
        });

        batchResponse.data.valueRanges.forEach((vr, idx) => {
          const gardenName = gardenTabs[idx];
          const rows = vr.values || [];
          // Filter out header row (like "이름") or empty values
          const members = rows
            .map((r) => r[0]?.toString().trim())
            .filter((name) => name && name !== "이름");
          gardensData[gardenName] = members;
        });
      }
    } else {
      // GardenKeeper can only see their assigned gardens
      for (const garden of assignedGardens) {
        if (!sheetNames.includes(garden)) {
          console.warn(`Garden tab '${garden}' not found in spreadsheet.`);
          continue;
        }

        const memberResponse = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${garden}!A:A`,
        });
        const rows = memberResponse.data.values || [];
        const members = rows
          .map((r) => r[0]?.toString().trim())
          .filter((name) => name && name !== "이름");
        gardensData[garden] = members;
      }
    }

    res.json({
      isStaff,
      assignedGarden: assignedGardens[0] || null, // Default to first assigned garden
      gardens: gardensData,
    });
  } catch (error) {
    console.error("Error in getGardensController:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve gardens and members data." });
  }
};

export const postReportController = async (req, res) => {
  const spreadsheetId = process.env.ATTENDANCE_SHEET_ID;
  const folderId = process.env.DRIVE_FOLDER_ID;

  if (!spreadsheetId) {
    return res
      .status(500)
      .json({ error: "Attendance Sheet ID is not configured." });
  }
  if (!folderId) {
    return res
      .status(500)
      .json({ error: "Drive Folder ID is not configured." });
  }

  const { date, gardenName, attendees, absentees, absenceReasons } = req.body;
  if (!date || !gardenName || !attendees || !absentees) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const isStaff = req.user["cognito:groups"]?.includes("Staff") || false;
  const cleanUserPhone = req.user.username.replace(/\D/g, "");

  try {
    const sheets = getSheetsClient();
    const drive = getDriveClient();

    // 1. Read keepers mapping from the master spreadsheet to check authorization and get reporterName
    const keepersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "정원지기!A:D",
    });
    const keeperRows = keepersResponse.data.values || [];
    const startIdx =
      keeperRows[0]?.[0] === "이름" || keeperRows[0]?.[0] === "성명" ? 1 : 0;

    let assignedGardens = [];
    let reporterName = null;

    for (const row of keeperRows.slice(startIdx)) {
      const phone = row[2]?.toString().replace(/\D/g, "") || "";
      const name = row[0]?.toString().trim();
      const gardensStr = row[3]?.toString().trim() || "";

      if (phone.slice(-10) === cleanUserPhone.slice(-10)) {
        assignedGardens = gardensStr
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean);
        reporterName = name;
        break;
      }
    }

    // Security check for non-staff
    if (!isStaff) {
      if (!assignedGardens.includes(gardenName)) {
        return res.status(403).json({
          error: "UnauthorizedGardenReport",
          message: "본인이 담당하지 않은 정원의 출석을 보고할 수 없습니다.",
        });
      }
    }

    // Fallback for reporterName
    if (!reporterName) {
      try {
        const authHeader = req.header("Authorization");
        const token = authHeader?.split(" ")[1];
        if (token) {
          const fetchPromise = getCognitoUserName(token);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Cognito request timeout")),
              2500,
            ),
          );
          reporterName = await Promise.race([fetchPromise, timeoutPromise]);
        }
      } catch (err) {
        console.warn(
          "Failed or timed out fetching name from Cognito:",
          err.message,
        );
      }
      if (!reporterName) {
        reporterName = isStaff ? "목회자/스태프" : cleanUserPhone;
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
    const files = searchResponse.data.files || [];
    let weeklySpreadsheetId = null;

    if (files.length > 0) {
      weeklySpreadsheetId = files[0].id;
      console.log(`Found existing weekly spreadsheet: ${weeklySpreadsheetId}`);
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
      });
      const weeklySheetNames = weeklySpreadsheetInfo.data.sheets.map(
        (s) => s.properties.title,
      );

      // Find '정원지기' tab to delete
      const keepersSheet = weeklySpreadsheetInfo.data.sheets.find(
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

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: weeklySpreadsheetId,
        requestBody: {
          requests: batchRequests,
        },
      });

      // Filter to get only garden tabs
      const gardenTabs = weeklySheetNames.filter(
        (name) =>
          name !== "정원지기" &&
          name !== "종합통계" &&
          name !== "출석부" &&
          name !== "출석보고" &&
          !/^\d{4}-\d{2}-\d{2}$/.test(name),
      );

      // Fetch members count of all garden tabs to populate '종합통계' and initialize checkboxes
      const ranges = gardenTabs.map((name) => `${name}!A:A`);
      const batchResponse = await sheets.spreadsheets.values.batchGet({
        spreadsheetId: weeklySpreadsheetId,
        ranges,
      });

      const summaryRows = [["구분", "정원", "총원", "출석", "결석", "출석율"]];

      const validationRequests = [];
      const updateValueRequests = [];

      // Get the sheetId of the newly created '종합통계' sheet
      const updatedSpreadsheetInfo = await sheets.spreadsheets.get({
        spreadsheetId: weeklySpreadsheetId,
      });
      const totalSummarySheet = updatedSpreadsheetInfo.data.sheets.find(
        (s) => s.properties.title === "종합통계",
      );
      const summarySheetId = totalSummarySheet
        ? totalSummarySheet.properties.sheetId
        : null;

      gardenTabs.forEach((gardenTabName, idx) => {
        const vr = batchResponse.data.valueRanges[idx];
        const rows = vr.values || [];
        const members = rows
          .map((r) => r[0]?.toString().trim())
          .filter((name) => name && name !== "이름" && name !== "성명");

        const memberCount = members.length;
        const rowIdx = idx + 2; // 1-based index (header is 1)

        // Formulas:
        // C: 총원, D: 출석, E: 결석, F: 출석율
        summaryRows.push([
          idx + 1,
          gardenTabName,
          `=COUNTA('${gardenTabName}'!A1:A200)`,
          `=COUNTIF('${gardenTabName}'!B1:B200, TRUE)`,
          `=COUNTIF('${gardenTabName}'!B1:B200, FALSE)`,
          `=IFERROR(D${rowIdx}/C${rowIdx}, 0)`,
        ]);

        // Initialize Column B with false and apply native checkbox validation
        const currentTab = updatedSpreadsheetInfo.data.sheets.find(
          (s) => s.properties.title === gardenTabName,
        );
        const currentTabId = currentTab ? currentTab.properties.sheetId : null;

        if (currentTabId && memberCount > 0) {
          const falseValues = Array(memberCount).fill([false]);
          updateValueRequests.push({
            range: `${gardenTabName}!B1:B${memberCount}`,
            values: falseValues,
          });

          for (let mIdx = 0; mIdx < memberCount; mIdx++) {
            const sheetRowIndex = mIdx; // Member 0 at Row 1 (index 0)
            validationRequests.push({
              setDataValidation: {
                range: {
                  sheetId: currentTabId,
                  startRowIndex: sheetRowIndex,
                  endRowIndex: sheetRowIndex + 1,
                  startColumnIndex: 1, // Column B is index 1
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
        }
      });

      // Write '종합통계' values
      await sheets.spreadsheets.values.update({
        spreadsheetId: weeklySpreadsheetId,
        range: "종합통계!A1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: summaryRows,
        },
      });

      // Initialize checkbox values in each garden tab
      if (updateValueRequests.length > 0) {
        await sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: weeklySpreadsheetId,
          requestBody: {
            valueInputOption: "USER_ENTERED",
            data: updateValueRequests,
          },
        });
      }

      // Add '종합통계' percentage formatting (Column F, rows 2 to gardenTabs.length + 1)
      if (summarySheetId && gardenTabs.length > 0) {
        validationRequests.push({
          repeatCell: {
            range: {
              sheetId: summarySheetId,
              startRowIndex: 1,
              endRowIndex: gardenTabs.length + 1,
              startColumnIndex: 5, // Column F is index 5
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

    // 5. Update reported garden attendance in its tab (Native Checkbox + Note comments)
    console.log(`Updating attendance in tab '${gardenName}'...`);
    const currentSpreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: weeklySpreadsheetId,
    });
    const currentTab = currentSpreadsheetInfo.data.sheets.find(
      (s) => s.properties.title === gardenName,
    );
    if (!currentTab) {
      return res.status(404).json({
        error: "GardenTabNotFound",
        message: `'${gardenName}' 탭이 스프레드시트에 존재하지 않습니다.`,
      });
    }
    const currentTabId = currentTab.properties.sheetId;

    const memberResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: weeklySpreadsheetId,
      range: `${gardenName}!A:A`,
    });
    const rows = memberResponse.data.values || [];
    const members = rows
      .map((r) => r[0]?.toString().trim())
      .filter((name) => name && name !== "이름" && name !== "성명");

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
              note: !isPresent && reason ? reason : "", // Set note to reason if absent, else clear note
            },
          ],
        };
      });

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: weeklySpreadsheetId,
        requestBody: {
          requests: [
            {
              updateCells: {
                rows: rowsData,
                fields: "userEnteredValue,note",
                range: {
                  sheetId: currentTabId,
                  startRowIndex: 0,
                  endRowIndex: members.length,
                  startColumnIndex: 1, // Column B (index 1)
                  endColumnIndex: 2,
                },
              },
            },
          ],
        },
      });
    }

    console.log(
      `✅ Attendance reported successfully for ${gardenName} on ${date} (Weekly Sheet updated with native checkboxes and comments)`,
    );
    res.sendStatus(200);
  } catch (error) {
    console.error("Error in postReportController:", error);
    res.status(500).json({ error: "Failed to submit attendance report." });
  }
};
