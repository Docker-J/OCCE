import { Hono } from "hono";
import { authStaff } from "./../middleware/auth.js";
import {
  registerController,
  unregisterController,
  broadcastController,
} from "../controller/notification.controller.js";

const router = new Hono();

router.put("/register", registerController);
router.delete("/unregister", unregisterController);
router.post("/broadcast", authStaff, broadcastController);

export default router;
