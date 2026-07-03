import { deleteImages } from "../controller/images.controller.js";
import { executeD1Query } from "../api/d1.js";

const TABLENAME = "Announcements";
const PAGE_SIZE = 10;

var ANNOUNCEMENTS_COUNT;
var PINNED_ANNOUNCEMENTS;

export const getAnnouncementsCount = async (db) => {
  const sql = `SELECT COUNT(id) AS count FROM ${TABLENAME} WHERE pin = 0`;
  try {
    const result = await executeD1Query(db, sql);
    ANNOUNCEMENTS_COUNT = result.result[0].results[0].count;
  } catch (error) {
    console.error("Error getting announcements count:", error);
  }
};

export const getPinnedAnnouncements = async (db) => {
  const sql = `SELECT * FROM ${TABLENAME} WHERE pin = ? ORDER BY timestamp DESC`;
  const params = [1];
  try {
    const result = await executeD1Query(db, sql, params);
    PINNED_ANNOUNCEMENTS = result.result[0].results;
  } catch (error) {
    console.error("Error getting pinned announcements:", error);
  }
};

export const getAnnouncementsController = async (c) => {
  const pageStr = c.req.query("page");
  const page = pageStr ? parseInt(pageStr, 10) : null;
  const db = c.env.DB;

  // Lazily re-fetch in-memory cache if undefined
  if (PINNED_ANNOUNCEMENTS == null) {
    await getPinnedAnnouncements(db);
  }
  if (ANNOUNCEMENTS_COUNT == null) {
    await getAnnouncementsCount(db);
  }

  const sql = `SELECT * FROM ${TABLENAME} WHERE pin = ? ORDER BY timestamp DESC LIMIT ${PAGE_SIZE} OFFSET ${
    page ? (page - 1) * PAGE_SIZE : 0
  }`;
  const params = [0];

  try {
    const result = await executeD1Query(db, sql, params);
    const announcements = (PINNED_ANNOUNCEMENTS ?? []).concat(result.result[0].results);

    return c.json({ count: ANNOUNCEMENTS_COUNT ?? 0, announcements: announcements });
  } catch (error) {
    console.error("Get announcements error:", error);
    return c.body(null, 500);
  }
};

export const getAnnouncementController = async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;
  const sql = `SELECT id, title, body, timestamp, pin FROM ${TABLENAME} WHERE id = ?`;
  const params = [id];

  try {
    const result = await executeD1Query(db, sql, params);
    if (!result.result[0].results || result.result[0].results.length === 0) {
      return c.body(null, 404);
    }
    return c.json(result.result[0].results[0]);
  } catch (error) {
    console.error("Get announcement error:", error);
    return c.body(null, 404);
  }
};

export const postAnnouncementController = async (c) => {
  const body = await c.req.json();
  const db = c.env.DB;
  const sql = `INSERT INTO ${TABLENAME} (id, title, body, images, timestamp, video) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    crypto.randomUUID(), // Native crypto API in Cloudflare Workers
    body.title,
    body.body,
    body.images && body.images.length > 0 ? body.images : null,
    new Date().toISOString(),
    body.video,
  ];

  try {
    const result = await executeD1Query(db, sql, params);
    if (ANNOUNCEMENTS_COUNT != null) {
      ANNOUNCEMENTS_COUNT += 1;
    }
    return c.json(result);
  } catch (error) {
    console.error("Post announcement error:", error);
    return c.body(null, 500);
  }
};

export const editAnnouncementController = async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const db = c.env.DB;

  const getSql = `SELECT images FROM ${TABLENAME} WHERE id = ?`;
  const getParams = [id];

  try {
    const result = await executeD1Query(db, getSql, getParams);
    const images = result.result[0].results[0].images
      ? result.result[0].results[0].images.split(",")
      : [];

    const missingImages = images.filter(
      (item) => !body.images.includes(item)
    );

    await deleteImages(c.env, missingImages);
  } catch (e) {
    console.error("Error removing old images:", e);
  }

  const sql = `UPDATE ${TABLENAME} SET title = ?, body = ?, images = ?, video = ? WHERE id = ?`;
  const params = [
    body.title,
    body.body,
    body.images && body.images.length > 0 ? body.images : null,
    body.video,
    id,
  ];

  try {
    const result = await executeD1Query(db, sql, params);
    return c.json(result);
  } catch (error) {
    console.error("Edit announcement error:", error);
    return c.body(null, 500);
  }
};

export const deleteAnnouncementController = async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;

  const getSql = `SELECT images FROM ${TABLENAME} WHERE id = ?`;
  const getParams = [id];

  try {
    const result = await executeD1Query(db, getSql, getParams);
    const images = result.result[0].results[0].images
      ? result.result[0].results[0].images.split(",")
      : [];

    await deleteImages(c.env, images);

    const deleteSql = `DELETE FROM ${TABLENAME} WHERE id = ?`;
    const deleteParams = [id];
    await executeD1Query(db, deleteSql, deleteParams);

    await getAnnouncementsCount(db);
    await getPinnedAnnouncements(db);

    return c.body(null, 200);
  } catch (error) {
    console.error("Delete announcement error:", error);
    return c.body(null, 500);
  }
};

export const pinAnnouncementController = async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const db = c.env.DB;

  const sql = `UPDATE ${TABLENAME} SET pin = ? WHERE id = ?`;
  const params = [body.pin, id];

  try {
    await executeD1Query(db, sql, params);
    await getAnnouncementsCount(db);
    await getPinnedAnnouncements(db);
    return c.body(null, 201);
  } catch (error) {
    console.error("Pin announcement error:", error);
    return c.body(null, 500);
  }
};
