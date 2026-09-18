import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
import { apiCache } from "../middleware/cache.js";
import { validateParam } from "../middleware/validator.js";
import {
  deleteAlbumController,
  getAlbumController,
  getAlbumsController,
  postAlbumController,
} from "../controller/albums.controller.js";

const router = new Hono();

// Collection routes (list & create)
router
  .get("/", apiCache(), getAlbumsController)
  .post("/", authStaff, postAlbumController);

// Individual album routes (read & delete)
router
  .get(
    "/:id",
    validateParam({ id: { required: true } }),
    apiCache(),
    getAlbumController
  )
  .delete(
    "/:id",
    authStaff,
    validateParam({ id: { required: true } }),
    deleteAlbumController
  );

export default router;
