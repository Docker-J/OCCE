import { cache } from "hono/cache";
import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
import {
  deleteColumnController,
  editColumnController,
  getColumnController,
  getColumnsController,
  postColumnController,
} from "../controller/columns.controller.js";

const router = new Hono();

router.get("/", cache({ cacheName: "occe-api", cacheControl: "max-age=86400" }), getColumnsController);
router.get("/column/:id", cache({ cacheName: "occe-api", cacheControl: "max-age=86400" }), getColumnController);
router.put("/column", authStaff, postColumnController);
router.put("/column/:id", authStaff, editColumnController);
router.delete("/column/:id", authStaff, deleteColumnController);

export default router;
