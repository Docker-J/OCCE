import { useState, useEffect, useCallback } from "react";
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
import useAuthStore from "../../../../store/useAuthStore";
import { MIN_DATE } from "../../../../constants/WeeklyUpdate";

export const useWeeklyUpdate = (queryDate, maxDate) => {
  const navigate = useNavigate();
  const authenticated = useAuthStore((state) => state.authenticated);
  const authInitialized = useAuthStore((state) => state.authInitialized);

  const [bulletin, setBulletin] = useState(null);
  const [selectedDate, setSelectedDate] = useState(queryDate);
  const [loading, setLoading] = useState(true);

  const loadFile = useCallback(async () => {
    setLoading(true);
    setBulletin(null);
    try {
      const result = await getWeeklyUpdate(selectedDate);
      setBulletin(result.data);
    } catch (err) {
      console.error("Failed to fetch weekly update:", err);
      setBulletin(null);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  const previousSunday = () => {
    setSelectedDate((prev) =>
      isSunday(prev)
        ? subDays(prev, 7)
        : startOfWeek(prev, { weekStartsOn: 0 }),
    );
  };

  const nextSunday = () => {
    setSelectedDate((prev) =>
      isSunday(prev) ? addDays(prev, 7) : endOfWeek(prev, { weekStartsOn: 1 }),
    );
  };

  const deleteFile = async () => {
    try {
      const result = await deleteWeeklyUpdate(selectedDate);
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

  useEffect(() => {
    if (!authInitialized) return;

    loadFile();
    navigate("/weeklyupdate/" + format(selectedDate, "yyyyMMdd"), {
      replace: true,
    });
  }, [selectedDate, authenticated, authInitialized, loadFile, navigate]);

  const canGoPrevious =
    !isSameDay(selectedDate, MIN_DATE) &&
    !isBefore(selectedDate, MIN_DATE) &&
    !loading;

  const canGoNext =
    !isSameDay(selectedDate, maxDate) &&
    !isAfter(selectedDate, maxDate) &&
    !loading;

  return {
    selectedDate,
    setSelectedDate,
    bulletin,
    loading,
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
