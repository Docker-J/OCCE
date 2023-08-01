const express = require("express");
const router = express.Router();
const { db, fcm } = require("./api/firebase.js");

router.get("/getPosts", async (req, res) => {
  try {
    const snapshot = await db.collection("MeditationON").get();

    res.send(snapshot.docs);
  } catch {}
});

module.exports = router;
