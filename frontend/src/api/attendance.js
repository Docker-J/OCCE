import axios from "axios";

export const getGardensAndMembers = async (success, fail) => {
  try {
    const res = await axios.get("/api/attendance/gardens");
    success(res.data);
  } catch (error) {
    console.error("Failed to fetch gardens and members:", error);
    fail(error.response?.data?.message || "정원 목록을 가져오는데 실패했습니다.");
  }
};

export const submitAttendanceReport = async (reportData, success, fail) => {
  try {
    const res = await axios.post("/api/attendance/report", reportData);
    success(res.data);
  } catch (error) {
    console.error("Failed to submit attendance report:", error);
    fail(error.response?.data?.message || "출석 보고 제출에 실패했습니다.");
  }
};
