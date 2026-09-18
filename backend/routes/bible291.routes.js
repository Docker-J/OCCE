import { Hono } from "hono";
import { apiCache } from "../middleware/cache.js";
import { getTodayBible291Controller } from "../controller/bible291.controller.js";

const router = new Hono();

// Daily Bible reading schedule (cached for 1 day)
router.get("/today", apiCache({ sMaxAge: 86400 }), getTodayBible291Controller);

export default router;
