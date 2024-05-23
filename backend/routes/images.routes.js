import express from "express";

import { authStaff } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

import { uploadImageController } from "../controller/images.controller.js";

const router = express.Router();

router.post("/", upload.single("image"), authStaff, uploadImageController);

export default router;
