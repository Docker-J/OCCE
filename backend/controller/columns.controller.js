import { deleteImages } from "./images.controller.js";
import { executeD1Query } from "../api/d1.js";

const TABLENAME = "Columns";
const PAGE_SIZE = 10;

var COLUMNS_COUNT;

export const getColumnsCount = async (db) => {
  const sql = `SELECT COUNT(id) AS count FROM ${TABLENAME}`;
  try {
    const result = await executeD1Query(db, sql);
    COLUMNS_COUNT = result.result[0].results[0].count;
  } catch (error) {
    console.error("Error getting columns count:", error);
  }
};

export const getColumnsController = async (c) => {
  const pageStr = c.req.query("page");
  const page = pageStr ? parseInt(pageStr, 10) : null;
  const db = c.env.DB;

  if (COLUMNS_COUNT == null) {
    await getColumnsCount(db);
  }

  const sql = `SELECT * FROM ${TABLENAME} ORDER BY timestamp DESC LIMIT ${PAGE_SIZE} OFFSET ${
    page ? (page - 1) * PAGE_SIZE : 0
  }`;
  try {
    const result = await executeD1Query(db, sql);

    return c.json({
      count: COLUMNS_COUNT || 0,
      announcements: result.result[0].results,
    });
  } catch (error) {
    console.error("Get columns error:", error);
    return c.body(null, 500);
  }
};

export const getColumnController = async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;
  const sql = `SELECT id, title, body, timestamp FROM ${TABLENAME} WHERE id = ?`;
  const params = [id];
  try {
    const result = await executeD1Query(db, sql, params);
    if (!result.result[0].results || result.result[0].results.length === 0) {
      return c.body(null, 404);
    }
    return c.json(result.result[0].results[0]);
  } catch (error) {
    console.error("Get column error:", error);
    return c.body(null, 404);
  }
};

export const postColumnController = async (c) => {
  const body = await c.req.json();
  const db = c.env.DB;
  const sql = `INSERT INTO ${TABLENAME} (id, title, body, images, timestamp) VALUES (?, ?, ?, ?, ?)`;
  const params = [
    crypto.randomUUID(), // Native crypto API in Cloudflare Workers
    body.title,
    body.body,
    body.images && body.images.length > 0 ? body.images : null,
    body.date,
  ];

  try {
    const result = await executeD1Query(db, sql, params);
    if (COLUMNS_COUNT != null) {
      COLUMNS_COUNT += 1;
    }
    return c.json(result);
  } catch (error) {
    console.error("Post column error:", error);
    return c.body(null, 500);
  }
};

export const editColumnController = async (c) => {
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
    console.error("Error deleting old images:", e);
  }

  const sql = `UPDATE ${TABLENAME} SET title = ?, body = ?, images = ? WHERE id = ?`;
  const params = [
    body.title,
    body.body,
    body.images && body.images.length > 0 ? body.images : null,
    id,
  ];

  try {
    const result = await executeD1Query(db, sql, params);
    return c.json(result);
  } catch (error) {
    console.error("Edit column error:", error);
    return c.body(null, 500);
  }
};

export const deleteColumnController = async (c) => {
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

    await getColumnsCount(db);

    return c.body(null, 200);
  } catch (error) {
    console.error("Delete column error:", error);
    return c.body(null, 500);
  }
};
