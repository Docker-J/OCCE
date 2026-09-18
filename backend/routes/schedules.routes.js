import { Hono } from "hono";
import { apiCache } from "../middleware/cache.js";
import {
  getSchedulesController,
  refreshSchedulesController,
} from "../controller/schedules.controller.js";

const router = new Hono();

// Church schedules cache (1 day) & on-demand refresh
router.get("/", apiCache({ sMaxAge: 86400 }), getSchedulesController);
router.get("/refresh", refreshSchedulesController);

export default router;
