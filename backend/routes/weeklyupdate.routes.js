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

// Only cache public requests. If Authorization header exists, bypass cache completely
const publicWeeklyUpdateCache = async (c, next) => {
  if (c.req.header("Authorization")) {
    return next();
  }
  return cache({
    cacheName: "occe-api",
    cacheControl: "public, s-maxage=604800, max-age=0",
  })(c, next);
};

router.get("/recent-date", cache({ cacheName: "occe-api", cacheControl: "public, s-maxage=604800, max-age=0" }), getRecentWeeklyUpdateDateController);
router.get("/:date", publicWeeklyUpdateCache, authUser, getWeeklyUpdateController);
router.put("/:date", authStaff, uploadWeeklyUpdateController);
router.delete("/:date", authStaff, deleteWeeklyUpdateController);

export default router;
