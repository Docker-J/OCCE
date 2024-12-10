import axios from "axios";
import { format } from "date-fns";

export const getRecentWeelyUpdateDate = async () => {
  try {
    return await axios.get("/api/WeeklyUpdate/RecentDate");
  } catch {}
};

export const getWeeklyUpdate = async (selectedDate) => {
  try {
    return await axios.get(
      `/api/WeeklyUpdate/${format(selectedDate, "yyyyMMdd")}`,
      {
        responseType: "arraybuffer",
      }
    );
  } catch {
    throw new Error();
  }
};

export const uploadWeeklyUpdate = async (date, form) => {
  try {
    await axios.put(`/api/WeeklyUpdate/${date}`, form, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });
  } catch {
    throw new Error();
  }
};

export const deleteWeeklyUpdate = async (date) => {
  try {
    return await axios.delete(`/api/WeeklyUpdate/${format(date, "yyyyMMdd")}`);
  } catch {
    throw new Error();
  }
};
