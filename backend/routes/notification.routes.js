import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
import { validateJson } from "../middleware/validator.js";
import {
  registerController,
  unregisterController,
  unlinkRoleController,
  broadcastController,
} from "../controller/notification.controller.js";

const router = new Hono();

// Device push token lifecycle
router.put(
  "/register",
  validateJson(["token"]),
  registerController
);

router.delete(
  "/unregister",
  validateJson(["token"]),
  unregisterController
);

router.post("/unlink", unlinkRoleController);

// Staff notification broadcast
router.post(
  "/broadcast",
  authStaff,
  validateJson(["title", "body"]),
  broadcastController
);

export default router;
