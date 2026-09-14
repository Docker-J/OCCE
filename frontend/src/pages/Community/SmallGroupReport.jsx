import { useState, useEffect } from "react";
import useAuthStore from "../../store/useAuthStore";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";

import LoginIcon from "@mui/icons-material/Login";

import useModals from "../../util/useModal.js";
import useSnackbar from "../../util/useSnackbar.js";
import {
  getGardensAndMembers,
  getAttendanceReport,
  getGatheringReport,
  getGatheringHistory,
} from "../../api/attendance.js";
import {
  useSearchParams,
  useSubmit,
  useActionData,
  useNavigation,
  Link,
} from "react-router";
import axios from "axios";
import { format } from "date-fns";

import { getRecentSundays, formatDateString } from "./SmallGroupReportUtils";
import GatheringForm from "./GatheringForm";
import SundayForm from "./SundayForm";
import ConfirmSubmitDialog from "./ConfirmSubmitDialog";
const titleBackground = {
  backgroundImage: 'url("/img/Community/SmallGroup.webp")',
  backgroundPositionY: "58%",
};
const SmallGroupReport = () => {
  const { openModal } = useModals();
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
  const initialType =
    searchParams.get("type") === "gathering" ? "gathering" : "sunday";
  const [reportType, setReportType] = useState(initialType);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [gatheringHistoryLoading, setGatheringHistoryLoading] = useState(false);

  const handleOpenConfirm = () => {
    setConfirmOpen(true);
  };
  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

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

  // Determine if the user has unsaved inputs in the current form
  const isDirty =
    reportType === "gathering"
      ? gatheringNotes.trim().length > 0 || gatheringLocation.trim().length > 0
      : Object.values(absenceReasons).some(
          (reason) => (reason || "").trim().length > 0,
        );

  // Prevent accidental page refresh / tab close when form has unsaved inputs
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

  // Sync reportType with searchParams
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
        "작성 중인 내용이 있습니다. 탭을 전환하면 입력한 내용이 사라질 수 있습니다. 계속 진행하시겠습니까?",
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
        "작성 중인 내용이 있습니다. 정원을 변경하면 작성 중인 내용이 초기화됩니다. 변경하시겠습니까?",
      );
      if (!confirmChange) return;
    }
    setSelectedGarden(newGarden);
    setGatheringNotes("");
    setGatheringLocation("");
    setAbsenceReasons({});
  };

  // Generate recent Sundays for the date dropdown
  const [recentSundays] = useState(() => getRecentSundays());

  useEffect(() => {
    if (recentSundays.length > 0) {
      setSelectedDate(formatDateString(recentSundays[0]));
    }
  }, [recentSundays]);

  // Fetch gardens and members when user is authenticated and has leader role
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
              : gardenNames[0],
          );
        } else {
          setSelectedGarden("");
        }
        setLoading(false);
      },
      (errMsg) => {
        setError(errMsg);
        setLoading(false);
      },
    );
  };

  useEffect(() => {
    if (!authInitialized || !authenticated || !isLeader) return;
    fetchData();
  }, [authInitialized, authenticated, isLeader]);

  // Handle selected garden members and existing report check
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
        },
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
        },
      );
    }

    return () => {
      isMounted = false;
    };
  }, [selectedGarden, selectedDate, gatheringDateStr, reportType, gardens]);

  // Fetch gathering history dates for DatePicker badges and quick selection
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
      },
    );

    return () => {
      isMounted = false;
    };
  }, [reportType, selectedGarden]);

  // Handle submission side effects from React Router Action
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
          : `${selectedGarden} 정원 주일 출석 보고가 완료되었습니다!`,
      );

      setIsReported(true);

      // Automatically add new gathering date to history dates if submitted
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

  const handleLoginClick = async () => {
    const { default: SignInModal } = await import(
      "../../components/User/SignInModal"
    );
    openModal(SignInModal, {});
  };

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
      return {
        ...prev,
        [name]: isNowChecked,
      };
    });
  };

  const handleAbsenceReasonChange = (name, value) => {
    setAbsenceReasons((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      submit(
        { reportType, payload },
        { method: "post", encType: "application/json" },
      );
    } else {
      const payload = {
        date: selectedDate,
        gardenName: selectedGarden,
        attendees,
        absentees,
        absenceReasons,
      };

      submit(
        { reportType, payload },
        { method: "post", encType: "application/json" },
      );
    }
  };

  return (
    <>
      <title>
        {reportType === "gathering"
          ? "정원 모임 보고 - OCCE"
          : "주일 출석 보고 - OCCE"}
      </title>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 830,
              letterSpacing: "0.2em",
              pl: "0.2em",
              color: "white",
            }}
          >
            {reportType === "gathering" ? "정원 모임 보고" : "주일 출석 보고"}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.8)",
              mt: "8px",
            }}
          >
            {reportType === "gathering"
              ? "정원 모임을 가진 후, 모임 정보와 나눔 내용을 보고해주세요."
              : "주일에 교회에 출석한 정원 가족들을 보고해주세요."}
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div
          className="container"
          style={{
            maxWidth: "800px",
            width: "100%",
            margin: "0 auto",
            padding: "24px 16px",
          }}
        >
          {!authInitialized ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
              }}
            >
              <CircularProgress sx={{ color: "#dc2626", mb: 2 }} />
              <Typography variant="body1" sx={{ color: "#666" }}>
                정원 및 멤버 정보를 불러오는 중입니다...
              </Typography>
            </Box>
          ) : !authenticated ? (
            // 1. Unauthenticated View
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "16px",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.08)",
                textAlign: "center",
                p: 4,
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, mb: 2, color: "#dc2626" }}
                >
                  로그인이 필요한 서비스입니다
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#555", mb: 4, lineHeight: 1.6 }}
                >
                  정원 보고서는 온교회 정원지기 및 목회자만 작성하실 수
                  있습니다.
                  <br />
                  가입은 교인 등록 명부에 등록된 성명과 전화번호 정보가 일치해야
                  가능합니다.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleLoginClick}
                  startIcon={<LoginIcon />}
                  sx={{
                    backgroundColor: "#dc2626",
                    "&:hover": { backgroundColor: "#b91c1c" },
                    borderRadius: "24px",
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  로그인하기
                </Button>
              </CardContent>
            </Card>
          ) : !isLeader ? (
            // 2. Unauthorized View (Authenticated but not Staff/GardenKeeper)
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "16px",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.08)",
                textAlign: "center",
                p: 4,
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, mb: 2, color: "#dc2626" }}
                >
                  접근 권한이 없습니다
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#555", mb: 4, lineHeight: 1.6 }}
                >
                  정원 보고서는 온교회 정원지기 및 목회자만 작성하실 수
                  있습니다.
                </Typography>
                <Button
                  component={Link}
                  to="/community/smallgroup"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#dc2626",
                    "&:hover": { backgroundColor: "#b91c1c" },
                    borderRadius: "24px",
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  소그룹 페이지로 돌아가기
                </Button>
              </CardContent>
            </Card>
          ) : loading ? (
            // 2. Loading View
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
              }}
            >
              <CircularProgress sx={{ color: "#dc2626", mb: 2 }} />
              <Typography variant="body1" sx={{ color: "#666" }}>
                정원 및 멤버 정보를 불러오는 중입니다...
              </Typography>
            </Box>
          ) : error ? (
            // 3. Error View
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "16px",
                border: "1px solid rgba(239, 83, 80, 0.3)",
                p: 4,
                textAlign: "center",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: "#d32f2f", fontWeight: 700, mb: 2 }}
                >
                  오류가 발생했습니다
                </Typography>
                <Typography variant="body1" sx={{ color: "#555", mb: 3 }}>
                  {error}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={fetchData}
                  sx={{
                    color: "#dc2626",
                    borderColor: "#dc2626",
                    "&:hover": {
                      borderColor: "#b91c1c",
                      backgroundColor: "rgba(220, 38, 38, 0.04)",
                    },
                    borderRadius: "20px",
                  }}
                >
                  다시 시도
                </Button>
              </CardContent>
            </Card>
          ) : submitting ? (
            // 5. Submitting Loader View
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 12,
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(8px)",
                borderRadius: "16px",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                textAlign: "center",
              }}
            >
              <CircularProgress
                sx={{
                  color: reportType === "sunday" ? "#dc2626" : "#ea580c",
                  mb: 3,
                }}
                size={50}
              />
              <Typography
                variant="h6"
                sx={{ color: "#333", fontWeight: 700, mb: 1 }}
              >
                보고서를 제출하는 중입니다...
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                잠시만 기다려 주세요. 구글 드라이브에 저장 중입니다.
              </Typography>
            </Box>
          ) : (
            // 4. Form View (Authenticated & Loaded)
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Tab Selector */}
              <Box
                sx={{
                  display: "flex",
                  borderBottom: 1,
                  borderColor: "divider",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <Button
                  onClick={() => handleReportTypeChange("sunday")}
                  sx={{
                    flex: 1,
                    py: 1.8,
                    fontWeight: 700,
                    fontSize: "1.05em",
                    color: reportType === "sunday" ? "#dc2626" : "#666",
                    borderBottom:
                      reportType === "sunday" ? "4px solid #dc2626" : "none",
                    borderRadius: 0,
                    backgroundColor:
                      reportType === "sunday"
                        ? "rgba(220, 38, 38, 0.05)"
                        : "transparent",
                    "&:hover": { backgroundColor: "rgba(220, 38, 38, 0.08)" },
                  }}
                >
                  주일 출석 보고
                </Button>
                <Button
                  onClick={() => handleReportTypeChange("gathering")}
                  sx={{
                    flex: 1,
                    py: 1.8,
                    fontWeight: 700,
                    fontSize: "1.05em",
                    color: reportType === "gathering" ? "#ea580c" : "#666",
                    borderBottom:
                      reportType === "gathering" ? "4px solid #ea580c" : "none",
                    borderRadius: 0,
                    backgroundColor:
                      reportType === "gathering"
                        ? "rgba(234, 88, 12, 0.05)"
                        : "transparent",
                    "&:hover": { backgroundColor: "rgba(234, 88, 12, 0.08)" },
                  }}
                >
                  정원 모임 보고
                </Button>
              </Box>

              {reportType === "gathering" ? (
                <GatheringForm
                  gardens={gardens}
                  selectedGarden={selectedGarden}
                  handleGardenChange={handleGardenChange}
                  gatheringDate={gatheringDate}
                  setGatheringDate={setGatheringDate}
                  gatheringTime={gatheringTime}
                  setGatheringTime={setGatheringTime}
                  gatheringLocation={gatheringLocation}
                  setGatheringLocation={setGatheringLocation}
                  gatheringNotes={gatheringNotes}
                  setGatheringNotes={setGatheringNotes}
                  gatheringHistoryDates={gatheringHistoryDates}
                  gatheringDateStr={gatheringDateStr}
                  checkingReport={checkingReport}
                  isReported={isReported}
                  attendees={attendees}
                  absentees={absentees}
                  checkedMembers={checkedMembers}
                  handleToggleMember={handleToggleMember}
                  handleCheckAll={handleCheckAll}
                  handleUncheckAll={handleUncheckAll}
                  handleFormSubmit={handleFormSubmit}
                  submitting={submitting}
                  membersList={membersList}
                />
              ) : (
                <SundayForm
                  gardens={gardens}
                  selectedGarden={selectedGarden}
                  handleGardenChange={handleGardenChange}
                  recentSundays={recentSundays}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  checkingReport={checkingReport}
                  isReported={isReported}
                  attendees={attendees}
                  absentees={absentees}
                  checkedMembers={checkedMembers}
                  handleToggleMember={handleToggleMember}
                  handleCheckAll={handleCheckAll}
                  handleUncheckAll={handleUncheckAll}
                  absenceReasons={absenceReasons}
                  handleAbsenceReasonChange={handleAbsenceReasonChange}
                  handleFormSubmit={handleFormSubmit}
                  submitting={submitting}
                  membersList={membersList}
                />
              )}
            </Box>
          )}
        </div>
      </div>

      {confirmOpen && (
        <ConfirmSubmitDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmSubmit}
          reportType={reportType}
          isReported={isReported}
          selectedGarden={selectedGarden}
          selectedDate={selectedDate}
          gatheringDate={gatheringDate}
          gatheringTime={gatheringTime}
          gatheringLocation={gatheringLocation}
          attendees={attendees}
          absentees={absentees}
        />
      )}
    </>
  );
};

export default SmallGroupReport;

export async function action({ request }) {
  try {
    const { reportType, payload } = await request.json();

    if (reportType === "gathering") {
      const res = await axios.post("/api/attendance/gathering-report", payload);
      return { success: true, reportType, message: res.data || "Success" };
    } else {
      const res = await axios.post("/api/attendance/report", payload);
      return { success: true, reportType, message: res.data || "Success" };
    }
  } catch (error) {
    console.error("Action error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "보고 제출에 실패했습니다.",
    };
  }
}
