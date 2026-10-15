import { executeD1Query } from "../api/d1.js";
import { deleteImages, uploadImage } from "./images.controller.js";
import { purgeCache } from "../api/cloudflare.js";

const TABLENAME = "Albums";
const PAGE_SIZE = 12;

export const getAlbumsController = async (c) => {
  const yearStr = c.req.query("year");
  const year = yearStr ? parseInt(yearStr, 10) : null;
  const lastVisibleID = c.req.query("lastVisible");
  const timeStamp = c.req.query("timeStamp");
  const db = c.env.DB;

  let sql = "";
  const params = [];

  if (year) {
    if (lastVisibleID && timeStamp) {
      sql = `SELECT id, title, timestamp, cover FROM ${TABLENAME} WHERE year = ? AND (timestamp < ? OR (timestamp = ? AND id < ?)) ORDER BY timestamp DESC, id DESC LIMIT ?`;
      params.push(year, timeStamp, timeStamp, lastVisibleID, PAGE_SIZE);
    } else {
      sql = `SELECT id, title, timestamp, cover FROM ${TABLENAME} WHERE year = ? ORDER BY timestamp DESC, id DESC LIMIT ?`;
      params.push(year, PAGE_SIZE);
    }
  } else {
    if (lastVisibleID && timeStamp) {
      sql = `SELECT id, title, timestamp, cover FROM ${TABLENAME} WHERE timestamp < ? OR (timestamp = ? AND id < ?) ORDER BY timestamp DESC, id DESC LIMIT ?`;
      params.push(timeStamp, timeStamp, lastVisibleID, PAGE_SIZE);
    } else {
      sql = `SELECT id, title, timestamp, cover FROM ${TABLENAME} ORDER BY timestamp DESC, id DESC LIMIT ?`;
      params.push(PAGE_SIZE);
    }
  }

  const result = await executeD1Query(db, sql, params);
  const rows = result.result[0]?.results || [];

  const items = rows.map((row) => ({
    ID: row.id,
    Title: row.title,
    Timestamp: row.timestamp,
    Cover: row.cover,
  }));

  return c.json(items);
};

export const getAlbumController = async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;

  const sql = `SELECT title, images FROM ${TABLENAME} WHERE id = ?`;
  const result = await executeD1Query(db, sql, [id]);
  const row = result.result[0]?.results?.[0];

  if (!row) {
    return c.json({ error: "NotFound", message: "앨범을 찾을 수 없습니다." }, 404);
  }

  let images = {};
  if (row.images) {
    try {
      images = typeof row.images === "string" ? JSON.parse(row.images) : row.images;
    } catch {
      images = {};
    }
  }

  return c.json({ title: row.title, images });
};

export const postAlbumController = async (c) => {
  const formData = await c.req.formData();
  const title = formData.get("title");
  const date = formData.get("date");
  const coverIndex = parseInt(formData.get("cover") || "0", 10);
  const images = formData.getAll("images"); // Array of File objects

  if (!images || images.length === 0) {
    return c.text("No images provided", 400);
  }

  const db = c.env.DB;

  const results = await Promise.all(
    images.map((image) => uploadImage(c.env, image))
  );

  const ids = {};
  results.forEach((result, index) => {
    ids[index] = result;
  });

  const id = crypto.randomUUID();
  const year = new Date(date).getFullYear();
  const cover = ids[coverIndex] || ids[0] || "";

  const sql = `INSERT INTO ${TABLENAME} (id, title, timestamp, cover, images, year) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    id,
    title,
    date,
    cover,
    JSON.stringify(ids),
    year,
  ];

  await executeD1Query(db, sql, params);

  await purgeCache(c.env, ["oncce.ca/api/albums"]);
  return c.body(null, 201);
};

export const deleteAlbumController = async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;

  const getSql = `SELECT images FROM ${TABLENAME} WHERE id = ?`;
  const result = await executeD1Query(db, getSql, [id]);
  const row = result.result[0]?.results?.[0];

  if (!row) {
    return c.json({ error: "NotFound", message: "앨범을 찾을 수 없습니다." }, 404);
  }

  let imagesObj = {};
  if (row.images) {
    try {
      imagesObj = typeof row.images === "string" ? JSON.parse(row.images) : row.images;
    } catch {
      imagesObj = {};
    }
  }

  const images = Object.values(imagesObj);
  if (images.length > 0) {
    await deleteImages(c.env, images);
  }

  const deleteSql = `DELETE FROM ${TABLENAME} WHERE id = ?`;
  await executeD1Query(db, deleteSql, [id]);

  await purgeCache(c.env, ["oncce.ca/api/albums"]);
  return c.json({ success: true, id }, 200);
};
