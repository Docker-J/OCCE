import { Hono } from "hono";
import { authLeader } from "../middleware/auth.js";
import {
  getGardensController,
  postReportController,
} from "../controller/attendance.controller.js";

const router = new Hono();

// Get gardens and members based on user role
router.get("/gardens", authLeader, getGardensController);

// Submit attendance report
router.post("/report", authLeader, postReportController);

export default router;
