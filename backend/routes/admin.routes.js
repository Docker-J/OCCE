import { Hono } from "hono";
import { authStaff, authLeader } from "../middleware/auth.js";
import {
  validateJson,
  validateParam,
} from "../middleware/validator.js";
import {
  listUsersController,
  updateUserRoleController,
  updateUserStatusController,
  deleteUserController,
} from "../controller/admin.controller.js";
import {
  getAttendanceStatsController,
  getGardenAttendanceDetailController,
} from "../controller/adminAttendance.controller.js";

const router = new Hono();

// User membership management (strictly requires Staff authorization)
router.use("/users*", authStaff);

// Attendance administration & analytics (Accessible by Staff and Garden Keepers)
router.use("/attendance*", authLeader);

// User membership management
router.get("/users", listUsersController);

router.post(
  "/users/:username/role",
  validateParam({ username: { required: true } }),
  validateJson(["action"]),
  updateUserRoleController
);

router.post(
  "/users/:username/status",
  validateParam({ username: { required: true } }),
  validateJson(["enabled"]),
  updateUserStatusController
);

router.delete(
  "/users/:username",
  validateParam({ username: { required: true } }),
  deleteUserController
);

// Attendance administration & analytics
router.get("/attendance/summary", getAttendanceStatsController);

router.get(
  "/attendance/gardens/:gardenName/:date",
  validateParam({
    gardenName: { required: true },
    date: {
      required: true,
      pattern: /^\d{4}-\d{2}-\d{2}$/,
      message: "Date parameter must follow YYYY-MM-DD format.",
    },
  }),
  getGardenAttendanceDetailController
);

export default router;
