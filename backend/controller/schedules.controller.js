import { google } from "googleapis";
import path from "path";
import { addMonths } from "date-fns";

const KEY_PATH = path.join(process.cwd(), "church-4385c-ceedf27e8d20.json");

var SCHEDULES;

export const getSchedules = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEY_PATH,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    // 2. Create the Calendar Client
    const calendar = google.calendar({ version: "v3", auth });

    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID, // The calendar you shared
      timeMin: new Date().toISOString(),
      timeMax: addMonths(new Date(), 2).toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    // 4. Return the data
    SCHEDULES = response.data.items;
  } catch (err) {
    console.log(err);
  }
};

export const getSchedulesController = async (req, res) => {
  if (SCHEDULES == null) {
    await getSchedules();
  }

  res.send(SCHEDULES);
};

export const refreshSchedulesController = async (req, res) => {
  await getSchedules();
  res.sendStatus(200);
};
