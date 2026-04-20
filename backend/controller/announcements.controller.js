import { v4 as uuid } from "uuid";
import { deleteImages } from "../controller/images.controller.js";
import { executeD1Query } from "../api/d1.js";

const TABLENAME = "Announcements";
const PAGE_SIZE = 10;

var ANNOUNCEMENTS_COUNT;
var PINNED_ANNOUNCEMENTS;

export const getAnnouncementsCount = async () => {
  const sql = `SELECT COUNT(id) AS count FROM ${TABLENAME} WHERE pin = 0`;
  try {
    const result = await executeD1Query(sql);
    ANNOUNCEMENTS_COUNT = result.result[0].results[0].count;
  } catch (error) {
    console.log(error);
  }
};

export const getPinnedAnnouncements = async () => {
  const sql = `SELECT * FROM ${TABLENAME} WHERE pin = ? ORDER BY timestamp DESC`;
  const params = [1];
  try {
    const result = await executeD1Query(sql, params);
    PINNED_ANNOUNCEMENTS = result.result[0].results;
  } catch (error) {
    console.log(error);
  }
};

export const getAnnouncementsController = async (req, res) => {
  const page = req.query.page;

  const sql = `SELECT * FROM ${TABLENAME} WHERE pin = ? ORDER BY timestamp DESC LIMIT ${PAGE_SIZE} OFFSET ${
    page ? (page - 1) * PAGE_SIZE : 0
  }`;
  const params = [0];

  try {
    const result = await executeD1Query(sql, params);
    const announcements = PINNED_ANNOUNCEMENTS.concat(result.result[0].results);

    res.send({ count: ANNOUNCEMENTS_COUNT, announcements: announcements });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const getAnnouncementController = async (req, res) => {
  const sql = `SELECT id, title, body, timestamp, pin FROM ${TABLENAME} WHERE id = ?`;
  const params = [req.params.id];

  try {
    const result = await executeD1Query(sql, params);
    res.send(result.result[0].results[0]);
  } catch (error) {
    res.sendStatus(404);
  }
};

export const postAnnouncementController = async (req, res) => {
  const sql = `INSERT INTO ${TABLENAME} (id, title, body, images, timestamp, video) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    uuid(),
    req.body.title,
    req.body.body,
    req.body.images.length > 0 ? req.body.images : null,
    new Date(),
    req.body.video,
  ];

  try {
    const result = await executeD1Query(sql, params);
    ANNOUNCEMENTS_COUNT += 1;
    res.send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const editAnnouncementController = async (req, res) => {
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

  const sql = `UPDATE ${TABLENAME} SET title = ?, body = ?, images = ?, video = ? WHERE id = ?`;
  const params = [
    req.body.title,
    req.body.body,
    req.body.images.length > 0 ? req.body.images : null,
    req.body.video,
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

export const deleteAnnouncementController = async (req, res) => {
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

    getAnnouncementsCount();
    getPinnedAnnouncements();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const pinAnnouncementController = async (req, res) => {
  const sql = `UPDATE ${TABLENAME} SET pin = ? WHERE id = ?`;
  const params = [req.body.pin, req.params.id];

  try {
    await executeD1Query(sql, params);
    getAnnouncementsCount();
    getPinnedAnnouncements();
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
