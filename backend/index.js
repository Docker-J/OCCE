const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.port || 3001;

const users = require("./users.js");
const weeklybulletin = require("./weeklybulletin.js");
const { fcm } = require("./api/firebase.js");

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use("/api/User", users);
app.use("/api/WeeklyUpdate", weeklybulletin);

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
