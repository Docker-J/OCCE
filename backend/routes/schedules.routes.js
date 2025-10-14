import express from "express";

import {
  getSchedulesController,
  refreshSchedulesController,
} from "../controller/schedules.controller.js";

const router = express.Router();

router.get("/", getSchedulesController);

router.get("/refresh", refreshSchedulesController);

export default router;
