import { Hono } from "hono";
import { registerController, unregisterController } from "../controller/notification.controller.js";

const router = new Hono();

router.put("/register", registerController);
router.delete("/unregister", unregisterController);

export default router;
