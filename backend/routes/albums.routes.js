import express from "express";
import { upload } from "../middleware/multer.js";
import authStaff from "../middleware/auth.js";

import {
  getAlbumController,
  getAlbumsController,
  postAlbumController,
} from "../controller/albums.controller.js";

const router = express.Router();

router.get("/", getAlbumsController);

router.get("/album/:id", getAlbumController);

router.post("/album", upload.any("images"), authStaff, postAlbumController);

export default router;
