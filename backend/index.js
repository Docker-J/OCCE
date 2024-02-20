import {} from "dotenv/config";

import express from "express";
import cors from "cors";

import users from "./users.js";
import announcements from "./announcements.js";
import weeklyupdate from "./weeklyupdate.js";
import albums from "./albums.js";
import meditationon from "./meditationon.js";

import { fcm } from "./api/firebase.js";

const app = express();
const PORT = process.env.port || 3001;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/User", users);
app.use("/api/Announcements", announcements);
app.use("/api/WeeklyUpdate", weeklyupdate);
app.use("/api/albums", albums);
app.use("/api/MeditationON", meditationon);

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
    token:
      "c9I3zDFcSyYMFOWT7sv2VP:APA91bH1lSQ8VzbdSE45kve1bWeRUnHdBxYsv48SPvaSSM4ro4G7CJHhciVLZv_oT1QdoZIVkHjZtYuG5oLrlO7xMJTuWvu1vV5nncEkC2Err7Lwqf0TwnTvJl7wgx9eZdNASVWocNzr",
  };
  try {
    await fcm.send(message);
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
