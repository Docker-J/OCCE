import axios from "axios";
import { format } from "date-fns";

export const uploadWeeklyUpdate = async (form) => {
  try {
    await axios.put("/api/WeeklyUpdate/", form, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });
  } catch {
    throw new Error();
  }
};

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
