import { parse, isValid, startOfWeek, isSunday } from "date-fns";
import { getRecentWeeklyUpdateDate } from "../api/weeklyupdate";

const DATE_FORMAT = "yyyyMMdd";

export async function loader({ params }) {
  let maxDate = null;
  try {
    const result = await getRecentWeeklyUpdateDate();
    const rawDate = typeof result?.data === "string" ? result.data.trim() : "";
    if (rawDate) {
      const parsed = parse(rawDate, DATE_FORMAT, new Date());
      if (isValid(parsed)) {
        maxDate = parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load recent weekly update date:", err);
  }

  // Fallback: If no recent date was found from server, fallback to the most recent Sunday
  if (!maxDate || !isValid(maxDate)) {
    const today = new Date();
    maxDate = isSunday(today) ? today : startOfWeek(today, { weekStartsOn: 0 });
  }

  if (!params.date) {
    return { maxDate, queryDate: maxDate };
  }

  const queryDate = parse(params.date, DATE_FORMAT, new Date());
  return {
    maxDate,
    queryDate: isValid(queryDate) ? queryDate : maxDate,
  };
}
