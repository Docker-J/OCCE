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

    SCHEDULES = response.data.items;
  } catch (err) {
    console.error("Error fetching schedules from Google Calendar:", err);
  }
};

export const getSchedulesController = async (c) => {
  if (SCHEDULES == null) {
    await getSchedules(c.env);
  }
  return c.json(SCHEDULES || []);
};

export const refreshSchedulesController = async (c) => {
  await getSchedules(c.env);
  return c.body(null, 200);
};
