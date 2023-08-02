const express = require("express");
const router = express.Router();
const { db, fcm } = require("./api/firebase.js");
const { Timestamp } = require("firebase-admin/firestore");

const PAGE_SIZE = 9;

router.get("/getPosts", async (req, res) => {
  const page = parseInt(req.query.page);
  var snapshot;
  try {
    if (page === 1) {
      snapshot = await db
        .collection("MeditationON")
        .orderBy("timestamp", "desc")
        .limit(PAGE_SIZE)
        .select("0")
        .get();
    } else {
      const lastVisible = await db
        .collection("MeditationON")
        .doc(req.query.lastVisible)
        .get();

      snapshot = await db
        .collection("MeditationON")
        .orderBy("timestamp", "desc")
        .startAfter(lastVisible)
        .limit(PAGE_SIZE)
        .select("0")
        .get();
    }

    const dataArray = [];
    snapshot.forEach((doc) => {
      dataArray.push({ id: doc.id, ...doc.data() });
    });

    res.send(dataArray);
  } catch (error) {
    res.send(error);
  }
});

router.get("/getPostDetail", async (req, res) => {
  try {
    const snapshot = await db
      .collection("MeditationON")
      .doc(req.query.id)
      .get();

    const data = snapshot.data();
    delete data.timestamp;

    res.send(data);
  } catch {}
});

router.post("/uploadPost", async (req, res) => {
  req.body.images.timestamp = Timestamp.now();
  try {
    const snapshot = await db.collection("MeditationON").add(req.body.images);

    res.send(snapshot.id);
  } catch {}
});

module.exports = router;
