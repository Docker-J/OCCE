import express from "express";

import { upload } from "../middleware/multer.js";
import { authStaff } from "../middleware/auth.js";

import {
  getMeditationONController,
  getMeditationONsController,
  postMeditationONController,
} from "../controller/meditationon.controller.js";

const router = express.Router();

router.get("/", getMeditationONsController);

router.get("/:id", getMeditationONController);

router.post("/", upload.any("images"), authStaff, postMeditationONController);

export default router;
