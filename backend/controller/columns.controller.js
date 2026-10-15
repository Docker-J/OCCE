import { deleteImages } from "./images.controller.js";
import { executeD1Query } from "../api/d1.js";
import { purgeCache } from "../api/cloudflare.js";

const TABLENAME = "Columns";
const PAGE_SIZE = 10;



const serializeImages = (images) => {
  if (!images) return null;
  if (Array.isArray(images)) {
    const valid = images.filter((img) => typeof img === "string" && img.trim().length > 0);
    return valid.length > 0 ? valid.join(",") : null;
  }
  if (typeof images === "string" && images.trim().length > 0) {
    return images.trim();
  }
  return null;
};

export const getColumnsController = async (c) => {
  const pageParsed = parseInt(c.req.query("page") || "1", 10);
  const page = isNaN(pageParsed) || pageParsed < 1 ? 1 : pageParsed;
  const db = c.env.DB;

  const countSql = `SELECT COUNT(id) AS count FROM ${TABLENAME}`;
  const dataSql = `SELECT * FROM ${TABLENAME} ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
  const offset = (page - 1) * PAGE_SIZE;

  const [countResult, dataResult] = await Promise.all([
    executeD1Query(db, countSql),
    executeD1Query(db, dataSql, [PAGE_SIZE, offset]),
  ]);

  const count = countResult.result[0]?.results?.[0]?.count ?? 0;
  const announcements = dataResult.result[0]?.results || [];

  return c.json({
    count,
    announcements,
  });
};

export const getColumnController = async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;
  const sql = `SELECT id, title, body, timestamp FROM ${TABLENAME} WHERE id = ?`;
  const params = [id];
  const result = await executeD1Query(db, sql, params);
  if (!result.result[0]?.results || result.result[0].results.length === 0) {
    return c.json({ error: "NotFound", message: "칼럼을 찾을 수 없습니다." }, 404);
  }
  return c.json(result.result[0].results[0]);
};

export const postColumnController = async (c) => {
  const body = await c.req.json();
  const db = c.env.DB;
  const sql = `INSERT INTO ${TABLENAME} (id, title, body, images, timestamp) VALUES (?, ?, ?, ?, ?)`;
  const params = [
    crypto.randomUUID(), // Native crypto API in Cloudflare Workers
    body.title,
    body.body,
    serializeImages(body.images),
    body.date || new Date().toISOString(),
  ];

  const result = await executeD1Query(db, sql, params);
  await purgeCache(c.env, ["oncce.ca/api/columns"]);
  return c.json(result);
};

export const editColumnController = async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const db = c.env.DB;

  const getSql = `SELECT images FROM ${TABLENAME} WHERE id = ?`;
  const getParams = [id];

  const result = await executeD1Query(db, getSql, getParams);
  const currentImagesStr = result.result[0]?.results?.[0]?.images;
  const images = currentImagesStr
    ? currentImagesStr.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const serializedImages = serializeImages(body.images);
  const incomingImages = serializedImages
    ? serializedImages.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const missingImages = images.filter(
    (item) => !incomingImages.includes(item)
  );

  if (missingImages.length > 0) {
    await deleteImages(c.env, missingImages);
  }

  const sql = `UPDATE ${TABLENAME} SET title = ?, body = ?, images = ? WHERE id = ?`;
  const params = [
    body.title,
    body.body,
    serializedImages,
    id,
  ];

  const updateResult = await executeD1Query(db, sql, params);
  await purgeCache(c.env, ["oncce.ca/api/columns"]);
  return c.json(updateResult);
};

export const deleteColumnController = async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;

  const getSql = `SELECT images FROM ${TABLENAME} WHERE id = ?`;
  const getParams = [id];

  const result = await executeD1Query(db, getSql, getParams);
  const row = result?.result?.[0]?.results?.[0];
  if (!row) {
    return c.json({ error: "NotFound", message: "칼럼을 찾을 수 없습니다." }, 404);
  }
  const images = row.images
    ? row.images.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  if (images.length > 0) {
    await deleteImages(c.env, images);
  }

  const deleteSql = `DELETE FROM ${TABLENAME} WHERE id = ?`;
  const deleteParams = [id];
  await executeD1Query(db, deleteSql, deleteParams);

  await purgeCache(c.env, ["oncce.ca/api/columns"]);
  return c.json({ success: true, id }, 200);
};
