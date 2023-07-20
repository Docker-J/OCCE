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

app.get("/api/test", async (req, res) => {
  const message = {
    data: {
      title: "$FooCorp up 1.43% on the day",
      body: "$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.",
    },
    token:
      "c9I3zDFcSyYMFOWT7sv2VP:APA91bHSOnlHYMF_7W2IGnmOXWE5gPQFU8vTcryqUD40-rMfSzKwElNzOfO7ojZjt4IDQ9edkh7GWTJonoNbOPaRieFs5vj_0BtD0GZchgDT1eSdZchlDsEeyKaDRAxouuENMHjyV0TS",
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
