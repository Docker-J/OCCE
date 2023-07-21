import axios from "axios";

export async function loader({ params }) {
  const result = await axios.get("/api/WeeklyUpdate/RecentDate");
  const maxDate = new Date(result.data.replace(/-/g, "/"));

  if (!params.date) {
    const queryDate = maxDate;
    return { maxDate, queryDate };
  }

  const year = +params.date.substring(0, 4);
  const month = +params.date.substring(4, 6);
  const day = +params.date.substring(6, 8);
  const queryDate = new Date(year, month - 1, day);
  return { maxDate, queryDate };
}
