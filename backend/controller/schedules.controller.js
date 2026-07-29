import { google } from "googleapis";
import { addMonths } from "date-fns";
import { getGoogleAuth } from "../api/googleAuth.js";

export const getSchedules = async (env) => {
  try {
    const auth = getGoogleAuth(env, ["https://www.googleapis.com/auth/calendar.readonly"]);
    const calendar = google.calendar({ version: "v3", auth });

    const response = await calendar.events.list({
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
      const cached = await kv.get("schedules");
      if (cached) {
        console.log("Loaded schedules from KV cache.");
        return c.json(JSON.parse(cached));
      }
    } catch (e) {
      console.error("Failed to read schedules from KV:", e);
    }
  }

  console.log("Schedules cache miss or forced refresh. Fetching from Google Calendar...");
  const schedules = await getSchedules(c.env);
  return c.json(schedules);
};

export const refreshSchedulesController = async (c) => {
  await getSchedules(c.env);
  return c.body(null, 200);
};
