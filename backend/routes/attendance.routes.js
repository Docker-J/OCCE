import { Hono } from "hono";
import { authLeader } from "../middleware/auth.js";
import {
  getGardensController,
  getReportController,
  postReportController,
} from "../controller/attendance.controller.js";
import {
  getGatheringReportController,
  getGatheringHistoryController,
  postGatheringReportController,
} from "../controller/gathering.controller.js";

const router = new Hono();

// All attendance and gathering endpoints require Leader (Staff or GardenKeeper) authentication
router.use("*", authLeader);

// Garden & member roster
router.get("/gardens", getGardensController);

// Sunday service attendance report (query existing & submit new)
router
  .get("/report", getReportController)
  .post("/report", postReportController);

// Small group gathering report (query existing & submit new)
router
  .get("/gathering-report", getGatheringReportController)
  .post("/gathering-report", postGatheringReportController);

// Historical gathering report dates
router.get("/gathering-history", getGatheringHistoryController);

export default router;
