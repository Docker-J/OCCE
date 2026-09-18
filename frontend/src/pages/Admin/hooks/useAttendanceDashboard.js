/**
 * @file useAttendanceDashboard.js
 * @description 출석 통계 대시보드 데이터 페칭, 주차 선택, 정렬 및 모달 상태를 관리하는 커스텀 훅
 */

import { useState, useEffect } from "react";
import { getAdminAttendanceStats } from "../../../api/admin";
import useSnackbar from "../../../util/useSnackbar";

export const useAttendanceDashboard = () => {
  const { openSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 상세 모달 상태
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedGardenForDetail, setSelectedGardenForDetail] = useState(null);

  // 테이블 정렬
  const [sortField, setSortField] = useState("rate");
  const [sortDirection, setSortDirection] = useState("desc");

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorMsg("");

    try {
      const res = await getAdminAttendanceStats(isManualRefresh);
      setData(res);
      if (res.weeks && res.weeks.length > 0) {
        setSelectedDate((prev) => {
          const exists = res.weeks.some((w) => w.date === prev);
          return exists ? prev : res.weeks[0].date;
        });
      }
      if (isManualRefresh) {
        openSnackbar("success", "출석 통계를 새로고침했습니다.");
      }
    } catch (err) {
      console.error("Failed to fetch attendance stats:", err);
      const msg = err.response?.data?.message || "출석 통계를 불러오는 중 오류가 발생했습니다.";
      setErrorMsg(msg);
      openSnackbar("error", msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const weeks = data?.weeks || [];
  const availableDates = weeks.map((w) => w.date);
  const currentWeek = weeks.find((w) => w.date === selectedDate) || weeks[0] || null;

  const currentIndex = availableDates.indexOf(selectedDate);
  const hasPrevious = currentIndex < availableDates.length - 1; // 과거 주일
  const hasNext = currentIndex > 0; // 최신 주일

  const handlePrevDate = () => {
    if (hasPrevious) {
      handleDateChange(availableDates[currentIndex + 1]);
    }
  };

  const handleNextDate = () => {
    if (hasNext) {
      handleDateChange(availableDates[currentIndex - 1]);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // 선택된 주일의 정원별 출석 정렬
  const sortedGardenStats = currentWeek?.gardenStats
    ? [...currentWeek.gardenStats].sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (typeof valA === "string") {
          const cmp = valA.localeCompare(valB, "ko");
          return sortDirection === "asc" ? cmp : -cmp;
        }

        return sortDirection === "asc" ? valA - valB : valB - valA;
      })
    : [];

  const handleOpenDetailModal = (gardenName) => {
    setSelectedGardenForDetail(gardenName);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedGardenForDetail(null);
  };

  const summary = currentWeek?.summary;
  const trend = data?.trend || [];

  return {
    state: {
      loading,
      refreshing,
      data,
      selectedDate,
      errorMsg,
      detailModalOpen,
      selectedGardenForDetail,
      sortField,
      sortDirection,
      weeks,
      availableDates,
      currentWeek,
      hasPrevious,
      hasNext,
      sortedGardenStats,
      summary,
      trend,
    },
    actions: {
      fetchData,
      handleDateChange,
      handlePrevDate,
      handleNextDate,
      handleSort,
      handleOpenDetailModal,
      handleCloseDetailModal,
    },
  };
};

export default useAttendanceDashboard;
