import { google } from "googleapis";
import { getGoogleAuth } from "../api/googleAuth.js";

// Helper to get Google Sheets client
const getSheetsClient = (env) => {
  const auth = getGoogleAuth(env, [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ]);
  return google.sheets({ version: "v4", auth });
};

// Helper to get Google Sheets client

// Helper to get Google Drive client
const getDriveClient = (env) => {
  const auth = getGoogleAuth(env, [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ]);
  return google.drive({ version: "v3", auth });
};

export const getGardensController = async (c) => {
  const env = c.env;
  const user = c.get("user");
  const spreadsheetId = env.ATTENDANCE_SHEET_ID;

  if (!spreadsheetId) {
    return c.json({ error: "Attendance Sheet ID is not configured." }, 500);
  }

  const isStaff = user["cognito:groups"]?.includes("Staff") || false;
  let cleanUserPhone = "";

  // Only non-staff need to verify mapping against '정원지기' tab
  if (!isStaff) {
    cleanUserPhone = (user.phone_number || "").replace(/\D/g, "");
  }

  try {
    const sheets = getSheetsClient(env);

    // 1. Read sheet metadata to get tab names
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetNames = spreadsheet.data.sheets.map((s) => s.properties.title);

    let assignedGardens = [];

    if (!isStaff) {
      // 2. Read Garden Keepers mapping sheet
      if (!sheetNames.includes("정원지기")) {
        return c.json(
          { error: "'정원지기' tab not found in the spreadsheet." },
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

        if (phone.slice(-10) === cleanUserPhone.slice(-10)) {
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
              "이 계정의 전화번호가 스프레드시트의 '정원지기' 명단에 존재하지 않거나 정원이 매핑되지 않았습니다.",
          },
          403,
        );
      }
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

    return c.json({
      isStaff,
      assignedGarden: assignedGardens[0] || null, // Default to first assigned garden
      gardens: gardensData,
    });
  } catch (error) {
    console.error("Error in getGardensController:", error);
    return c.json(
      { error: "Failed to retrieve gardens and members data." },
      500,
    );
  }
};

export const postReportController = async (c) => {
  const env = c.env;
  const user = c.get("user");
  const spreadsheetId = env.ATTENDANCE_SHEET_ID;
  const folderId = env.DRIVE_FOLDER_ID;

  if (!spreadsheetId) {
    return c.json({ error: "Attendance Sheet ID is not configured." }, 500);
  }
  if (!folderId) {
    return c.json({ error: "Drive Folder ID is not configured." }, 500);
  }

  const body = await c.req.json();
  const { date, gardenName, attendees, absentees, absenceReasons } = body;
  if (!date || !gardenName || !attendees || !absentees) {
    return c.json({ error: "Missing required fields." }, 400);
  }

  const isStaff = user["cognito:groups"]?.includes("Staff") || false;
  let cleanUserPhone = "";

  // Only non-staff need to verify mapping against '정원지기' tab
  if (!isStaff) {
    cleanUserPhone = (user.phone_number || "").replace(/\D/g, "");
  }

  try {
    const sheets = getSheetsClient(env);
    const drive = getDriveClient(env);

    let assignedGardens = [];
    let reporterName = isStaff ? "목회자/스태프" : (user.name || "");

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

        if (phone.slice(-10) === cleanUserPhone.slice(-10)) {
          assignedGardens = gardensStr
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean);
          reporterName = name || user.name || "";
          break;
        }
      }

      // Security check for non-staff
      if (!assignedGardens.includes(gardenName)) {
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

    if (filesList.length > 0) {
      weeklySpreadsheetId = filesList[0].id;
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

        summaryRows.push([
          false,
          gardenTabName,
          `=COUNTA('${gardenTabName}'!A1:A200)`,
          `=COUNTIF('${gardenTabName}'!B1:B200, TRUE)`,
          `=COUNTIF('${gardenTabName}'!B1:B200, FALSE)`,
          `=IFERROR(D${rowIdx}/C${rowIdx}, 0)`,
        ]);

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
            const sheetRowIndex = mIdx;
            validationRequests.push({
              setDataValidation: {
                range: {
                  sheetId: currentTabId,
                  startRowIndex: sheetRowIndex,
                  endRowIndex: sheetRowIndex + 1,
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

      // Add '종합통계' percentage formatting
      if (summarySheetId && gardenTabs.length > 0) {
        validationRequests.push({
          repeatCell: {
            range: {
              sheetId: summarySheetId,
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

        // Add '종합통계' checkbox data validation
        for (let idx = 0; idx < gardenTabs.length; idx++) {
          const rowIdx = idx + 1;
          validationRequests.push({
            setDataValidation: {
              range: {
                sheetId: summarySheetId,
                startRowIndex: rowIdx,
                endRowIndex: rowIdx + 1,
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

    // 5. Update reported garden attendance in its tab
    console.log(`Updating attendance in tab '${gardenName}'...`);
    const currentSpreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: weeklySpreadsheetId,
    });
    const currentTab = currentSpreadsheetInfo.data.sheets.find(
      (s) => s.properties.title === gardenName,
    );
    if (!currentTab) {
      return c.json(
        {
          error: "GardenTabNotFound",
          message: `'${gardenName}' 탭이 스프레드시트에 존재하지 않습니다.`,
        },
        404,
      );
    }
    const currentTabId = currentTab.properties.sheetId;

    const memberResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: weeklySpreadsheetId,
      range: `${gardenName}!A:A`,
    });
    const rowsList = memberResponse.data.values || [];
    const members = rowsList
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
              note: !isPresent && reason ? reason : "",
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
                  startColumnIndex: 1,
                  endColumnIndex: 2,
                },
              },
            },
          ],
        },
      });
    }

    // 6. Update '보고여부' status to true in '종합통계' sheet tab
    console.log("Updating report status to true in '종합통계'...");
    const summaryResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: weeklySpreadsheetId,
      range: "종합통계!A:F",
    });
    const summaryRowsData = summaryResponse.data.values || [];

    let gardenRowIdx = -1;
    for (let i = 1; i < summaryRowsData.length; i++) {
      if (summaryRowsData[i][1]?.toString().trim() === gardenName.trim()) {
        gardenRowIdx = i + 1;
        break;
      }
    }

    if (gardenRowIdx !== -1) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: weeklySpreadsheetId,
        range: `종합통계!A${gardenRowIdx}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[true]],
        },
      });
    }

    console.log(
      `✅ Attendance reported successfully for ${gardenName} on ${date} (Weekly Sheet updated with native checkboxes and comments)`,
    );
    return c.body(null, 200);
  } catch (error) {
    console.error("Error in postReportController:", error);
    return c.json({ error: "Failed to submit attendance report." }, 500);
  }
};
