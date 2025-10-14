import axios from "axios";

export async function loader() {
  const getSchedules = axios.get("/api/schedules");

  return { schedules: getSchedules };
}
