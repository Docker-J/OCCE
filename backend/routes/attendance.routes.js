import { Hono } from "hono";
import { authLeader } from "../middleware/auth.js";
import {
  getGardensController,
  postReportController,
  postGatheringReportController,
} from "../controller/attendance.controller.js";

const router = new Hono();

// Get gardens and members based on user role
router.get("/gardens", authLeader, getGardensController);

// Submit attendance report
router.post("/report", authLeader, postReportController);

// Submit garden gathering report
router.post("/gathering-report", authLeader, postGatheringReportController);

export default router;
