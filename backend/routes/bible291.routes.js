import { cache } from "hono/cache";
import { Hono } from "hono";
import { getTodayBible291Controller } from "../controller/bible291.controller.js";

const router = new Hono();

router.get("/today", cache({ cacheName: "occe-api", cacheControl: "public, s-maxage=604800, max-age=0" }), getTodayBible291Controller);

export default router;
