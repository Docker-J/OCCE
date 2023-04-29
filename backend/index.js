const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.port || 3001;

const users = require("./users.js");
const weeklybulletin = require("./weeklybulletin.js");

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use("/api/User", users);
app.use("/api/WeeklyUpdate", weeklybulletin);

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
