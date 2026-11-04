import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  addDays,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSunday,
  parse,
  startOfWeek,
  subDays,
} from "date-fns";
import { deleteWeeklyUpdate, getWeeklyUpdate } from "../../../../api/weeklyupdate";
import { useShallow } from "zustand/react/shallow";
import useAuthStore from "../../../../store/useAuthStore";
import { MIN_DATE } from "../../../../constants/WeeklyUpdate";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useWeeklyUpdate = (queryDate, maxDate) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { authenticated } = useAuthStore(
    useShallow((state) => ({
      authenticated: state.authenticated,
    }))
  );

  const [selectedDate, setSelectedDate] = useState(queryDate);
  const [prevQueryDate, setPrevQueryDate] = useState(queryDate);

  // Sync state if route queryDate changes (e.g. browser back/forward)
  if (prevQueryDate !== queryDate) {
    setPrevQueryDate(queryDate);
    setSelectedDate(queryDate);
  }

  const dateKey = format(selectedDate, "yyyyMMdd");

  const {
    data: bulletin = null,
    isLoading,
  } = useQuery({
    queryKey: ["weekly-update", dateKey, authenticated],
    queryFn: async () => {
      const result = await getWeeklyUpdate(selectedDate);
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const previousSunday = () => {
    setSelectedDate((prev) =>
      isSunday(prev)
        ? subDays(prev, 7)
        : startOfWeek(prev, { weekStartsOn: 0 })
    );
  };

  const nextSunday = () => {
    setSelectedDate((prev) =>
      isSunday(prev) ? addDays(prev, 7) : endOfWeek(prev, { weekStartsOn: 1 })
    );
  };

  const deleteFile = async () => {
    try {
      const result = await deleteWeeklyUpdate(selectedDate);
      queryClient.removeQueries({ queryKey: ["weekly-update", dateKey] });
      queryClient.invalidateQueries({ queryKey: ["weekly-update"] });
      const rawDate =
        typeof result?.data === "string" ? result.data.trim() : "";
      if (rawDate) {
        setSelectedDate(parse(rawDate, "yyyyMMdd", new Date()));
      } else {
        previousSunday();
      }
    } catch (err) {
      console.error("Failed to delete weekly update:", err);
    }
  };

  // Sync URL when selectedDate changes (without redundant navigation)
  useEffect(() => {
    const formatted = format(selectedDate, "yyyyMMdd");
    if (!window.location.pathname.endsWith(formatted)) {
      navigate("/weeklyupdate/" + formatted, { replace: true });
    }
  }, [selectedDate, navigate]);

  const canGoPrevious =
    !isSameDay(selectedDate, MIN_DATE) &&
    !isBefore(selectedDate, MIN_DATE) &&
    !isLoading;

  const canGoNext =
    !isSameDay(selectedDate, maxDate) &&
    !isAfter(selectedDate, maxDate) &&
    !isLoading;

  return {
    selectedDate,
    setSelectedDate,
    bulletin,
    loading: isLoading,
    previousSunday,
    nextSunday,
    canGoPrevious,
    canGoNext,
    deleteFile,
    minDate: MIN_DATE,
    maxDate,
  };
};

export default useWeeklyUpdate;
