import express from "express";
import { fcm } from "./api/firebase.js";
import axios from "axios";
import { v4 as uuid } from "uuid";

const router = express.Router();

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_DATABASE_ID = "1de4220d-820c-4074-ae4f-b4aabeacf83e";
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;

const URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_DATABASE_ID}/query`;
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
};
const TABLENAME = "Announcements";
const PAGE_SIZE = 10;

var ANNOUNCEMENTS_COUNT;
var PINNED_ANNOUNCEMENTS;

const getAnnouncementsCount = async () => {
  const data = {
    sql: `SELECT COUNT(*) AS count FROM ${TABLENAME} WHERE pin = 0`,
  };
  try {
    const result = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });
    console.log(result.data);

    ANNOUNCEMENTS_COUNT = result.data.result[0].results[0];
  } catch (error) {
    console.log(error);
  }
};

const getPINNED_ANNOUNCEMENTS = async () => {
  const data = {
    params: [1],
    sql: `SELECT * FROM ${TABLENAME} WHERE pin = ?`,
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

router.get("/getAnnouncementsCount", async (req, res) => {
  if (ANNOUNCEMENTS_COUNT) {
    res.send(ANNOUNCEMENTS_COUNT);
  } else {
    await getAnnouncementsCount();
    res.send(ANNOUNCEMENTS_COUNT);
  }
});

router.get("/getPinnedAnnouncements", async (req, res) => {
  if (PINNED_ANNOUNCEMENTS) {
    res.send(PINNED_ANNOUNCEMENTS);
  } else {
    await getPINNED_ANNOUNCEMENTS();
    res.send(PINNED_ANNOUNCEMENTS);
  }
});

router.get("/getAnnouncements", async (req, res) => {
  const page = req.query.page;

  const data = {
    params: [0],
    sql: `SELECT * FROM ${TABLENAME} WHERE pin = ? ORDER BY timestamp DESC LIMIT ${PAGE_SIZE} OFFSET ${
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
    res.send(result.data.result[0].results);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/getAnnouncement", async (req, res) => {
  const data = {
    params: [req.query.id],
    sql: `SELECT * FROM ${TABLENAME} WHERE id = ?`,
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
    console.log(error);
    res.send(error);
  }
});

router.put("/postAnnouncement", async (req, res) => {
  console.log(req.body);
  const data = {
    params: [uuid(), req.body.title, req.body.body, new Date()],
    sql: `INSERT INTO ${TABLENAME} (id, title, body, timestamp) VALUES (?, ?, ?, ?)`,
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

router.put("/pinAnnouncement", async (req, res) => {
  const data = {
    params: [req.body.pin, req.body.id],
    sql: `UPDATE ${TABLENAME} SET pin = ? WHERE id = ?`,
  };

  try {
    const result = await axios.post(URL, data, {
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

export default router;
