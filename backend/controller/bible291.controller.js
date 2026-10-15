import { subHours, format } from "date-fns";
import schedule from "../data/schedule.json";

export const getTodayBible291Controller = async (c) => {
  // Get date in Edmonton (UTC-6)
  const edmontonDate = subHours(new Date(), 6);
  const today = format(edmontonDate, "M월 d일");
  const match = schedule.find((item) => item.date === today) || null;

  // Dynamically calculate seconds remaining until midnight in Edmonton (UTC-6)
  const hours = edmontonDate.getUTCHours();
  const minutes = edmontonDate.getUTCMinutes();
  const seconds = edmontonDate.getUTCSeconds();
  const passedToday = hours * 3600 + minutes * 60 + seconds;
  const secondsUntilMidnight = Math.max(60, Math.min(86400, 86400 - passedToday));

  c.header("Cache-Control", `public, max-age=60, s-maxage=${secondsUntilMidnight}`);

  return c.json({ today, match });
};
