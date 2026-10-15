import axios from "axios";
import { format } from "date-fns";

export const getRecentWeeklyUpdateDate = async () => {
  try {
    return await axios.get("/api/weekly-update/recent-date");
  } catch {}
};

export const getRecentWeelyUpdateDate = getRecentWeeklyUpdateDate;

export const getWeeklyUpdate = async (selectedDate) => {
  try {
    return await axios.get(
      `/api/weekly-update/${format(selectedDate, "yyyyMMdd")}`,
      {
        responseType: "arraybuffer",
      }
    );
  } catch (error) {
    let data = error.response?.data;
    if (data instanceof ArrayBuffer) {
      try {
        data = JSON.parse(new TextDecoder().decode(data));
      } catch {
        // ignore decoding failure
      }
    }
    const message =
      data?.message ||
      (typeof data?.error === "string" ? data.error : null) ||
      error.message ||
      "오류가 발생했습니다.";
    throw new Error(message);
  }
};

export const uploadWeeklyUpdate = async (date, form) => {
  try {
    await axios.put(`/api/weekly-update/${date}`, form, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });
  } catch (error) {
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data?.error === "string"
        ? error.response.data.error
        : null) ||
      error.message ||
      "오류가 발생했습니다.";
    throw new Error(message);
  }
};

export const deleteWeeklyUpdate = async (date) => {
  try {
    return await axios.delete(`/api/weekly-update/${format(date, "yyyyMMdd")}`);
  } catch (error) {
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data?.error === "string"
        ? error.response.data.error
        : null) ||
      error.message ||
      "오류가 발생했습니다.";
    throw new Error(message);
  }
};

