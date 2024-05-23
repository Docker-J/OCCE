import express from "express";

import { authStaff } from "../middleware/auth.js";

import {
  deleteAnnouncementController,
  editAnnouncementController,
  getAnnouncementController,
  getAnnouncementsController,
  pinAnnouncementController,
  postAnnouncementController,
} from "../controller/announcements.controller.js";

const router = express.Router();

router.get("/", getAnnouncementsController);

router.get("/announcement/:id", getAnnouncementController);

router.put("/announcement", authStaff, postAnnouncementController);

router.put("/announcement/:id", authStaff, editAnnouncementController);

router.put("/announcement/:id/pin", authStaff, pinAnnouncementController);

router.delete("/announcement/:id", authStaff, deleteAnnouncementController);

export default router;
