import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
import {
  getMeditationONController,
  getMeditationONsController,
  postMeditationONController,
} from "../controller/meditationon.controller.js";

const router = new Hono();

router.get("/", getMeditationONsController);
router.get("/:id", getMeditationONController);
router.post("/", authStaff, postMeditationONController);

export default router;
