/**
 * @file useSmallGroupReport.js
 * @description 온교회 소그룹 출석 보고서 및 정원 모임 보고서 상태와 비즈니스 로직을 총괄하는 커스텀 훅
 */

import { useState, useEffect } from "react";
import { useSearchParams, useSubmit, useActionData, useNavigation } from "react-router";
import { format } from "date-fns";
import useAuthStore from "../../../store/useAuthStore";
import useSnackbar from "../../../util/useSnackbar";
import {
  getGardensAndMembers,
  getAttendanceReport,
  getGatheringReport,
  getGatheringHistory,
} from "../../../api/attendance";
import { getRecentSundays, formatDateString } from "../SmallGroupReportUtils";

export const useSmallGroupReport = () => {
  const { openSnackbar } = useSnackbar();

  const authenticated = useAuthStore((state) => state.authenticated);
  const authInitialized = useAuthStore((state) => state.authInitialized);
  const isLeader = useAuthStore((state) => state.isLeader);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStaff, setIsStaff] = useState(false);
  const [assignedGarden, setAssignedGarden] = useState(null);
  const [gardens, setGardens] = useState({});
  const [selectedGarden, setSelectedGarden] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [checkedMembers, setCheckedMembers] = useState({});
  const [absenceReasons, setAbsenceReasons] = useState({});
  const [isReported, setIsReported] = useState(false);
  const [checkingReport, setCheckingReport] = useState(false);

  const submit = useSubmit();
  const actionData = useActionData();
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";

  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type") === "gathering" ? "gathering" : "sunday";
  const [reportType, setReportType] = useState(initialType);

  const [confirmOpen, setConfirmOpen] = useState(false);

  // 모임 보고서 전용 상태
  const [gatheringDate, setGatheringDate] = useState(new Date());
  const gatheringDateStr =
    !gatheringDate || isNaN(new Date(gatheringDate).getTime())
      ? ""
      : format(gatheringDate, "yyyy-MM-dd");

  const [gatheringTime, setGatheringTime] = useState(() => {
    const now = new Date();
    const defaultTime = new Date();
    defaultTime.setHours(19, 30, 0, 0);
    return defaultTime > now ? now : defaultTime;
  });

  const [gatheringLocation, setGatheringLocation] = useState("");
  const [gatheringNotes, setGatheringNotes] = useState("");
  const [gatheringHistoryDates, setGatheringHistoryDates] = useState([]);

  // 입력 중인 미저장 데이터 여부
  const isDirty =
    reportType === "gathering"
      ? gatheringNotes.trim().length > 0 || gatheringLocation.trim().length > 0
      : Object.values(absenceReasons).some((reason) => (reason || "").trim().length > 0);

  // 페이지 새로고침 / 탭 종료 방지
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // URL 쿼리 파라미터와 동기화
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "gathering") {
      setReportType("gathering");
    } else if (type === "sunday") {
      setReportType("sunday");
    }
  }, [searchParams]);

  const handleReportTypeChange = (type) => {
    if (type === reportType) return;
    if (isDirty) {
      const confirmLeave = window.confirm(
        "작성 중인 내용이 있습니다. 탭을 전환하면 입력한 내용이 사라질 수 있습니다. 계속 진행하시겠습니까?"
      );
      if (!confirmLeave) return;
    }
    setReportType(type);
    setSearchParams({ type });
  };

  const handleGardenChange = (newGarden) => {
    if (newGarden === selectedGarden) return;
    if (isDirty) {
      const confirmChange = window.confirm(
        "작성 중인 내용이 있습니다. 정원을 변경하면 작성 중인 내용이 초기화됩니다. 변경하시겠습니까?"
      );
      if (!confirmChange) return;
    }
    setSelectedGarden(newGarden);
    setGatheringNotes("");
    setGatheringLocation("");
    setAbsenceReasons({});
  };

  // 최근 주일 목록 생성
  const [recentSundays] = useState(() => getRecentSundays());

  useEffect(() => {
    if (recentSundays.length > 0) {
      setSelectedDate(formatDateString(recentSundays[0]));
    }
  }, [recentSundays]);

  // 정원 및 멤버 목록 페칭
  const fetchData = () => {
    if (!authenticated || !isLeader) return;
    setLoading(true);
    setError(null);
    getGardensAndMembers(
      (data) => {
        setIsStaff(data.isStaff);
        setAssignedGarden(data.assignedGarden);
        setGardens(data.gardens || {});

        const gardenNames = Object.keys(data.gardens || {});
        if (gardenNames.length > 0) {
          setSelectedGarden(
            data.assignedGarden && gardenNames.includes(data.assignedGarden)
              ? data.assignedGarden
              : gardenNames[0]
          );
        } else {
          setSelectedGarden("");
        }
        setLoading(false);
      },
      (errMsg) => {
        setError(errMsg);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (!authInitialized || !authenticated || !isLeader) return;
    fetchData();
  }, [authInitialized, authenticated, isLeader]);

  // 선택 정원 변경 시 기존 보고서 여부 확인 및 체크리스트 동기화
  useEffect(() => {
    if (!selectedGarden || !gardens[selectedGarden]) {
      setCheckedMembers({});
      setIsReported(false);
      return;
    }

    const defaultChecked = {};
    gardens[selectedGarden].forEach((member) => {
      defaultChecked[member] = true;
    });

    let isMounted = true;

    if (reportType === "gathering") {
      if (!gatheringDateStr) {
        setCheckedMembers(defaultChecked);
        setIsReported(false);
        return;
      }

      setCheckingReport(true);
      setIsReported(false);
      getGatheringReport(
        gatheringDateStr,
        selectedGarden,
        (data) => {
          if (!isMounted) return;
          setCheckingReport(false);
          if (data && data.reported) {
            setIsReported(true);
            const restoredChecked = {};
            const absenteesList = data.absentees || [];

            gardens[selectedGarden].forEach((member) => {
              if (absenteesList.includes(member)) {
                restoredChecked[member] = false;
              } else {
                restoredChecked[member] = true;
              }
            });

            setCheckedMembers(restoredChecked);
            setGatheringLocation(data.location || "");
            setGatheringNotes(data.notes || "");
            if (data.time) {
              const [hours, minutes] = data.time.split(":").map(Number);
              if (!isNaN(hours) && !isNaN(minutes)) {
                const newTime = new Date();
                newTime.setHours(hours, minutes, 0, 0);
                setGatheringTime(newTime);
              }
            }
          } else {
            setIsReported(false);
            setCheckedMembers(defaultChecked);
            setGatheringLocation("");
            setGatheringNotes("");
          }
        },
        () => {
          if (!isMounted) return;
          setCheckingReport(false);
          setIsReported(false);
          setCheckedMembers(defaultChecked);
        }
      );
    } else {
      if (!selectedDate) {
        setCheckedMembers(defaultChecked);
        setIsReported(false);
        return;
      }

      setCheckingReport(true);
      setIsReported(false);
      getAttendanceReport(
        selectedDate,
        selectedGarden,
        (data) => {
          if (!isMounted) return;
          setCheckingReport(false);
          if (data && data.reported) {
            setIsReported(true);
            const restoredChecked = {};
            const absenteesList = data.absentees || [];

            gardens[selectedGarden].forEach((member) => {
              if (absenteesList.includes(member)) {
                restoredChecked[member] = false;
              } else {
                restoredChecked[member] = true;
              }
            });

            setCheckedMembers(restoredChecked);
            setAbsenceReasons(data.absenceReasons || {});
          } else {
            setIsReported(false);
            setCheckedMembers(defaultChecked);
            setAbsenceReasons({});
          }
        },
        () => {
          if (!isMounted) return;
          setCheckingReport(false);
          setIsReported(false);
          setCheckedMembers(defaultChecked);
          setAbsenceReasons({});
        }
      );
    }

    return () => {
      isMounted = false;
    };
  }, [selectedGarden, selectedDate, gatheringDateStr, reportType, gardens]);

  // 모임 이력 날짜 조회
  useEffect(() => {
    if (reportType !== "gathering" || !selectedGarden) {
      setGatheringHistoryDates([]);
      return;
    }

    let isMounted = true;
    getGatheringHistory(
      selectedGarden,
      (data) => {
        if (!isMounted) return;
        setGatheringHistoryDates(data.dates || []);
      },
      (errMsg) => {
        console.warn("Failed to fetch gathering history dates:", errMsg);
      }
    );

    return () => {
      isMounted = false;
    };
  }, [reportType, selectedGarden]);

  // 제출 결과 피드백 핸들링
  useEffect(() => {
    if (!actionData) return;

    if (actionData.success) {
      openSnackbar(
        "success",
        actionData.reportType === "gathering"
          ? isReported
            ? `${selectedGarden} 정원 모임 보고서가 성공적으로 수정(업데이트)되었습니다!`
            : `${selectedGarden} 정원 모임 보고가 완료되었습니다!`
          : isReported
          ? `${selectedGarden} 정원 주일 출석 보고서가 성공적으로 수정(업데이트)되었습니다!`
          : `${selectedGarden} 정원 주일 출석 보고가 완료되었습니다!`
      );

      setIsReported(true);

      if (actionData.reportType === "gathering" && gatheringDateStr) {
        setGatheringHistoryDates((prev) => {
          if (prev.includes(gatheringDateStr)) return prev;
          return [gatheringDateStr, ...prev].sort().reverse();
        });
      }
    } else if (actionData.error) {
      openSnackbar("error", actionData.error);
    }
  }, [actionData]);

  // 출석 체크박스 토글
  const handleToggleMember = (name) => {
    setCheckedMembers((prev) => {
      const isNowChecked = !prev[name];
      if (isNowChecked) {
        setAbsenceReasons((prevReasons) => {
          const next = { ...prevReasons };
          delete next[name];
          return next;
        });
      }
      return { ...prev, [name]: isNowChecked };
    });
  };

  const handleAbsenceReasonChange = (name, value) => {
    setAbsenceReasons((prev) => ({ ...prev, [name]: value }));
  };

  const membersList = gardens[selectedGarden] || [];
  const attendees = membersList.filter((m) => checkedMembers[m] !== false);
  const absentees = membersList.filter((m) => checkedMembers[m] === false);

  const handleCheckAll = () => {
    const updated = {};
    membersList.forEach((member) => {
      updated[member] = true;
    });
    setCheckedMembers(updated);
    setAbsenceReasons({});
  };

  const handleUncheckAll = () => {
    const updated = {};
    membersList.forEach((member) => {
      updated[member] = false;
    });
    setCheckedMembers(updated);
  };

  const handleFormSubmit = () => {
    if (!selectedGarden) {
      openSnackbar("error", "정원을 선택해 주세요.");
      return;
    }
    if (reportType === "sunday" && !selectedDate) {
      openSnackbar("error", "보고 주일을 선택해 주세요.");
      return;
    }
    if (reportType === "gathering") {
      if (!gatheringDate) {
        openSnackbar("error", "모임 날짜를 입력해 주세요.");
        return;
      }
      if (!gatheringLocation.trim()) {
        openSnackbar("error", "모임 장소를 입력해 주세요.");
        return;
      }
    }
    setConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    setConfirmOpen(false);

    if (reportType === "gathering") {
      const payload = {
        date: format(gatheringDate, "yyyy-MM-dd"),
        time: format(gatheringTime, "HH:mm"),
        location: gatheringLocation,
        notes: gatheringNotes,
        gardenName: selectedGarden,
        attendees,
        absentees,
      };

      submit({ reportType, payload }, { method: "post", encType: "application/json" });
    } else {
      const payload = {
        date: selectedDate,
        gardenName: selectedGarden,
        attendees,
        absentees,
        absenceReasons,
      };

      submit({ reportType, payload }, { method: "post", encType: "application/json" });
    }
  };

  return {
    state: {
      authInitialized,
      authenticated,
      isLeader,
      isStaff,
      assignedGarden,
      loading,
      error,
      gardens,
      selectedGarden,
      selectedDate,
      recentSundays,
      checkedMembers,
      absenceReasons,
      isReported,
      checkingReport,
      submitting,
      reportType,
      confirmOpen,
      gatheringDate,
      gatheringDateStr,
      gatheringTime,
      gatheringLocation,
      gatheringNotes,
      gatheringHistoryDates,
      membersList,
      attendees,
      absentees,
    },
    actions: {
      fetchData,
      handleReportTypeChange,
      handleGardenChange,
      setSelectedDate,
      setGatheringDate,
      setGatheringTime,
      setGatheringLocation,
      setGatheringNotes,
      handleToggleMember,
      handleAbsenceReasonChange,
      handleCheckAll,
      handleUncheckAll,
      handleFormSubmit,
      handleConfirmSubmit,
      setConfirmOpen,
    },
  };
};

export default useSmallGroupReport;
