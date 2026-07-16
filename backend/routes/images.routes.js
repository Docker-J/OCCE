import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
import { uploadImageController } from "../controller/images.controller.js";

const router = new Hono();

router.post("/", authStaff, uploadImageController);

export default router;
