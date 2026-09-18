import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
import { uploadImageController } from "../controller/images.controller.js";

const router = new Hono();

// Upload image asset to Cloudflare Images (Staff only)
router.post("/", authStaff, uploadImageController);

export default router;
