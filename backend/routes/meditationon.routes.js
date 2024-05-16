import express from "express";

import { upload } from "../middleware/multer.js";
import {
  getMeditationONController,
  getMeditationONsController,
  postMeditationONController,
} from "../controller/meditationon.controller.js";
import authStaff from "../middleware/auth.js";

const router = express.Router();

router.get("/", getMeditationONsController);

router.get("/post/:id", getMeditationONController);

router.post("/", upload.any("images"), authStaff, postMeditationONController);

export default router;
