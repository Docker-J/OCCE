import {} from "dotenv/config";

import express from "express";
import cors from "cors";

import users from "./users.js";
import announcements from "./announcements.js";
import weeklyupdate from "./weeklyupdate.js";
import albums from "./albums.js";
import meditationon from "./meditationon.js";
import notification from "./notification.js";

import authStaff from "./middleware/auth.js";

const app = express();
const PORT = process.env.port || 3001;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/User", users);
app.use("/api/Announcements", announcements);
app.use("/api/WeeklyUpdate", weeklyupdate);
app.use("/api/albums", albums);
app.use("/api/MeditationON", meditationon);
app.use("/api/notification", notification);

// app.get("/api/test", authStaff, async (req, res) => {
//   console.log("get");
//   res.send(200);
// });

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
