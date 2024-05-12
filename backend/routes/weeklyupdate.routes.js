import express from "express";

import { upload } from "../middleware/multer.js";
import {
  getRecentWeeklyUpdateDateController,
  getWeeklyUpdateController,
  uploadWeeklyUpdateController,
} from "../controller/weeklyupdate.controller.js";
import authStaff from "../middleware/auth.js";

const router = express.Router();

router.get("/RecentDate", getRecentWeeklyUpdateDateController);

router.get("/:date", getWeeklyUpdateController);

router.put(
  "/",
  upload.single("images"),
  authStaff,
  uploadWeeklyUpdateController
);

export default router;
