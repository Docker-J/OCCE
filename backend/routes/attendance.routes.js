import express from "express";
import { authLeader } from "../middleware/auth.js";
import {
  getGardensController,
  postReportController,
} from "../controller/attendance.controller.js";

const router = express.Router();

// Get gardens and members based on user role
router.get("/gardens", authLeader, getGardensController);

// Submit attendance report
router.post("/report", authLeader, postReportController);

export default router;
