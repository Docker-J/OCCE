import { subHours, format } from "date-fns";
import schedule from "../data/schedule.json";

export const getTodayBible291Controller = async (c) => {
  // Get date in Edmonton (UTC-6)
  const today = format(subHours(new Date(), 6), "M월 d일");
  const match = schedule.find((item) => item.date === today) || null;

  return c.json({ today, match });
};
