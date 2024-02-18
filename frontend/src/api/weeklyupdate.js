import axios from "axios";
import { format } from "date-fns";

export const uploadWeeklyUpdate = async (form) => {
  try {
    await axios.put("/api/WeeklyUpdate/PostBulletin/", form, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });
  } catch {
    throw new Error();
  }
};

export const getWeeklyUpdate = async (selectedDate) => {
  try {
    return await axios.get("/api/WeeklyUpdate/GetBulletin", {
      params: {
        date: format(selectedDate, "yyyyMMdd"),
      },
      responseType: "arraybuffer",
    });
  } catch {
    throw new Error();
  }
};
