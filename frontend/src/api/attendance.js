import axios from "axios";

export const getGardensAndMembers = async (success, fail, options = {}) => {
  try {
    const res = await axios.get("/api/attendance/gardens", {
      signal: options.signal,
    });
    if (success) success(res.data);
    return res.data;
  } catch (error) {
    const errMsg =
      error.response?.data?.message || "정원 목록을 가져오는데 실패했습니다.";
    if (fail) fail(errMsg);
    throw new Error(errMsg);
  }
};

export const getAttendanceReport = async (
  date,
  gardenName,
  success,
  fail,
  options = {}
) => {
  try {
    const res = await axios.get("/api/attendance/report", {
      params: { date, gardenName },
      signal: options.signal,
    });
    if (success) success(res.data);
    return res.data;
  } catch (error) {
    const errMsg =
      error.response?.data?.message ||
      "기존 출석 보고를 불러오는데 실패했습니다.";
    if (fail) fail(errMsg);
    throw new Error(errMsg);
  }
};

export const getGatheringReport = async (
  date,
  gardenName,
  success,
  fail,
  options = {}
) => {
  try {
    const res = await axios.get("/api/attendance/gathering-report", {
      params: { date, gardenName },
      signal: options.signal,
    });
    if (success) success(res.data);
    return res.data;
  } catch (error) {
    const errMsg =
      error.response?.data?.message ||
      "기존 정원 모임 보고를 불러오는데 실패했습니다.";
    if (fail) fail(errMsg);
    throw new Error(errMsg);
  }
};

export const getGatheringHistory = async (
  gardenName,
  success,
  fail,
  options = {}
) => {
  try {
    const res = await axios.get("/api/attendance/gathering-history", {
      params: { gardenName },
      signal: options.signal,
    });
    if (success) success(res.data);
    return res.data;
  } catch (error) {
    const errMsg =
      error.response?.data?.message ||
      "정원 모임 보고 내역을 불러오는데 실패했습니다.";
    if (fail) fail(errMsg);
    throw new Error(errMsg);
  }
};

export const submitAttendanceReport = async (
  reportData,
  success,
  fail,
  options = {}
) => {
  try {
    const res = await axios.post("/api/attendance/report", reportData, {
      signal: options.signal,
    });
    if (success) success(res.data);
    return res.data;
  } catch (error) {
    const errMsg =
      error.response?.data?.message || "출석 보고 제출에 실패했습니다.";
    if (fail) fail(errMsg);
    throw new Error(errMsg);
  }
};

export const submitGatheringReport = async (
  reportData,
  success,
  fail,
  options = {}
) => {
  try {
    const res = await axios.post(
      "/api/attendance/gathering-report",
      reportData,
      {
        signal: options.signal,
      }
    );
    if (success) success(res.data);
    return res.data;
  } catch (error) {
    const errMsg =
      error.response?.data?.message ||
      "정원 모임 보고 제출에 실패했습니다.";
    if (fail) fail(errMsg);
    throw new Error(errMsg);
  }
};

/**
 * Fetch lightweight list of all garden names for filters/dropdowns
 */
export const getGardenNames = async (options = {}) => {
  const res = await axios.get("/api/attendance/gardens?namesOnly=true", {
    signal: options.signal,
  });
  return res.data?.gardenNames || [];
};

