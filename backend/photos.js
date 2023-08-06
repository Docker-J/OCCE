const express = require("express");
const axios = require("axios");
const router = express.Router();

const { db, fcm } = require("./api/firebase.js");

const { fetchImageUrls } = require("google-photos-album-image-url-fetch");
const htmlparser = require("htmlparser2");
const { Timestamp } = require("firebase-admin/firestore");

const PAGE_SIZE = 12;

router.post("/uploadAlbum", async (req, res) => {
  try {
    const response = await axios.get(req.body.url);
    const html = response.data;

    const sendData = {
      title: "",
      cover: "",
      photos: [],
      timestamp: Timestamp.now(),
    };

    var isTitleTag = false;

    const parser = new htmlparser.Parser(
      {
        onopentag: (name, attributes) => {
          if (name === "title") {
            isTitleTag = true;
          }
          if (name === "meta" && attributes.property === "og:image") {
            sendData.cover = attributes.content.substring(
              0,
              attributes.content.indexOf("=")
            ); //remove size attributes from the url
          }
        },
        ontext: (text) => {
          if (isTitleTag) {
            sendData.title = text.slice(0, -16); //remove " - Google Photos" from the title
          }
        },
        onclosetag: (name) => {
          if (name === "title") {
            isTitleTag = false;
          }
        },
      },
      { decodeEntities: true }
    );

    parser.write(html);
    parser.end();

    const photos = await fetchImageUrls(req.body.url);
    sendData.photos = photos;

    await db.collection("photos").add(sendData);

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.send(404);
  }
});

router.get("/getPhotos", async (req, res) => {
  try {
    var snapshot = await db
      .collection("photos")
      // .orderBy("timestamp", "desc")
      .limit(PAGE_SIZE)
      .select("title", "cover")
      .get();

    const dataArray = [];
    snapshot.forEach((doc) => {
      dataArray.push({ id: doc.id, ...doc.data() });
    });
    res.send(dataArray);
  } catch (err) {}
});

router.get("/getAlbumDetail", async (req, res) => {
  try {
    const snapshot = await db.collection("photos").doc(req.query.id).get();

    const data = snapshot.data();
    // delete data.timestamp;

    res.send(data);
  } catch {}
});

module.exports = router;
