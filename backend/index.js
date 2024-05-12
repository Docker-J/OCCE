import {} from "dotenv/config";

import express from "express";
import cors from "cors";

import user from "./routes/user.routes.js";
import announcements from "./routes/announcements.routes.js";
import weeklyupdate from "./routes/weeklyupdate.routes.js";
import albums from "./routes/albums.routes.js";
import meditationon from "./routes/meditationon.routes.js";
import notification from "./routes/notification.routes.js";

import authStaff from "./middleware/auth.js";
import sendNotification from "./api/sendNotification.js";
import { getRecentWeelyUpdateDate } from "./controller/weeklyupdate.controller.js";

const app = express();
const PORT = process.env.port || 3001;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/user", user);
app.use("/api/announcements", announcements);
app.use("/api/weeklyupdate", weeklyupdate);
app.use("/api/albums", albums);
app.use("/api/meditationon", meditationon);
app.use("/api/notification", notification);

// app.get("/api/test", authStaff, async (req, res) => {
//   console.log("get");
//   res.send(200);
// });

app.post("/api/test", async (req, res) => {
  res.send(200);
  await sendNotification("test", "1111", "https://oncce.ca/weeklyupdate");
});

app.listen(PORT, async () => {
  // PreFetch
  await getRecentWeelyUpdateDate();

  console.log(`running on port ${PORT}`);
});
