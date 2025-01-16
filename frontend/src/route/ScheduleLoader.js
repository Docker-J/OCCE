import axios from "axios";

export async function loader() {
  const getSchedules = axios.get(
    `https://www.googleapis.com/calendar/v3/calendars/${
      import.meta.env.VITE_APP_GOOGLE_CALENDAR_ID
    }/events?key=${import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}`
  );

  return { schedules: getSchedules };
}
