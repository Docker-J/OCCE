import { parse, isValid, startOfWeek, isSunday, format } from "date-fns";
import { getRecentWeeklyUpdateDate, getWeeklyUpdate } from "../api/weeklyupdate";
import { queryClient } from "../index";
import useAuthStore from "../store/useAuthStore";

const DATE_FORMAT = "yyyyMMdd";

export async function loader({ params }) {
  let maxDate = null;
  const isAuthenticated = Boolean(useAuthStore.getState().authenticated);

  // Case 1: Specific date requested (/weeklyupdate/:date)
  // Kick off PDF prefetch in parallel with recent-date verification immediately
  if (params.date) {
    const parsedQuery = parse(params.date, DATE_FORMAT, new Date());
    const validQuery = isValid(parsedQuery) ? parsedQuery : null;

    if (validQuery) {
      queryClient.prefetchQuery({
        queryKey: ["weekly-update", params.date, isAuthenticated],
        queryFn: async () => (await getWeeklyUpdate(validQuery)).data,
        staleTime: 5 * 60 * 1000,
      });
    }

    try {
      const result = await getRecentWeeklyUpdateDate();
      const rawDate = typeof result?.data === "string" ? result.data.trim() : "";
      if (rawDate) {
        const parsed = parse(rawDate, DATE_FORMAT, new Date());
        if (isValid(parsed)) maxDate = parsed;
      }
    } catch (err) {
      console.error("Failed to load recent weekly update date:", err);
    }

    if (!maxDate || !isValid(maxDate)) {
      const today = new Date();
      maxDate = isSunday(today) ? today : startOfWeek(today, { weekStartsOn: 0 });
    }

    return {
      maxDate,
      queryDate: validQuery || maxDate,
    };
  }

  // Case 2: General route (/weeklyupdate) -> fetch recent-date then immediately prefetch PDF
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

  // Pre-fetch the latest Sunday's PDF into TanStack Query before component render
  const targetDateStr = format(maxDate, DATE_FORMAT);
  queryClient.prefetchQuery({
    queryKey: ["weekly-update", targetDateStr, isAuthenticated],
    queryFn: async () => (await getWeeklyUpdate(maxDate)).data,
    staleTime: 5 * 60 * 1000,
  });

  return {
    maxDate,
    queryDate: maxDate,
  };
}
