import { Hono } from "hono";
import { authStaff, authUser } from "../middleware/auth.js";
import { apiCache } from "../middleware/cache.js";
import { validateParam } from "../middleware/validator.js";
import {
  deleteWeeklyUpdateController,
  getRecentWeeklyUpdateDateController,
  getWeeklyUpdateController,
  uploadWeeklyUpdateController,
} from "../controller/weeklyupdate.controller.js";

const router = new Hono();

// Date validation rule for weekly bulletin (YYYYMMDD)
const dateParamRule = {
  date: {
    required: true,
    pattern: /^\d{8}$/,
    message: "Invalid date format. Expected YYYYMMDD.",
  },
};

// Recent bulletin date
router.get("/recent-date", apiCache(), getRecentWeeklyUpdateDateController);

// Date-specific bulletin routes (read, upload, delete)
router.get(
  "/:date",
  validateParam(dateParamRule),
  apiCache({ bypassOnAuth: true }),
  authUser,
  getWeeklyUpdateController
);

router.put(
  "/:date",
  authStaff,
  validateParam(dateParamRule),
  uploadWeeklyUpdateController
);

router.delete(
  "/:date",
  authStaff,
  validateParam(dateParamRule),
  deleteWeeklyUpdateController
);

export default router;
