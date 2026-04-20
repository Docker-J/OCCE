import { v4 as uuid } from "uuid";
import { deleteImages } from "./images.controller.js";
import { executeD1Query } from "../api/d1.js";

const TABLENAME = "Columns";
const PAGE_SIZE = 10;

var COLUMNS_COUNT;

export const getColumnsCount = async () => {
  const sql = `SELECT COUNT(id) AS count FROM ${TABLENAME}`;
  try {
    const result = await executeD1Query(sql);
    COLUMNS_COUNT = result.result[0].results[0].count;
  } catch (error) {
    console.log(error);
  }
};

export const getColumnsController = async (req, res) => {
  const page = req.query.page;

  const sql = `SELECT * FROM ${TABLENAME} ORDER BY timestamp DESC LIMIT ${PAGE_SIZE} OFFSET ${
    page ? (page - 1) * PAGE_SIZE : 0
  }`;
  try {
    const result = await executeD1Query(sql);

    res.send({
      count: COLUMNS_COUNT,
      announcements: result.result[0].results,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const getColumnController = async (req, res) => {
  const sql = `SELECT id, title, body, timestamp FROM ${TABLENAME} WHERE id = ?`;
  const params = [req.params.id];
  try {
    const result = await executeD1Query(sql, params);
    res.send(result.result[0].results[0]);
  } catch (error) {
    res.sendStatus(404);
  }
};

export const postColumnController = async (req, res) => {
  const sql = `INSERT INTO ${TABLENAME} (id, title, body, images, timestamp) VALUES (?, ?, ?, ?, ?)`;
  const params = [
    uuid(),
    req.body.title,
    req.body.body,
    req.body.images.length > 0 ? req.body.images : null,
    req.body.date,
  ];

  try {
    const result = await executeD1Query(sql, params);
    COLUMNS_COUNT += 1;
    res.send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const editColumnController = async (req, res) => {
  const getSql = `SELECT images FROM ${TABLENAME} WHERE id = ?`;
  const getParams = [req.params.id];

  try {
    const result = await executeD1Query(getSql, getParams);
    const images = result.result[0].results[0].images
      ? result.result[0].results[0].images.split(",")
      : [];

    const missingImages = images.filter(
      (item) => !req.body.images.includes(item)
    );

    await deleteImages(missingImages);
  } catch {}

  const sql = `UPDATE ${TABLENAME} SET title = ?, body = ?, images = ? WHERE id = ?`;
  const params = [
    req.body.title,
    req.body.body,
    req.body.images.length > 0 ? req.body.images : null,
    req.params.id,
  ];

  try {
    const result = await executeD1Query(sql, params);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const deleteColumnController = async (req, res) => {
  const getSql = `SELECT images FROM ${TABLENAME} WHERE id = ?`;
  const getParams = [req.params.id];

  try {
    const result = await executeD1Query(getSql, getParams);
    const images = result.result[0].results[0].images
      ? result.result[0].results[0].images.split(",")
      : [];

    await deleteImages(images);

    const deleteSql = `DELETE FROM ${TABLENAME} WHERE id = ?`;
    const deleteParams = [req.params.id];
    await executeD1Query(deleteSql, deleteParams);

    getColumnsCount();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};
