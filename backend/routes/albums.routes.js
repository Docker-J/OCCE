import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
import {
  deleteAlbumController,
  getAlbumController,
  getAlbumsController,
  postAlbumController,
} from "../controller/albums.controller.js";

const router = new Hono();

router.get("/", getAlbumsController);
router.get("/:id", getAlbumController);
router.delete("/:id", authStaff, deleteAlbumController);
router.post("/", authStaff, postAlbumController);

export default router;
