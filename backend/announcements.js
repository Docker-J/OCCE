import express from "express";
import { fcm } from "./api/firebase.js";
import axios from "axios";
import { v4 as uuid } from "uuid";
import FormData from "form-data";
import { upload } from "./middleware/multer.js";

const router = express.Router();

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_DATABASE_ID = "1de4220d-820c-4074-ae4f-b4aabeacf83e";
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;

const URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_DATABASE_ID}/query`;
const TABLENAME = "Announcements";
const PAGE_SIZE = 10;

var ANNOUNCEMENTS_COUNT;
var PINNED_ANNOUNCEMENTS;

const getAnnouncementsCount = async () => {
  const data = {
    sql: `SELECT COUNT(id) AS count FROM ${TABLENAME} WHERE pin = 0`,
  };
  try {
    const result = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });
    console.log(result.data);

    ANNOUNCEMENTS_COUNT = result.data.result[0].results[0].count;
  } catch (error) {
    console.log(error);
  }
};

const getPINNED_ANNOUNCEMENTS = async () => {
  const data = {
    params: [1],
    sql: `SELECT id, title, body, timestamp, pin FROM ${TABLENAME} WHERE pin = ? ORDER BY timestamp DESC`,
  };
  try {
    const result = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });

    PINNED_ANNOUNCEMENTS = result.data.result[0].results;
  } catch (error) {
    console.log(error);
  }
};

const deleteImage = async (images) => {
  try {
    images.forEach(
      async (image) =>
        await axios.delete(
          `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${image}`,
          {
            headers: {
              Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
            },
          }
        )
    );
  } catch {}
};

// router.get("/getAnnouncementsCount", async (req, res) => {
//   if (!ANNOUNCEMENTS_COUNT) {
//     await getAnnouncementsCount();
//   }

//   const data = { count: ANNOUNCEMENTS_COUNT };
//   res.send(data);
// });

router.get("/getAnnouncements", async (req, res) => {
  const page = req.query.page;

  const data = {
    params: [0],
    sql: `SELECT id, title, body, timestamp FROM ${TABLENAME} WHERE pin = ? ORDER BY timestamp DESC LIMIT ${PAGE_SIZE} OFFSET ${
      page ? (page - 1) * PAGE_SIZE : 0
    }`,
  };
  try {
    const result = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });

    if (!PINNED_ANNOUNCEMENTS) {
      await getPINNED_ANNOUNCEMENTS();
    }

    const annoucements = PINNED_ANNOUNCEMENTS.concat(
      result.data.result[0].results
    );

    res.send({ count: ANNOUNCEMENTS_COUNT, announcements: annoucements });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/getAnnouncement", async (req, res) => {
  const data = {
    params: [req.query.id],
    sql: `SELECT id, title, body, timestamp, pin FROM ${TABLENAME} WHERE id = ?`,
  };
  try {
    const result = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });
    res.send(result.data.result[0].results[0]);
  } catch (error) {
    res.sendStatus(404);
  }
});

router.put("/postAnnouncement", async (req, res) => {
  const data = {
    params: [
      uuid(),
      req.body.title,
      req.body.body,
      req.body.images.length > 0 ? req.body.images : null,
      new Date(),
    ],
    sql: `INSERT INTO ${TABLENAME} (id, title, body, images, timestamp) VALUES (?, ?, ?, ?, ?)`,
  };

  try {
    const result = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });

    ANNOUNCEMENTS_COUNT += 1;
    res.send(result.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.put("/editAnnouncement", async (req, res) => {
  const getAnnouncementQuery = {
    params: [req.body.id],
    sql: `SELECT images FROM ${TABLENAME} WHERE id = ?`,
  };

  try {
    const result = await axios.post(URL, getAnnouncementQuery, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });

    const images = result.data.result[0].results[0].images
      ? result.data.result[0].results[0].images.split(",")
      : [];

    const missingImages = images.filter(
      (item) => !req.body.images.includes(item)
    );

    await deleteImage(missingImages);
  } catch {}

  const data = {
    params: [
      req.body.title,
      req.body.body,
      req.body.images.length > 0 ? req.body.images : null,
      req.body.id,
    ],
    sql: `UPDATE ${TABLENAME} SET title = ?, body = ?, images = ? WHERE id = ?`,
  };

  try {
    const result = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });

    res.send(result.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.put("/pinAnnouncement", async (req, res) => {
  const data = {
    params: [req.body.pin, req.body.id],
    sql: `UPDATE ${TABLENAME} SET pin = ? WHERE id = ?`,
  };

  try {
    await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });

    getAnnouncementsCount;
    getPINNED_ANNOUNCEMENTS();
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.delete("/deleteAnnouncement", async (req, res) => {
  const deleteAnnouncementQuery = {
    params: [req.query.id],
    sql: `DELETE FROM ${TABLENAME} WHERE id = ?`,
  };

  const getAnnouncementQuery = {
    params: [req.query.id],
    sql: `SELECT images FROM ${TABLENAME} WHERE id = ?`,
  };

  try {
    const result = await axios.post(URL, getAnnouncementQuery, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });

    const images = result.data.result[0].results[0].images
      ? result.data.result[0].results[0].images.split(",")
      : [];

    await deleteImage(images);

    await axios.post(URL, deleteAnnouncementQuery, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });

    getAnnouncementsCount();
    getPINNED_ANNOUNCEMENTS();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/uploadImage", upload.single("image"), async (req, res) => {
  const image = req.file;

  try {
    const formData = new FormData();
    formData.append("file", image.buffer, image.originalname);

    const result = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
        },
      }
    );

    res.send(result.data.result.id);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
});

export default router;
