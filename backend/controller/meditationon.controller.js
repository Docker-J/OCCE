import { executeD1Query } from "../api/d1.js";
import { deleteImages, uploadImage } from "./images.controller.js";
import { purgeCache } from "../api/cloudflare.js";

const TABLENAME = "MeditationON";
const PAGE_SIZE = 12;

export const getMeditationONsController = async (c) => {
  const lastVisibleID = c.req.query("lastVisible");
  const timeStamp = c.req.query("timeStamp");
  const db = c.env.DB;

  let sql = "";
  const params = [];

  if (lastVisibleID && timeStamp) {
    sql = `SELECT id, timestamp, cover FROM ${TABLENAME} WHERE timestamp < ? OR (timestamp = ? AND id < ?) ORDER BY timestamp DESC, id DESC LIMIT ?`;
    params.push(timeStamp, timeStamp, lastVisibleID, PAGE_SIZE);
  } else {
    sql = `SELECT id, timestamp, cover FROM ${TABLENAME} ORDER BY timestamp DESC, id DESC LIMIT ?`;
    params.push(PAGE_SIZE);
  }

  const result = await executeD1Query(db, sql, params);
  const rows = result.result[0]?.results || [];

  const items = rows.map((row) => ({
    ID: row.id,
    Timestamp: row.timestamp,
    Cover: row.cover,
  }));

  return c.json(items);
};

export const getMeditationONController = async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;

  const sql = `SELECT id, timestamp, images FROM ${TABLENAME} WHERE id = ?`;
  const result = await executeD1Query(db, sql, [id]);
  const row = result.result[0]?.results?.[0];

  if (!row) {
    return c.json({ error: "NotFound", message: "묵상ON 게시글을 찾을 수 없습니다." }, 404);
  }

  let images = {};
  if (row.images) {
    try {
      images = typeof row.images === "string" ? JSON.parse(row.images) : row.images;
    } catch {
      images = {};
    }
  }

  return c.json({
    ID: row.id,
    Timestamp: row.timestamp,
    Images: images,
  });
};

export const postMeditationONController = async (c) => {
  try {
    const formData = await c.req.formData();
    const images = formData.getAll("images"); // Array of File objects
    const date = c.req.query("date");

    if (!images || images.length === 0) {
      return c.json({ error: "No images provided" }, 400);
    }

    if (!date) {
      return c.json({ error: "Date parameter is required" }, 400);
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
    const cover = ids[0] || "";

    const sql = `INSERT INTO ${TABLENAME} (id, timestamp, cover, images) VALUES (?, ?, ?, ?)`;
    const params = [
      id,
      date,
      cover,
      JSON.stringify(ids),
    ];

    try {
      await executeD1Query(db, sql, params);
    } catch (dbErr) {
      await deleteImages(c.env, results.filter(Boolean)).catch(() => {});
      throw dbErr;
    }

    await purgeCache(c.env, ["oncce.ca/api/meditation-on"]);
    return c.json({ success: true, message: "MeditationON created successfully" }, 201);
  } catch (error) {
    console.error("postMeditationONController error:", error);
    return c.json(
      {
        error: error.message || "Unknown error occurred while uploading MeditationON",
      },
      500
    );
  }
};
