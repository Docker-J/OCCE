import { cache } from "hono/cache";
import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
import {
  deleteAlbumController,
  getAlbumController,
  getAlbumsController,
  postAlbumController,
} from "../controller/albums.controller.js";

const router = new Hono();

router.get("/", cache({ cacheName: "occe-api", cacheControl: "public, s-maxage=604800, max-age=0" }), getAlbumsController);
router.get("/:id", cache({ cacheName: "occe-api", cacheControl: "public, s-maxage=604800, max-age=0" }), getAlbumController);
router.delete("/:id", authStaff, deleteAlbumController);
router.post("/", authStaff, postAlbumController);

export default router;
