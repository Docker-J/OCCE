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

export const getAttendanceReport = async (date, gardenName, success, fail) => {
  try {
    const res = await axios.get("/api/attendance/report", {
      params: { date, gardenName },
    });
    if (success) success(res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch attendance report:", error);
    if (fail) {
      fail(
        error.response?.data?.message ||
          "기존 출석 보고를 불러오는데 실패했습니다."
      );
    }
  }
};

export const getGatheringReport = async (date, gardenName, success, fail) => {
  try {
    const res = await axios.get("/api/attendance/gathering-report", {
      params: { date, gardenName },
    });
    if (success) success(res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch gathering report:", error);
    if (fail) {
      fail(
        error.response?.data?.message ||
          "기존 정원 모임 보고를 불러오는데 실패했습니다."
      );
    }
  }
};

export const getGatheringHistory = async (gardenName, success, fail) => {
  try {
    const res = await axios.get("/api/attendance/gathering-history", {
      params: { gardenName },
    });
    if (success) success(res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch gathering history:", error);
    if (fail) {
      fail(
        error.response?.data?.message ||
          "정원 모임 보고 내역을 불러오는데 실패했습니다."
      );
    }
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

export const submitGatheringReport = async (reportData, success, fail) => {
  try {
    const res = await axios.post("/api/attendance/gathering-report", reportData);
    success(res.data);
  } catch (error) {
    console.error("Failed to submit garden gathering report:", error);
    fail(error.response?.data?.message || "정원 모임 보고 제출에 실패했습니다.");
  }
};

/**
 * Fetch lightweight list of all garden names for filters/dropdowns
 */
export const getGardenNames = async () => {
  const res = await axios.get("/api/attendance/gardens?namesOnly=true");
  return res.data?.gardenNames || [];
};

