import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
import { apiCache } from "../middleware/cache.js";
import { validateJson, validateParam } from "../middleware/validator.js";
import {
  deleteAnnouncementController,
  editAnnouncementController,
  getAnnouncementController,
  getAnnouncementsController,
  pinAnnouncementController,
  postAnnouncementController,
} from "../controller/announcements.controller.js";

const router = new Hono();

// Public announcement list
router.get("/", apiCache(), getAnnouncementsController);

// Single announcement creation
router.put(
  "/announcement",
  authStaff,
  validateJson(["title", "body"]),
  postAnnouncementController
);

// Single announcement item routes (read, update, delete, pin)
router.get(
  "/announcement/:id",
  validateParam({ id: { required: true } }),
  apiCache(),
  getAnnouncementController
);

router.put(
  "/announcement/:id",
  authStaff,
  validateParam({ id: { required: true } }),
  validateJson(["title", "body"]),
  editAnnouncementController
);

router.put(
  "/announcement/:id/pin",
  authStaff,
  validateParam({ id: { required: true } }),
  pinAnnouncementController
);

router.delete(
  "/announcement/:id",
  authStaff,
  validateParam({ id: { required: true } }),
  deleteAnnouncementController
);

export default router;
