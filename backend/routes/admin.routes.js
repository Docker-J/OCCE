import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
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

// All admin routes require Staff authorization
router.use("*", authStaff);

router.get("/users", listUsersController);
router.post("/users/:username/role", updateUserRoleController);
router.post("/users/:username/status", updateUserStatusController);
router.delete("/users/:username", deleteUserController);

// Weekly attendance summary and trends
router.get("/attendance/summary", getAttendanceStatsController);

// Garden specific attendance details for a given week
router.get(
  "/attendance/gardens/:gardenName/:date",
  getGardenAttendanceDetailController,
);

export default router;
