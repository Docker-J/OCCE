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

// Helper to get Google Drive client
const getDriveClient = (env) => {
  const auth = getGoogleAuth(env, [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ]);
  return google.drive({ version: "v3", auth });
};

/**
 * Controller to fetch all recent weekly attendance statistics and trends for the Admin Dashboard
 * GET /api/admin/attendance/summary (No query string needed)
 */
export const getAttendanceStatsController = async (c) => {
  try {
    const env = c.env;
    const folderId = env.DRIVE_WEEKLY_FOLDER_ID;

    if (!folderId) {
      return c.json(
        {
          error: "ConfigError",
          message: "주간 출석부 드라이브 폴더 ID(DRIVE_WEEKLY_FOLDER_ID)가 설정되지 않았습니다.",
        },
        500,
      );
    }

    const drive = getDriveClient(env);
    const sheets = getSheetsClient(env);

    // 1. List weekly attendance spreadsheets from Google Shared Drive folder
    const searchResponse = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      spaces: "drive",
      fields: "files(id, name, createdTime)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      orderBy: "name desc",
      pageSize: 20,
    });

    const weeklyFiles = (searchResponse.data.files || []).filter((f) =>
      f.name && f.name.startsWith("OCCE_정원출석부_"),
    );

    if (weeklyFiles.length === 0) {
      return c.json({
        weeks: [],
        trend: [],
      });
    }

    // Process up to 8 recent weeks in parallel
    const targetFiles = weeklyFiles.slice(0, 8);

    const parsedWeeks = await Promise.all(
      targetFiles.map(async (file) => {
        const date = file.name.replace("OCCE_정원출석부_", "").trim();
        try {
          const summaryResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: file.id,
            range: "'종합통계'!A:F",
            valueRenderOption: "UNFORMATTED_VALUE",
          });

          const rows = (summaryResponse.data.values || []).slice(1);
          let totalMembers = 0;
          let totalAttendees = 0;
          let totalAbsentees = 0;
          let reportedGardensCount = 0;
          const gardenStats = [];
          const unreportedGardens = [];

          for (const row of rows) {
            const gardenName = (row[1] || "").toString().trim();
            if (!gardenName) continue;

            const reported = Boolean(
              row[0] === true || row[0] === "TRUE" || row[0] === "true",
            );
            const total = Number(row[2]) || 0;
            const attended = Number(row[3]) || 0;
            const absent = Number(row[4]) || 0;
            const rate =
              total > 0 ? Math.round((attended / total) * 1000) / 10 : 0;

            totalMembers += total;
            totalAttendees += attended;
            totalAbsentees += absent;

            if (reported) {
              reportedGardensCount++;
            } else {
              unreportedGardens.push(gardenName);
            }

            gardenStats.push({
              gardenName,
              reported,
              total,
              attended,
              absent,
              rate,
            });
          }

          const totalGardensCount = gardenStats.length;
          const reportingRate =
            totalGardensCount > 0
              ? Math.round((reportedGardensCount / totalGardensCount) * 1000) / 10
              : 0;
          const overallAttendanceRate =
            totalMembers > 0
              ? Math.round((totalAttendees / totalMembers) * 1000) / 10
              : 0;

          return {
            date,
            summary: {
              totalMembers,
              totalAttendees,
              totalAbsentees,
              overallAttendanceRate,
              reportedGardensCount,
              totalGardensCount,
              reportingRate,
              unreportedGardens,
            },
            gardenStats,
          };
        } catch (err) {
          console.warn(`Failed to parse file ${file.name}:`, err);
          return null;
        }
      }),
    );

    const validWeeks = parsedWeeks.filter(Boolean);

    // Calculate delta (comparison against previous older week)
    for (let i = 0; i < validWeeks.length; i++) {
      const current = validWeeks[i];
      const prev = validWeeks[i + 1];
      if (prev) {
        current.summary.delta = {
          attendeesDiff:
            current.summary.totalAttendees - prev.summary.totalAttendees,
          rateDiff:
            Math.round(
              (current.summary.overallAttendanceRate -
                prev.summary.overallAttendanceRate) *
                10,
            ) / 10,
        };
      } else {
        current.summary.delta = null;
      }
    }

    // Chronological trend for chart (oldest to newest)
    const trend = validWeeks
      .slice()
      .reverse()
      .map((w) => ({
        date: w.date,
        totalMembers: w.summary.totalMembers,
        attended: w.summary.totalAttendees,
        absent: w.summary.totalAbsentees,
        rate: w.summary.overallAttendanceRate,
        reportedCount: w.summary.reportedGardensCount,
        totalGardens: w.summary.totalGardensCount,
      }));

    return c.json({
      weeks: validWeeks,
      trend,
    });
  } catch (error) {
    console.error("getAttendanceStatsController Error:", error);
    return c.json(
      {
        error: "GetAttendanceStatsError",
        message: error.message || "출석 통계를 불러오는 중 오류가 발생했습니다.",
      },
      500,
    );
  }
};

