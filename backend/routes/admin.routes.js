import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
import {
  validateJson,
  validateParam,
} from "../middleware/validator.js";
import {
  listUsersController,
  createMemberController,
  updateMemberController,
  updateMemberStatusController,
  deleteMemberController,
  importRosterFromDriveController,
  listGardensController,
  listHouseholdsController,
  updateUserRoleController,
  updateUserStatusController,
  deleteUserController,
} from "../controller/admin.controller.js";
import {
  getAttendanceStatsController,
  getGardenAttendanceDetailController,
} from "../controller/adminAttendance.controller.js";

const router = new Hono();

// All admin routes strictly require Staff authorization
router.use("*", authStaff);

// User and Church Member management
router.get("/users", listUsersController);
router.post("/members", validateJson(["name"]), createMemberController);
router.put(
  "/members/:id",
  validateParam({ id: { required: true } }),
  updateMemberController
);
router.patch(
  "/members/:id/status",
  validateParam({ id: { required: true } }),
  validateJson(["status"]),
  updateMemberStatusController
);
router.delete(
  "/members/:id",
  validateParam({ id: { required: true } }),
  deleteMemberController
);
router.post("/members/import-drive", importRosterFromDriveController);

// Master data lookups
router.get("/gardens", listGardensController);
router.get("/households", listHouseholdsController);

// Legacy Cognito User operations
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
