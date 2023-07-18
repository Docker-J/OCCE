const express = require("express");
const router = express.Router();
const { db, fcm } = require("./api/firebase.js");

var RECENTDATE;

const getRecentdate = async () => {
  try {
    const snapshot = await db
      .collection("Misc")
      .doc("RecentWeeklyBulletin")
      .get();

    RECENTDATE = snapshot.data().date;
  } catch {}
};

router.get("/RecentDate", async (req, res) => {
  if (RECENTDATE) {
    res.send(RECENTDATE);
  } else {
    await getRecentdate();
    res.send(RECENTDATE);
  }
});

router.get("/GetBulletin", async (req, res) => {
  try {
    const snapshot = await db
      .collection("weeklyBulletin")
      .doc(req.query.date)
      .get();
    res.send(snapshot.data().file);
  } catch {}
});

router.put("/PostBulletin", async (req, res) => {
  const data = {
    file: req.body.file,
  };
  try {
    await db.collection("weeklyBulletin").doc(req.body.date).set(data);
    if (req.body.date > RECENTDATE) {
      RECENTDATE = req.body.date;
      try {
        const data = {
          date: req.body.date,
        };
        await db.collection("Misc").doc("RecentWeeklyBulletin").set(data);
      } catch {}
    }
    res.send(RECENTDATE);
  } catch {
    res.send("Error");
  }
});

module.exports = router;
