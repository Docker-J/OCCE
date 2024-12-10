import express from "express";

import { authStaff, authUser } from "./../middleware/auth.js";
import { upload } from "../middleware/multer.js";

import {
  deleteWeeklyUpdateController,
  getRecentWeeklyUpdateDateController,
  getWeeklyUpdateController,
  uploadWeeklyUpdateController,
} from "../controller/weeklyupdate.controller.js";

const router = express.Router();

router.get("/RecentDate", getRecentWeeklyUpdateDateController);

router.get("/:date", authUser, getWeeklyUpdateController);

router.put(
  "/:date",
  upload.array("pdfs", 2),
  authStaff,
  uploadWeeklyUpdateController
);

router.delete("/:date", authStaff, deleteWeeklyUpdateController);

export default router;
