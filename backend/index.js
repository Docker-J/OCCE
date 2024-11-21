import {} from "dotenv/config";

import express from "express";
import cors from "cors";

import user from "./routes/user.routes.js";
import announcements from "./routes/announcements.routes.js";
import column from "./routes/column.routes.js";
import weeklyupdate from "./routes/weeklyupdate.routes.js";
import albums from "./routes/albums.routes.js";
import meditationon from "./routes/meditationon.routes.js";
import notification from "./routes/notification.routes.js";
import images from "./routes/images.routes.js";

import { getRecentWeelyUpdateDate } from "./controller/weeklyupdate.controller.js";
import {
  getAnnouncementsCount,
  getPinnedAnnouncements,
} from "./controller/announcements.controller.js";

const app = express();
const PORT = process.env.port || 3001;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/user", user);
app.use("/api/announcements", announcements);
app.use("/api/columns", column);
app.use("/api/weeklyupdate", weeklyupdate);
app.use("/api/albums", albums);
app.use("/api/meditationon", meditationon);
app.use("/api/notification", notification);

app.use("/api/images", images);

app.listen(PORT, async () => {
  // PreFetch
  await Promise.all([
    getRecentWeelyUpdateDate(),
    getAnnouncementsCount(),
    getPinnedAnnouncements(),
  ]);

  console.log(`running on port ${PORT}`);
});
