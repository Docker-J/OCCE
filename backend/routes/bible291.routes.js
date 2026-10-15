import { Hono } from "hono";
import { getTodayBible291Controller } from "../controller/bible291.controller.js";

const router = new Hono();

// Daily Bible reading schedule
router.get("/today", getTodayBible291Controller);

export default router;
