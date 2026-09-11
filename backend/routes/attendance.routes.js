import { Hono } from "hono";
import { authLeader } from "../middleware/auth.js";
import {
  getGardensController,
  getReportController,
  getGatheringReportController,
  getGatheringHistoryController,
  postReportController,
  postGatheringReportController,
} from "../controller/attendance.controller.js";

const router = new Hono();

// Get gardens and members based on user role
router.get("/gardens", authLeader, getGardensController);

// Get already reported attendance for a garden on a specific date
router.get("/report", authLeader, getReportController);

// Get already reported gathering report for a garden on a specific date
router.get("/gathering-report", authLeader, getGatheringReportController);

// Get gathering history dates for a garden
router.get("/gathering-history", authLeader, getGatheringHistoryController);

// Submit attendance report
router.post("/report", authLeader, postReportController);

// Submit garden gathering report
router.post("/gathering-report", authLeader, postGatheringReportController);

export default router;

