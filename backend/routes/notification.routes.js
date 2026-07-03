import { Hono } from "hono";
import { registerController } from "../controller/notification.controller.js";

const router = new Hono();

router.put("/register", registerController);

export default router;
