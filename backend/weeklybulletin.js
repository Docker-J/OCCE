const express = require("express");
const router = express.Router();
const db = require("./api/firebase.js");

let RECENTDATE;

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
    file: req.query.file,
  };
  try {
    await db.collection.doc(req.query.date).set(data);
    res.send("Success");
    if (req.query.date > RECENTDATE) {
      RECENTDATE = req.query.date;
      try {
        const data = {
          date: req.query.date,
        };
        await db.collection("Misc").doc("RecentWeeklyBulletin").set(data);
      } catch {}
    }
  } catch {
    res.send("Error");
  }
});

module.exports = router;