import axios from "axios";

export async function loader() {
  const result = await axios.get("/api/WeeklyUpdate/RecentDate");

  return new Date(result.data.replace(/-/g, "/"));
}
