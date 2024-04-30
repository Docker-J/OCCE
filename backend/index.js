import {} from "dotenv/config";

import express from "express";
import cors from "cors";

import users from "./users.js";
import announcements from "./announcements.js";
import weeklyupdate from "./weeklyupdate.js";
import albums from "./albums.js";
import meditationon from "./meditationon.js";

import { fcm } from "./api/firebase.js";
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

// app.get("/api/test", authStaff, async (req, res) => {
//   console.log("get");
//   res.send(200);
// });

app.post("/api/test", async (req, res) => {
  const message = {
    notification: {},
    data: {
      title: "새로운 주보가 업로드 되었습니다",
      body: "2023-07-23",
      click_action: "https://oncce.ca/weeklyupdate",
    },
    webpush: {
      fcm_options: {
        link: "https://oncce.ca",
      },
      notification: {},
    },
    topic: "update",
  };
  try {
    await fcm.sendEach(message);
    console.log("Success");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
