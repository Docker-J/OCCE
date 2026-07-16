import axios from "axios";
import { format } from "date-fns";

export const getRecentWeelyUpdateDate = async () => {
  try {
    return await axios.get("/api/weekly-update/recent-date");
  } catch {}
};

export const getWeeklyUpdate = async (selectedDate) => {
  try {
    return await axios.get(
      `/api/weekly-update/${format(selectedDate, "yyyyMMdd")}`,
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
    await axios.put(`/api/weekly-update/${date}`, form, {
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
    return await axios.delete(`/api/weekly-update/${format(date, "yyyyMMdd")}`);
  } catch {
    throw new Error();
  }
};
