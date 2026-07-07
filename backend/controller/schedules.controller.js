import { google } from "googleapis";
import { addMonths } from "date-fns";
import { getGoogleAuth } from "../api/googleAuth.js";

var SCHEDULES;

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

    SCHEDULES = response.data.items || [];
    
    const kv = env.weeklyupdate_kv;
    if (kv) {
      try {
        await kv.put("schedules", JSON.stringify(SCHEDULES));
        console.log("Calendar schedules successfully cached in KV.");
      } catch (e) {
        console.error("Failed to cache schedules in KV:", e);
      }
    }
  } catch (err) {
    console.error("Error fetching schedules from Google Calendar:", err);
  }
};

export const getSchedulesController = async (c) => {
  const force = c.req.query("refresh") === "true";
  const kv = c.env.weeklyupdate_kv;
  
  if (force) {
    SCHEDULES = null;
  }

  if (SCHEDULES == null) {
    if (kv && !force) {
      try {
        const cached = await kv.get("schedules");
        if (cached) {
          SCHEDULES = JSON.parse(cached);
          console.log("Loaded schedules from KV cache.");
        }
      } catch (e) {
        console.error("Failed to read schedules from KV:", e);
      }
    }
  }

  if (SCHEDULES == null) {
    console.log("Schedules cache miss or forced refresh. Fetching from Google Calendar...");
    await getSchedules(c.env);
  }

  return c.json(SCHEDULES || []);
};

export const refreshSchedulesController = async (c) => {
  await getSchedules(c.env);
  return c.body(null, 200);
};