/**
 * Controller to fetch detailed member attendance and absence reasons for a specific garden
 * GET /api/admin/attendance/gardens/:gardenName/:date
 */
export const getGardenAttendanceDetailController = async (c) => {
  try {
    const env = c.env;
    const folderId = env.DRIVE_WEEKLY_FOLDER_ID;

    if (!folderId) {
      return c.json(
        {
          error: "ConfigError",
          message: "주간 출석부 드라이브 폴더 ID(DRIVE_WEEKLY_FOLDER_ID)가 설정되지 않았습니다.",
        },
        500,
      );
    }

    const gardenName = decodeURIComponent(c.req.param("gardenName") || "").trim();
    const date = decodeURIComponent(c.req.param("date") || "").trim();

    if (!gardenName || !date) {
      return c.json(
        {
          error: "BadRequest",
          message: "정원명과 날짜가 필요합니다.",
        },
        400,
      );
    }

    const drive = getDriveClient(env);
    const sheets = getSheetsClient(env);
    const fileName = `OCCE_정원출석부_${date}`;

    // Find the weekly file in Shared Drive
    const searchResponse = await drive.files.list({
      q: `'${folderId}' in parents and name = '${fileName}' and trashed = false`,
      spaces: "drive",
      fields: "files(id, name)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    const files = searchResponse.data.files || [];
    if (files.length === 0) {
      return c.json(
        {
          error: "NotFound",
          message: `${date} 주일 출석부 파일을 찾을 수 없습니다.`,
        },
        404,
      );
    }

    const weeklySpreadsheetId = files[0].id;

    // Fetch '종합통계' and `${gardenName}` tab row data in one batch call
    let sheetResp;
    try {
      sheetResp = await sheets.spreadsheets.get({
        spreadsheetId: weeklySpreadsheetId,
        ranges: ["'종합통계'!A:B", `'${gardenName}'!A:B`],
        fields:
          "sheets(properties(title),data(rowData(values(userEnteredValue,formattedValue,note))))",
      });
    } catch (err) {
      console.warn(`Tab ${gardenName} get error:`, err);
      return c.json(
        {
          error: "GardenNotFound",
          message: `'${gardenName}' 정원 탭을 출석부에서 찾을 수 없습니다.`,
        },
        404,
      );
    }

    const sheetsList = sheetResp.data.sheets || [];
    const summarySheet = sheetsList.find(
      (s) => s.properties?.title === "종합통계",
    );
    const gardenSheet = sheetsList.find(
      (s) => s.properties?.title === gardenName,
    );

    if (!gardenSheet) {
      return c.json(
        {
          error: "GardenNotFound",
          message: `'${gardenName}' 정원 탭을 찾을 수 없습니다.`,
        },
        404,
      );
    }

    // Determine reported status from '종합통계'
    let isReported = false;
    if (summarySheet) {
      const summaryRows = summarySheet.data?.[0]?.rowData || [];
      for (let i = 1; i < summaryRows.length; i++) {
        const cells = summaryRows[i]?.values || [];
        const gName = cells[1]?.formattedValue?.trim();
        if (gName === gardenName) {
          const val =
            cells[0]?.userEnteredValue?.boolValue ?? cells[0]?.formattedValue;
          isReported = val === true || val === "TRUE" || val === "true";
          break;
        }
      }
    }

    // Extract members, attendees, absentees, and absence notes
    const rowData = gardenSheet.data?.[0]?.rowData || [];
    const allMembers = [];
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

      allMembers.push(memberName);
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

    const total = allMembers.length;
    const rate = total > 0 ? Math.round((attendees.length / total) * 1000) / 10 : 0;

    return c.json({
      gardenName,
      date,
      reported: isReported,
      total,
      rate,
      allMembers,
      attendees,
      absentees,
      absenceReasons,
    });
  } catch (error) {
    console.error("getGardenAttendanceDetailController Error:", error);
    return c.json(
      {
        error: "GetGardenAttendanceDetailError",
        message:
          error.message || "정원 출석 상세 데이터를 불러오지 못했습니다.",
      },
      500,
    );
  }
};
