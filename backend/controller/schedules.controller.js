import { calendar } from "googleapis/build/src/apis/calendar/index.js";
import { addMonths } from "date-fns";
import { getGoogleAuth } from "../api/googleAuth.js";
import { purgeCache } from "../api/cloudflare.js";

export const getSchedules = async (env) => {
  try {
    const auth = getGoogleAuth(env, ["https://www.googleapis.com/auth/calendar.readonly"]);
    const calendarClient = calendar({ version: "v3", auth });

    const response = await calendarClient.events.list({
      calendarId: env.GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      timeMax: addMonths(new Date(), 2).toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const schedules = response.data.items || [];
    
    const kv = env.weeklyupdate_kv;
    if (kv) {
      try {
        await kv.put("schedules", JSON.stringify(schedules));
        console.log("Calendar schedules successfully cached in KV.");
      } catch (e) {
        console.error("Failed to cache schedules in KV:", e);
      }
    }

    // Automatically purge Cloudflare CDN edge cache whenever fresh schedules are loaded
    await purgeCache(env, ["oncce.ca/api/schedules"]);

    return schedules;
  } catch (err) {
    console.error("Error fetching schedules from Google Calendar:", err);
    return [];
  }
};

export const getSchedulesController = async (c) => {
  const force = c.req.query("refresh") === "true";
  const kv = c.env.weeklyupdate_kv;
  
  if (!force && kv) {
    try {
      const cached = await kv.get("schedules", "json");
      if (cached) {
        console.log("Loaded schedules from KV cache.");
        c.header(
          "Cache-Control",
          "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400"
        );
        return c.json(cached);
      }
    } catch (e) {
      console.error("Failed to read schedules from KV:", e);
    }
  }

  console.log("Schedules cache miss or forced refresh. Fetching from Google Calendar...");
  const schedules = await getSchedules(c.env);
  if (force) {
    c.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  } else {
    c.header(
      "Cache-Control",
      "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400"
    );
  }
  return c.json(schedules);
};

export const refreshSchedulesController = async (c) => {
  await getSchedules(c.env);
  await purgeCache(c.env, ["oncce.ca/api/schedules"]);
  return c.body(null, 200);
};
