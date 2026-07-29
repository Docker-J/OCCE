import { deleteImages } from "../controller/images.controller.js";
import { executeD1Query } from "../api/d1.js";

const TABLENAME = "Announcements";
const PAGE_SIZE = 10;



export const getAnnouncementsController = async (c) => {
  const pageStr = c.req.query("page");
  const page = pageStr ? parseInt(pageStr, 10) : null;
  const db = c.env.DB;

  const countSql = `SELECT COUNT(id) AS count FROM ${TABLENAME} WHERE pin = 0`;
  const pinSql = `SELECT * FROM ${TABLENAME} WHERE pin = 1 ORDER BY timestamp DESC`;
  const dataSql = `SELECT * FROM ${TABLENAME} WHERE pin = 0 ORDER BY timestamp DESC LIMIT ${PAGE_SIZE} OFFSET ${
    page ? (page - 1) * PAGE_SIZE : 0
  }`;

  const [countResult, pinResult, dataResult] = await Promise.all([
    executeD1Query(db, countSql),
    executeD1Query(db, pinSql),
    executeD1Query(db, dataSql),
  ]);

  const count = countResult.result[0].results[0].count;
  const pinned = pinResult.result[0].results || [];
  const data = dataResult.result[0].results || [];

  const announcements = pinned.concat(data);

  return c.json({ count, announcements });
};

export const getAnnouncementController = async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;
  const sql = `SELECT id, title, body, timestamp, pin FROM ${TABLENAME} WHERE id = ?`;
  const params = [id];

  const result = await executeD1Query(db, sql, params);
  if (!result.result[0].results || result.result[0].results.length === 0) {
    return c.body(null, 404);
  }
  return c.json(result.result[0].results[0]);
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

  const result = await executeD1Query(db, sql, params);
  return c.json(result);
};

export const editAnnouncementController = async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const db = c.env.DB;

  const getSql = `SELECT images FROM ${TABLENAME} WHERE id = ?`;
  const getParams = [id];

  // Remove try-catch for images too, let it fail fast if DB fails
  const result = await executeD1Query(db, getSql, getParams);
  const images = result.result[0].results[0].images
    ? result.result[0].results[0].images.split(",")
    : [];

  const missingImages = images.filter(
    (item) => !body.images.includes(item)
  );

  if (missingImages.length > 0) {
    await deleteImages(c.env, missingImages);
  }

  const sql = `UPDATE ${TABLENAME} SET title = ?, body = ?, images = ?, video = ? WHERE id = ?`;
  const params = [
    body.title,
    body.body,
    body.images && body.images.length > 0 ? body.images : null,
    body.video,
    id,
  ];

  const updateResult = await executeD1Query(db, sql, params);
  return c.json(updateResult);
};

export const deleteAnnouncementController = async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;

  const getSql = `SELECT images FROM ${TABLENAME} WHERE id = ?`;
  const getParams = [id];

  const result = await executeD1Query(db, getSql, getParams);
  const images = result.result[0].results[0].images
    ? result.result[0].results[0].images.split(",")
    : [];

  if (images.length > 0) {
    await deleteImages(c.env, images);
  }

  const deleteSql = `DELETE FROM ${TABLENAME} WHERE id = ?`;
  const deleteParams = [id];
  await executeD1Query(db, deleteSql, deleteParams);

  return c.body(null, 200);
};

export const pinAnnouncementController = async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const db = c.env.DB;

  const sql = `UPDATE ${TABLENAME} SET pin = ? WHERE id = ?`;
  const params = [body.pin, id];

  await executeD1Query(db, sql, params);
  return c.body(null, 201);
};
