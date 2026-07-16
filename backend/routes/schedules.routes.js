import { Hono } from "hono";
import {
  getSchedulesController,
  refreshSchedulesController,
} from "../controller/schedules.controller.js";

const router = new Hono();

router.get("/", getSchedulesController);
router.get("/refresh", refreshSchedulesController);

export default router;
