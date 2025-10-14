import axios from "axios";

var SCHEDULES;

export const getSchedules = async () => {
  try {
    const getSchedules = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${process.env.GOOGLE_CALENDAR_ID}/events?key=${process.env.GOOGLE_API_KEY}`
      // &timeMin=${new Date().toISOString()}
      // &timeMax=${addMonths(
      //   new Date(),
      //   1
      // ).toISOString()}`
    );
    SCHEDULES = getSchedules.data;

    console.log(SCHEDULES);
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
