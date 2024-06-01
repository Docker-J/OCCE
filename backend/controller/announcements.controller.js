import axios from "axios";
import { v4 as uuid } from "uuid";
import { deleteImages } from "../controller/images.controller.js";

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_DATABASE_ID = "1de4220d-820c-4074-ae4f-b4aabeacf83e";
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;

const URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_DATABASE_ID}/query`;
const TABLENAME = "Announcements";
const PAGE_SIZE = 10;

var ANNOUNCEMENTS_COUNT;
var PINNED_ANNOUNCEMENTS;

export const getAnnouncementsCount = async () => {
  const data = {
    sql: `SELECT COUNT(id) AS count FROM ${TABLENAME} WHERE pin = 0`,
  };
  try {
    const result = await axios.post(URL, data, {
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    ANNOUNCEMENTS_COUNT = result.data.result[0].results[0].count;
  } catch (error) {
    console.log(error);
  }
};

export const getPinnedAnnouncements = async () => {
  const data = {
    params: [1],
    sql: `SELECT * FROM ${TABLENAME} WHERE pin = ? ORDER BY timestamp DESC`,
  };
  try {
    const result = await axios.post(URL, data, {
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    PINNED_ANNOUNCEMENTS = result.data.result[0].results;
  } catch (error) {
    console.log(error);
  }
};

export const getAnnouncementsController = async (req, res) => {
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
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const annoucements = PINNED_ANNOUNCEMENTS.concat(
      result.data.result[0].results
    );

    res.send({ count: ANNOUNCEMENTS_COUNT, announcements: annoucements });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const getAnnouncementController = async (req, res) => {
  const data = {
    params: [req.params.id],
    sql: `SELECT id, title, body, timestamp, pin FROM ${TABLENAME} WHERE id = ?`,
  };
  try {
    const result = await axios.post(URL, data, {
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    res.send(result.data.result[0].results[0]);
  } catch (error) {
    res.sendStatus(404);
  }
};

export const postAnnouncementController = async (req, res) => {
  const data = {
    params: [
      uuid(),
      req.body.title,
      req.body.body,
      req.body.images.length > 0 ? req.body.images : null,
      new Date(),
      req.body.video,
    ],
    sql: `INSERT INTO ${TABLENAME} (id, title, body, images, timestamp, video) VALUES (?, ?, ?, ?, ?, ?)`,
  };

  try {
    const result = await axios.post(URL, data, {
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    ANNOUNCEMENTS_COUNT += 1;
    res.send(result.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const editAnnouncementController = async (req, res) => {
  const getAnnouncementQuery = {
    params: [req.params.id],
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

    await deleteImages(missingImages);
  } catch {}

  const data = {
    params: [
      req.body.title,
      req.body.body,
      req.body.images.length > 0 ? req.body.images : null,
      req.body.video,
      req.params.id,
    ],
    sql: `UPDATE ${TABLENAME} SET title = ?, body = ?, images = ?, video = ? WHERE id = ?`,
  };

  try {
    const result = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });

    console.log("test");

    res.send(result.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const deleteAnnouncementController = async (req, res) => {
  const deleteAnnouncementQuery = {
    params: [req.params.id],
    sql: `DELETE FROM ${TABLENAME} WHERE id = ?`,
  };

  const getAnnouncementQuery = {
    params: [req.params.id],
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

    await deleteImages(images);

    await axios.post(URL, deleteAnnouncementQuery, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      },
    });

    getAnnouncementsCount();
    getPinnedAnnouncements();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const pinAnnouncementController = async (req, res) => {
  const data = {
    params: [req.body.pin, req.params.id],
    sql: `UPDATE ${TABLENAME} SET pin = ? WHERE id = ?`,
  };

  try {
    await axios.post(URL, data, {
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    getAnnouncementsCount();
    getPinnedAnnouncements();
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
