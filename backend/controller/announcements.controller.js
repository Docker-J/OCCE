import { deleteImages } from "../controller/images.controller.js";
import { executeD1Query } from "../api/d1.js";
import { purgeCache } from "../api/cloudflare.js";

const TABLENAME = "Announcements";
const PAGE_SIZE = 10;



export const getAnnouncementsController = async (c) => {
  const pageParsed = parseInt(c.req.query("page") || "1", 10);
  const page = isNaN(pageParsed) || pageParsed < 1 ? 1 : pageParsed;
  const db = c.env.DB;

  const countSql = `SELECT COUNT(id) AS count FROM ${TABLENAME} WHERE pin = 0 OR pin IS NULL`;
  const pinSql = `SELECT * FROM ${TABLENAME} WHERE pin = 1 ORDER BY timestamp DESC`;
  const dataSql = `SELECT * FROM ${TABLENAME} WHERE pin = 0 OR pin IS NULL ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
  const offset = (page - 1) * PAGE_SIZE;

  const [countResult, pinResult, dataResult] = await Promise.all([
    executeD1Query(db, countSql),
    executeD1Query(db, pinSql),
    executeD1Query(db, dataSql, [PAGE_SIZE, offset]),
  ]);

  const count = countResult.result[0]?.results?.[0]?.count ?? 0;
  const pinned = pinResult.result[0]?.results || [];
  const data = dataResult.result[0]?.results || [];

  const announcements = pinned.concat(data);

  return c.json({ count, announcements });
};

export const getAnnouncementController = async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;
  const sql = `SELECT id, title, body, timestamp, pin FROM ${TABLENAME} WHERE id = ?`;
  const params = [id];

  const result = await executeD1Query(db, sql, params);
  if (!result.result[0]?.results || result.result[0].results.length === 0) {
    return c.json({ error: "NotFound", message: "공지사항을 찾을 수 없습니다." }, 404);
  }
  return c.json(result.result[0].results[0]);
};

export const postAnnouncementController = async (c) => {
  const body = await c.req.json();
  const db = c.env.DB;
  const sql = `INSERT INTO ${TABLENAME} (id, title, body, images, timestamp, video, pin) VALUES (?, ?, ?, ?, ?, ?, 0)`;
  const params = [
    crypto.randomUUID(), // Native crypto API in Cloudflare Workers
    body.title,
    body.body,
    body.images && body.images.length > 0 ? body.images : null,
    new Date().toISOString(),
    body.video || null,
  ];

  const result = await executeD1Query(db, sql, params);
  await purgeCache(c.env, ["oncce.ca/api/announcements"]);
  return c.json(result);
};

export const editAnnouncementController = async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const db = c.env.DB;

  const getSql = `SELECT images FROM ${TABLENAME} WHERE id = ?`;
  const getParams = [id];

  const result = await executeD1Query(db, getSql, getParams);
  const images = result.result[0]?.results?.[0]?.images
    ? result.result[0].results[0].images.split(",")
    : [];

  const incomingImages = Array.isArray(body.images)
    ? body.images
    : (typeof body.images === "string" && body.images ? body.images.split(",") : []);

  const missingImages = images.filter(
    (item) => !incomingImages.includes(item)
  );

  if (missingImages.length > 0) {
    await deleteImages(c.env, missingImages);
  }

  const sql = `UPDATE ${TABLENAME} SET title = ?, body = ?, images = ?, video = ? WHERE id = ?`;
  const params = [
    body.title,
    body.body,
    body.images && body.images.length > 0 ? body.images : null,
    body.video || null,
    id,
  ];

  const updateResult = await executeD1Query(db, sql, params);
  await purgeCache(c.env, ["oncce.ca/api/announcements"]);
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
  
  await purgeCache(c.env, ["oncce.ca/api/announcements"]);
  return c.json({ success: true, id }, 200);
};

export const pinAnnouncementController = async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const db = c.env.DB;

  const sql = `UPDATE ${TABLENAME} SET pin = ? WHERE id = ?`;
  const params = [body.pin, id];

  await executeD1Query(db, sql, params);
  await purgeCache(c.env, ["oncce.ca/api/announcements"]);
  return c.json({ success: true, id, pin: body.pin }, 200);
};
