import {} from "dotenv/config";

import express from "express";
import cors from "cors";
import cron from "node-cron";

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
import sendNotification from "./api/sendNotification.js";

import { getRecentWeelyUpdateDate } from "./controller/weeklyupdate.controller.js";
import {
  getAnnouncementsCount,
  getPinnedAnnouncements,
} from "./controller/announcements.controller.js";
import { getColumnsCount } from "./controller/columns.controller.js";
import { getSchedules } from "./controller/schedules.controller.js";

const app = express();
const PORT = process.env.port || 3001;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/user", user);
app.use("/api/announcements", announcements);
app.use("/api/columns", column);
app.use("/api/weeklyupdate", weeklyupdate);
app.use("/api/albums", albums);
app.use("/api/schedules", schedules);
app.use("/api/meditationon", meditationon);
app.use("/api/notification", notification);
app.use("/api/images", images);
app.use("/api/attendance", attendance);

// ------------------------------------------------
// CRON JOB SETUP
// ------------------------------------------------
cron.schedule(
  "1 0 * * *",
  async () => {
    console.log("🕒 Triggering daily schedule refresh...");

    try {
      await getSchedules();
      console.log("✅ Schedule refreshed successfully.");
    } catch (error) {
      console.error("❌ Failed to refresh schedule:", error);
    }
  },
  {
    scheduled: true,
    timezone: "America/Edmonton",
  }
);

// Weekly Garden Attendance Reminder Web Push (Every Sunday at 2:30 PM Edmonton Time)
cron.schedule(
  "30 14 * * 0",
  async () => {
    console.log("🕒 Triggering weekly Sunday garden attendance reminder...");
    try {
      await sendNotification(
        "정원 출석 보고 리마인더",
        "정원지기분들은 오늘 정원 모임 후 출석 상태를 보고해 주세요!",
        "community/smallgroup/report"
      );
      console.log("✅ Weekly attendance reminder sent successfully.");
    } catch (error) {
      console.error("❌ Failed to send weekly attendance reminder:", error);
    }
  },
  {
    scheduled: true,
    timezone: "America/Edmonton",
  }
);
// ------------------------------------------------

app.listen(PORT, async () => {
  // PreFetch
  await Promise.all([
    getRecentWeelyUpdateDate(),
    getAnnouncementsCount(),
    getPinnedAnnouncements(),
    getColumnsCount(),
    getSchedules(),
  ]);

  console.log(`running on port ${PORT}`);
});
