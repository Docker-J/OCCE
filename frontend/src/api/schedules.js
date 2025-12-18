import axios from "axios";

export const refreshSchedules = async () => {
  try {
    await axios.get("/api/schedules/refresh");
  } catch {
    throw new Error();
  }
};
