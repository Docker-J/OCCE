import axios from "axios";
import { addMonths } from "date-fns";

export async function loader() {
  const getSchedules = axios.get(
    `https://www.googleapis.com/calendar/v3/calendars/${
      import.meta.env.VITE_APP_GOOGLE_CALENDAR_ID
    }/events?key=${import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}`
    // &timeMin=${new Date().toISOString()}
    // &timeMax=${addMonths(
    //   new Date(),
    //   1
    // ).toISOString()}`
  );

  return { schedules: getSchedules };
}
