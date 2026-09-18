import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
import { apiCache } from "../middleware/cache.js";
import { validateJson, validateParam } from "../middleware/validator.js";
import {
  deleteColumnController,
  editColumnController,
  getColumnController,
  getColumnsController,
  postColumnController,
} from "../controller/columns.controller.js";

const router = new Hono();

// Public columns list
router.get("/", apiCache(), getColumnsController);

// Single column creation
router.put(
  "/column",
  authStaff,
  validateJson(["title", "body"]),
  postColumnController
);

// Single column item routes (read, update, delete)
router.get(
  "/column/:id",
  validateParam({ id: { required: true } }),
  apiCache(),
  getColumnController
);

router.put(
  "/column/:id",
  authStaff,
  validateParam({ id: { required: true } }),
  validateJson(["title", "body"]),
  editColumnController
);

router.delete(
  "/column/:id",
  authStaff,
  validateParam({ id: { required: true } }),
  deleteColumnController
);

export default router;
