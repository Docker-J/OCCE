import { cache } from "hono/cache";
import { Hono } from "hono";
import { authStaff, authUser } from "./../middleware/auth.js";
import {
  deleteWeeklyUpdateController,
  getRecentWeeklyUpdateDateController,
  getWeeklyUpdateController,
  uploadWeeklyUpdateController,
} from "../controller/weeklyupdate.controller.js";

const router = new Hono();

router.get("/recent-date", cache({ cacheName: "occe-api", cacheControl: "max-age=60" }), getRecentWeeklyUpdateDateController);
router.get("/:date", cache({ cacheName: "occe-api", cacheControl: "max-age=60" }), authUser, getWeeklyUpdateController);
router.put("/:date", authStaff, uploadWeeklyUpdateController);
router.delete("/:date", authStaff, deleteWeeklyUpdateController);

export default router;
