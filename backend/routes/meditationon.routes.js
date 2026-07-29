import { cache } from "hono/cache";
import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
import {
  getMeditationONController,
  getMeditationONsController,
  postMeditationONController,
} from "../controller/meditationon.controller.js";

const router = new Hono();

router.get("/", cache({ cacheName: "occe-api", cacheControl: "max-age=86400" }), getMeditationONsController);
router.get("/:id", cache({ cacheName: "occe-api", cacheControl: "max-age=86400" }), getMeditationONController);
router.post("/", authStaff, postMeditationONController);

export default router;
