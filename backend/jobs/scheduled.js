import { subHours, format } from "date-fns";
import schedule from "../data/schedule.json";
import { getSchedules } from "../controller/schedules.controller.js";
import sendNotification from "../api/sendNotification.js";

/**
 * 1. 매일 06:01 UTC: 주간 일정 리프레시
 */
async function handleDailyScheduleRefresh(env) {
  console.log("🕒 Triggering daily schedule refresh...");
  try {
    await getSchedules(env);
    console.log("✅ Schedule refreshed successfully.");
  } catch (error) {
    console.error("❌ Failed to refresh schedule:", error);
  }
}

/**
 * 2. 매일 12:30 UTC: 291일 성경 1독 FCM 발송
 */
async function handleDailyBibleReadingFCM(env) {
  console.log("🕒 Triggering daily Bible reading FCM...");
  const today = format(subHours(new Date(), 6), "M월 d일");
  const match = schedule.find((item) => item.date === today);
  if (!match) {
    console.log(`ℹ️ No Bible reading schedule found for today (${today}) - likely rest day.`);
    return;
  }

  const title = "291일 성경 1독";
  const body = `${today}\n오늘의 1독 말씀은 "${match.read}" 입니다.`;
  const link = "/online/bible291";

  let attempts = 0;
  let success = false;
  while (!success && attempts < 3) {
    attempts++;
    try {
      await sendNotification(env, title, body, link);
      console.log(`✅ Daily Bible reading FCM sent successfully for date: ${today}`);
      success = true;
    } catch (error) {
      console.error(`❌ Attempt ${attempts}/3 failed to process daily Bible reading FCM:`, error);
      if (attempts < 3) {
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }
}

/**
 * 3. 매 주일 22:00 UTC (현지 16:00): 정원지기 주일 출석체크 리마인더 알림 발송
 */
async function handleSundayAttendanceReminderFCM(env) {
  console.log("🕒 Triggering weekly Sunday garden attendance reminder for GardenKeepers...");
  let attempts = 0;
  let success = false;
  while (!success && attempts < 3) {
    attempts++;
    try {
      await sendNotification(
        env,
        "주일 출석 보고 리마인더",
        "주일 출석 보고서를 제출해 주세요!",
        "/community/smallgroup/report?type=sunday",
        "GardenKeeper"
      );
      console.log("✅ Weekly attendance reminder push sent successfully to GardenKeepers.");
      success = true;
    } catch (error) {
      console.error(`❌ Attempt ${attempts}/3 failed to send weekly attendance reminder push:`, error);
      if (attempts < 3) {
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }
}

/**
 * Cloudflare Worker Scheduled Event 메인 라우터
 */
export async function handleScheduled(event, env, ctx) {
  switch (event.cron) {
    case "1 6 * * *":
      await handleDailyScheduleRefresh(env);
      break;

    case "30 12 * * *":
      await handleDailyBibleReadingFCM(env);
      break;

    case "0 22 * * SUN":
      await handleSundayAttendanceReminderFCM(env);
      break;

    default:
      console.warn(`⚠️ Unhandled scheduled cron trigger: ${event.cron}`);
      break;
  }
}
