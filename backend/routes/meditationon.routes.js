import { Hono } from "hono";
import { authStaff } from "../middleware/auth.js";
import { apiCache } from "../middleware/cache.js";
import { validateParam } from "../middleware/validator.js";
import {
  getMeditationONController,
  getMeditationONsController,
  postMeditationONController,
} from "../controller/meditationon.controller.js";

const router = new Hono();

// Collection routes (list & create)
router
  .get("/", apiCache(), getMeditationONsController)
  .post("/", authStaff, postMeditationONController);

// Individual item route
router.get(
  "/:id",
  validateParam({ id: { required: true } }),
  apiCache(),
  getMeditationONController
);

export default router;
