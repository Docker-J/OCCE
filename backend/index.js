import { Hono } from "hono";
import { cors } from "hono/cors";
import { subHours, format } from "date-fns";
import schedule from "./data/schedule.json";

import user from "./routes/user.routes.js";
import announcements from "./routes/announcements.routes.js";
import column from "./routes/columns.routes.js";
import weeklyupdate from "./routes/weeklyupdate.routes.js";
import albums from "./routes/albums.routes.js";
import meditationon from "./routes/meditationon.routes.js";
import notification from "./routes/notification.routes.js";
import schedules from "./routes/schedules.routes.js";
import images from "./routes/images.routes.js";
import attendance from "./routes/attendance.routes.js";
import bible291 from "./routes/bible291.routes.js";

import { getSchedules } from "./controller/schedules.controller.js";
import sendNotification from "./api/sendNotification.js";
import { linkPreviewMiddleware } from "./middleware/linkPreview.js";

const app = new Hono();

app.use("*", cors());
app.use("*", (c, next) => linkPreviewMiddleware(c, next, app));

// Mount sub-routers
app.route("/api/user", user);
app.route("/api/announcements", announcements);
app.route("/api/columns", column);
app.route("/api/weekly-update", weeklyupdate);
app.route("/api/albums", albums);
app.route("/api/schedules", schedules);
app.route("/api/meditation-on", meditationon);
app.route("/api/notification", notification);
app.route("/api/images", images);
app.route("/api/attendance", attendance);
app.route("/api/bible291", bible291);

export default {
  /**
   * Fetch handler to route HTTP requests through Hono.
   */
  fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  },

  /**
   * Scheduled handler to perform daily schedule refreshes and
   * weekly push notifications natively via Cloudflare Cron Triggers.
   */
  async scheduled(event, env, ctx) {
    console.log(`[Wrangler Scheduled Trigger] Cron: ${event.cron}`);
    ctx.waitUntil(
      (async () => {
        if (event.cron === "1 6 * * *") {
          console.log("🕒 Triggering daily schedule refresh...");
          try {
            await getSchedules(env);
            console.log("✅ Schedule refreshed successfully.");
          } catch (error) {
            console.error("❌ Failed to refresh schedule:", error);
          }
        } else if (event.cron === "30 12 * * *") {
          console.log("🕒 Triggering daily Bible reading FCM...");
          try {
            const today = format(subHours(new Date(), 6), "M월 d일");
            const match = schedule.find((item) => item.date === today);
            if (match) {
              const title = "291일 성경 1독";
              const body = `${today}\n오늘의 1독 말씀은 "${match.read}" 입니다.`;
              const link = match.link;

              await sendNotification(env, title, body, link);
              console.log(`✅ Daily Bible reading FCM sent successfully for date: ${today}`);
            } else {
              console.log(`ℹ️ No Bible reading schedule found for today (${today}) - likely rest day.`);
            }
          } catch (error) {
            console.error("❌ Failed to process daily Bible reading FCM:", error);
          }
        }
        // else if (event.cron === "30 14 * * 0") {
        //   console.log("🕒 Triggering weekly Sunday garden attendance reminder...");
        //   try {
        //     await sendNotification(
        //       env,
        //       "정원 출석 보고 리마인더",
        //       "정원지기분들은 오늘 정원 모임 후 출석 상태를 보고해 주세요!",
        //       "community/smallgroup/report"
        //     );
        //     console.log("✅ Weekly attendance reminder push sent successfully.");
        //   } catch (error) {
        //     console.error("❌ Failed to send weekly attendance reminder push:", error);
        //   }
        // }
      })(),
    );
  },
};
