import axios from "axios";
import { parse } from "date-fns";

const DATE_FORMAT = "yyyyMMdd";

export async function loader({ params }) {
  console.log("test");
  const result = await axios.get("/api/WeeklyUpdate/RecentDate");
  const date = JSON.stringify(result.data);

  const maxDate = parse(date, DATE_FORMAT, new Date());

  if (!params.date) {
    const queryDate = maxDate;
    return { maxDate, queryDate };
  }

  const queryDate = parse(params.date, DATE_FORMAT, new Date());
  return { maxDate, queryDate };
}
