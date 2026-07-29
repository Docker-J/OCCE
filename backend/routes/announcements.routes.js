import { cache } from "hono/cache";
import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
import {
  deleteAnnouncementController,
  editAnnouncementController,
  getAnnouncementController,
  getAnnouncementsController,
  pinAnnouncementController,
  postAnnouncementController,
} from "../controller/announcements.controller.js";

const router = new Hono();

router.get("/", cache({ cacheName: "occe-api", cacheControl: "public, s-maxage=604800, max-age=0" }), getAnnouncementsController);
router.get("/announcement/:id", cache({ cacheName: "occe-api", cacheControl: "public, s-maxage=604800, max-age=0" }), getAnnouncementController);
router.put("/announcement", authStaff, postAnnouncementController);
router.put("/announcement/:id", authStaff, editAnnouncementController);
router.put("/announcement/:id/pin", authStaff, pinAnnouncementController);
router.delete("/announcement/:id", authStaff, deleteAnnouncementController);

export default router;
