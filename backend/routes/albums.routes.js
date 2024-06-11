import express from "express";

import { upload } from "../middleware/multer.js";
import { authStaff } from "../middleware/auth.js";

import {
  deleteAlbumController,
  getAlbumController,
  getAlbumsController,
  postAlbumController,
} from "../controller/albums.controller.js";

const router = express.Router();

router.get("/", getAlbumsController);

router.get("/:id", getAlbumController);

router.delete("/:id", authStaff, deleteAlbumController);

router.post("/", upload.any("images"), authStaff, postAlbumController);

export default router;
