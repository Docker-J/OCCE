import { Hono } from "hono";
import { authStaff, authUser } from "./../middleware/auth.js";
import {
  deleteWeeklyUpdateController,
  getRecentWeeklyUpdateDateController,
  getWeeklyUpdateController,
  uploadWeeklyUpdateController,
} from "../controller/weeklyupdate.controller.js";

const router = new Hono();

router.get("/recent-date", getRecentWeeklyUpdateDateController);
router.get("/:date", authUser, getWeeklyUpdateController);
router.put("/:date", authStaff, uploadWeeklyUpdateController);
router.delete("/:date", authStaff, deleteWeeklyUpdateController);

export default router;
