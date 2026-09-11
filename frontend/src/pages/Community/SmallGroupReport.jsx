import { useState, useEffect, useMemo } from "react";
import useAuthStore from "../../store/useAuthStore";
import {
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Paper,
  Divider,
  Alert,
  Chip,
  LinearProgress,
  Badge,
  useForkRef,
  InputAdornment,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditNoteIcon from "@mui/icons-material/EditNote";
import LoginIcon from "@mui/icons-material/Login";
import SendIcon from "@mui/icons-material/Send";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import useModals from "../../util/useModal.js";
import useSnackbar from "../../util/useSnackbar.js";
import {
  getGardensAndMembers,
  getAttendanceReport,
  getGatheringReport,
  getGatheringHistory,
} from "../../api/attendance.js";
import { useSearchParams, useSubmit, useActionData, useNavigation, Link } from "react-router";
import axios from "axios";
import { format, isToday } from "date-fns";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
  PickerDay,
  usePickerContext,
  useSplitFieldProps,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const titleBackground = {
  backgroundImage: 'url("/img/Community/SmallGroup.webp")',
  backgroundPositionY: "58%",
};

const getRecentSundays = () => {
  const sundays = [];
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  // Find the closest past Sunday (if today is Sunday, it starts with today)
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - currentDay);

  for (let i = 0; i < 4; i++) {
    const sunday = new Date(lastSunday);
    sunday.setDate(lastSunday.getDate() - i * 7);
    sundays.push(sunday);
  }
  return sundays;
};

const formatDateString = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const formatDateLabel = (date) => {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  return `${yyyy}년 ${mm}월 ${dd}일 주일`;
};

function GatheringCustomDay(props) {
  const { day, outsideCurrentMonth, selected, historyDates = [], ...other } = props;
  const dateStr =
    day && !isNaN(new Date(day).getTime()) ? format(day, "yyyy-MM-dd") : "";
  const isMarked =
    !outsideCurrentMonth && dateStr && historyDates.includes(dateStr);

  return (
    <Box
      component="span"
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PickerDay
        {...other}
        day={day}
        selected={selected}
        outsideCurrentMonth={outsideCurrentMonth}
      />
      {isMarked && (
        <Box
          component="span"
          sx={{
            position: "absolute",
            bottom: "4px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: selected ? "#ffffff" : "#ea580c",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
}

const GatheringDateButtonField = (props) => {
  const { _, forwardedProps } = useSplitFieldProps(props, "date");
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const { disabled } = forwardedProps;

  let displayDate = "";
  if (pickerContext.value && !isNaN(new Date(pickerContext.value).getTime())) {
    const d = new Date(pickerContext.value);
    const dayOfWeekNames = ["일", "월", "화", "수", "목", "금", "토"];
    displayDate = `${format(d, "yyyy. MM. dd.")} (${dayOfWeekNames[d.getDay()]})`;
  }

  return (
    <TextField
      fullWidth
      ref={handleRef}
      label="모임 날짜"
      placeholder="날짜 선택"
      value={displayDate}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          pickerContext.setOpen((prev) => !prev);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          pickerContext.setOpen((prev) => !prev);
        } else if (!e.ctrlKey && !e.metaKey && e.key.length === 1) {
          e.preventDefault();
        }
      }}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
        input: {
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <CalendarTodayIcon
                sx={{
                  color: "#ea580c",
                  cursor: disabled ? "default" : "pointer",
                }}
              />
            </InputAdornment>
          ),
          sx: {
            cursor: disabled ? "default" : "pointer",
            "& input": {
              cursor: disabled ? "default" : "pointer",
              fontWeight: 500,
              color: "#222",
              userSelect: "none",
            },
          },
        },
        htmlInput: {
          readOnly: true,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          cursor: disabled ? "default" : "pointer",
          backgroundColor: "#fff",
          "&:hover fieldset": {
            borderColor: disabled ? undefined : "#ea580c",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#ea580c",
          },
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#ea580c",
        },
      }}
    />
  );
};

const GatheringTimeButtonField = (props) => {
  const { _, forwardedProps } = useSplitFieldProps(props, "time");
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const { disabled } = forwardedProps;

  let displayTime = "";
  if (pickerContext.value && !isNaN(new Date(pickerContext.value).getTime())) {
    const d = new Date(pickerContext.value);
    const hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours < 12 ? "오전" : "오후";
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    displayTime = `${ampm} ${displayHours}:${minutes}`;
  }

  return (
    <TextField
      fullWidth
      ref={handleRef}
      label="모임 시간"
      placeholder="시간 선택"
      value={displayTime}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          pickerContext.setOpen((prev) => !prev);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          pickerContext.setOpen((prev) => !prev);
        } else if (!e.ctrlKey && !e.metaKey && e.key.length === 1) {
          e.preventDefault();
        }
      }}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
        input: {
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <AccessTimeIcon
                sx={{
                  color: "#ea580c",
                  cursor: disabled ? "default" : "pointer",
                }}
              />
            </InputAdornment>
          ),
          sx: {
            cursor: disabled ? "default" : "pointer",
            "& input": {
              cursor: disabled ? "default" : "pointer",
              fontWeight: 500,
              color: "#222",
              userSelect: "none",
            },
          },
        },
        htmlInput: {
          readOnly: true,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          cursor: disabled ? "default" : "pointer",
          backgroundColor: "#fff",
          "&:hover fieldset": {
            borderColor: disabled ? undefined : "#ea580c",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#ea580c",
          },
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#ea580c",
        },
      }}
    />
  );
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialType =
    searchParams.get("type") === "gathering" ? "gathering" : "sunday";
  const [reportType, setReportType] = useState(initialType);

  const getTodayKST = () => {
    const d = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(d.getTime() + kstOffset);
    return kstDate.toISOString().split("T")[0];
  };

  const [gatheringDate, setGatheringDate] = useState(new Date());
  const gatheringDateStr = useMemo(() => {
    if (!gatheringDate || isNaN(new Date(gatheringDate).getTime())) return "";
    return format(gatheringDate, "yyyy-MM-dd");
  }, [gatheringDate]);
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
  const isDirty = useMemo(() => {
    if (reportType === "gathering") {
      return (
        gatheringNotes.trim().length > 0 ||
        gatheringLocation.trim().length > 0
      );
    } else {
      return Object.values(absenceReasons).some(
        (reason) => (reason || "").trim().length > 0,
      );
    }
  }, [reportType, gatheringNotes, gatheringLocation, absenceReasons]);

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
  const recentSundays = useMemo(() => getRecentSundays(), []);

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
      }
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
          ? `${selectedGarden} 출석 보고서가 성공적으로 수정(업데이트)되었습니다!`
          : `${selectedGarden} 출석 보고가 완료되었습니다!`
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

  const membersList = useMemo(() => {
    return gardens[selectedGarden] || [];
  }, [selectedGarden, gardens]);

  const attendees = useMemo(() => {
    return membersList.filter((m) => checkedMembers[m] !== false);
  }, [membersList, checkedMembers]);

  const absentees = useMemo(() => {
    return membersList.filter((m) => checkedMembers[m] === false);
  }, [membersList, checkedMembers]);

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
        { method: "post", encType: "application/json" }
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
        { method: "post", encType: "application/json" }
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
                  정원 보고서는 온교회 정원지기 및 목회자만 작성하실 수 있습니다.
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
                  정원 보고서는 온교회 정원지기 및 목회자만 작성하실 수 있습니다.
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
                <>
                  {/* Gathering Info Card */}
                  <Card
                    sx={{
                      background: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                      p: 2,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#ea580c", mb: 2 }}
                      >
                        모임 정보 입력
                      </Typography>
                      <Grid container spacing={2}>
                        {/* Garden Selection */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                          {Object.keys(gardens).length > 1 ? (
                            <FormControl fullWidth>
                              <InputLabel id="select-gathering-garden-label">
                                정원 선택
                              </InputLabel>
                              <Select
                                labelId="select-gathering-garden-label"
                                value={selectedGarden}
                                label="정원 선택"
                                onChange={(e) =>
                                  handleGardenChange(e.target.value)
                                }
                              >
                                {Object.keys(gardens).map((name) => (
                                  <MenuItem key={name} value={name}>
                                    {name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <Box
                              sx={{
                                border: "1px solid rgba(0, 0, 0, 0.23)",
                                borderRadius: "4px",
                                p: "16.5px 14px",
                                backgroundColor: "rgba(0, 0, 0, 0.02)",
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 600, color: "#ea580c" }}
                              >
                                정원: {selectedGarden}
                              </Typography>
                            </Box>
                          )}
                        </Grid>

                        {/* Gathering Date */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={gatheringDate}
                              onChange={(newVal) => {
                                setGatheringDate(newVal);
                                if (newVal && isToday(newVal)) {
                                  setGatheringTime((prevTime) => {
                                    const now = new Date();
                                    if (prevTime && prevTime > now) {
                                      return now;
                                    }
                                    return prevTime;
                                  });
                                }
                              }}
                              disabled={checkingReport}
                              maxDate={new Date()}
                              slots={{
                                field: GatheringDateButtonField,
                                day: GatheringCustomDay,
                              }}
                              slotProps={{
                                day: {
                                  historyDates: gatheringHistoryDates,
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </Grid>

                        {/* Gathering Time */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker
                              value={gatheringTime}
                              onChange={setGatheringTime}
                              disabled={checkingReport}
                              maxTime={
                                gatheringDate && isToday(gatheringDate)
                                  ? new Date()
                                  : undefined
                              }
                              slots={{
                                field: GatheringTimeButtonField,
                              }}
                            />
                          </LocalizationProvider>
                        </Grid>

                        {/* Gathering Location */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            required
                            disabled={checkingReport}
                            label="모임 장소"
                            placeholder="예: 정원지기 가정, 카페, 교회 등"
                            value={gatheringLocation}
                            onChange={(e) =>
                              setGatheringLocation(e.target.value)
                            }
                          />
                        </Grid>

                        {/* Past Gathering Dates Shortcut Chips */}
                        {gatheringHistoryDates.length > 0 && (
                          <Grid size={{ xs: 12 }}>
                            <Box
                              sx={{
                                pt: 1.5,
                                mt: 0.5,
                                borderTop: "1px dashed rgba(234, 88, 12, 0.2)",
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#c2410c",
                                  fontWeight: 700,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  mb: 1,
                                }}
                              >
                                📅 이전 모임 보고 날짜 (클릭 시 해당 보고서 조회):
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.75,
                                }}
                              >
                                {gatheringHistoryDates.slice(0, 8).map((dateStr) => {
                                  const isCurrent = dateStr === gatheringDateStr;
                                  const d = new Date(dateStr + "T00:00:00");
                                  const dayOfWeekNames = [
                                    "일",
                                    "월",
                                    "화",
                                    "수",
                                    "목",
                                    "금",
                                    "토",
                                  ];
                                  const dayLabel = !isNaN(d.getTime())
                                    ? `${format(d, "yyyy. MM. dd")} (${
                                        dayOfWeekNames[d.getDay()]
                                      })`
                                    : dateStr;

                                  return (
                                    <Chip
                                      key={dateStr}
                                      label={dayLabel}
                                      size="small"
                                      onClick={() => {
                                        const [y, m, day] = dateStr
                                          .split("-")
                                          .map(Number);
                                        setGatheringDate(
                                          new Date(y, m - 1, day),
                                        );
                                      }}
                                      variant={isCurrent ? "filled" : "outlined"}
                                      sx={{
                                        fontSize: "0.75rem",
                                        fontWeight: isCurrent ? 700 : 500,
                                        borderColor: isCurrent
                                          ? "#ea580c"
                                          : "rgba(234, 88, 12, 0.4)",
                                        backgroundColor: isCurrent
                                          ? "#ea580c"
                                          : "rgba(234, 88, 12, 0.04)",
                                        color: isCurrent ? "#ffffff" : "#c2410c",
                                        "&:hover": {
                                          backgroundColor: isCurrent
                                            ? "#c2410c"
                                            : "rgba(234, 88, 12, 0.12)",
                                        },
                                        cursor: "pointer",
                                      }}
                                    />
                                  );
                                })}
                              </Box>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>

                  {checkingReport && (
                    <LinearProgress
                      sx={{
                        borderRadius: "4px",
                        backgroundColor: "rgba(234, 88, 12, 0.1)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#ea580c",
                        },
                        my: 1,
                      }}
                    />
                  )}

                  {isReported && (
                    <Alert
                      severity="success"
                      icon={<CheckCircleIcon sx={{ color: "#15803d", mt: 0.5 }} />}
                      sx={{
                        borderRadius: "16px",
                        backgroundColor: "rgba(240, 253, 244, 0.95)",
                        border: "1px solid rgba(34, 197, 94, 0.3)",
                        boxShadow: "0 4px 16px rgba(34, 197, 94, 0.08)",
                        p: { xs: 1.5, sm: 2 },
                        "& .MuiAlert-message": { width: "100%" },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 800, color: "#166534" }}
                        >
                          이미 제출된 정원 모임 보고서가 있습니다
                        </Typography>
                        <Chip
                          label="기존 제출 내역 불러옴"
                          size="small"
                          sx={{
                            backgroundColor: "#16a34a",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            height: "24px",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#15803d", mt: 0.5, lineHeight: 1.5 }}
                      >
                        기존에 제출하신 모임 일시, 장소, 참석 명단 및 나눔 내용을 불러왔습니다. 변경이 필요한 부분만 수정한 후 다시 제출하시면 업데이트됩니다.
                      </Typography>
                    </Alert>
                  )}

                  {/* Members Checklist Card */}
                  <Card
                    sx={{
                      background: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                      p: 2,
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: "#ea580c" }}
                        >
                          참석 여부 체크
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Paper
                            variant="outlined"
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              backgroundColor: "#fff7ed",
                              borderColor: "#ffedd5",
                              borderRadius: "12px",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#ea580c", fontWeight: 700 }}
                            >
                              참석 {attendees.length}명
                            </Typography>
                          </Paper>
                          <Paper
                            variant="outlined"
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              backgroundColor: "#f5f5f5",
                              borderColor: "#e0e0e0",
                              borderRadius: "12px",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#666666", fontWeight: 700 }}
                            >
                              결석 {absentees.length}명
                            </Typography>
                          </Paper>
                        </Box>
                      </Box>

                      <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                        💡 모임에 참석한 인원만 체크해 주세요. 기본적으로 모두
                        선택되어 있습니다.
                      </Typography>

                      <Divider sx={{ mb: 2 }} />

                      <Grid container spacing={1}>
                        {(gardens[selectedGarden] || []).map((member) => {
                          const isChecked = checkedMembers[member] !== false;
                          return (
                            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={member}>
                              <Paper
                                variant="outlined"
                                onClick={() => {
                                  if (!checkingReport) {
                                    handleToggleMember(member);
                                  }
                                }}
                                sx={{
                                  p: 1.5,
                                  cursor: checkingReport ? "not-allowed" : "pointer",
                                  borderRadius: "8px",
                                  border: isChecked
                                    ? "1.2px solid #fdba74"
                                    : "1px solid #e0e0e0",
                                  backgroundColor: isChecked
                                    ? "#fff7ed"
                                    : "#fafafa",
                                  opacity: checkingReport ? 0.6 : 1,
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    borderColor: checkingReport
                                      ? (isChecked ? "#fdba74" : "#e0e0e0")
                                      : (isChecked ? "#ea580c" : "#bdbdbd"),
                                    backgroundColor: checkingReport
                                      ? (isChecked ? "#fff7ed" : "#fafafa")
                                      : (isChecked ? "#ffedd5" : "#eeeeee"),
                                  },
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: isChecked ? 600 : 400,
                                    color: isChecked ? "#ea580c" : "#9e9e9e",
                                    textDecoration: isChecked
                                      ? "none"
                                      : "line-through",
                                  }}
                                >
                                  {member}
                                </Typography>
                                <Checkbox
                                  size="small"
                                  checked={isChecked}
                                  disabled={checkingReport}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={() => handleToggleMember(member)}
                                  sx={{
                                    color: "#bdbdbd",
                                    "&.Mui-checked": {
                                      color: "#ea580c",
                                    },
                                    p: 0,
                                  }}
                                />
                              </Paper>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Gathering Notes Card */}
                  <Card
                    sx={{
                      background: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                      p: 2,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#ea580c", mb: 2 }}
                      >
                        모임 내용 및 나눔/기도제목
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        disabled={checkingReport}
                        placeholder="모임의 주요 나눔 내용이나 함께 나누고 싶은 기도제목을 적어주세요."
                        value={gatheringNotes}
                        onChange={(e) => setGatheringNotes(e.target.value)}
                      />
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 1,
                      mb: 4,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      disabled={
                        submitting || checkingReport || membersList.length === 0
                      }
                      onClick={handleFormSubmit}
                      startIcon={
                        submitting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : isReported ? (
                          <EditNoteIcon />
                        ) : (
                          <SendIcon />
                        )
                      }
                      sx={{
                        backgroundColor: isReported ? "#2563eb" : "#ea580c",
                        "&:hover": {
                          backgroundColor: isReported ? "#1d4ed8" : "#c2410c",
                        },
                        borderRadius: "28px",
                        px: 6,
                        py: 1.8,
                        fontWeight: 700,
                        fontSize: "1.05em",
                        boxShadow: isReported
                          ? "0 4px 14px 0 rgba(37, 99, 235, 0.3)"
                          : "0 4px 14px 0 rgba(234, 88, 12, 0.3)",
                      }}
                    >
                      {submitting
                        ? "제출 중..."
                        : isReported
                        ? "정원 모임 보고 수정(업데이트)하기"
                        : "정원 모임 보고 제출하기"}
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  {/* Form Settings Card */}
                  <Card
                    sx={{
                      background: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                      p: 2,
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={2}>
                        {/* Date Picker */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormControl fullWidth>
                            <InputLabel id="select-date-label">
                              보고주일
                            </InputLabel>
                            <Select
                              labelId="select-date-label"
                              value={selectedDate}
                              label="보고주일"
                              onChange={(e) => setSelectedDate(e.target.value)}
                            >
                              {recentSundays.map((date) => {
                                const val = formatDateString(date);
                                return (
                                  <MenuItem key={val} value={val}>
                                    {formatDateLabel(date)}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Garden Selection */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                          {Object.keys(gardens).length > 1 ? (
                            <FormControl fullWidth>
                              <InputLabel id="select-garden-label">
                                정원 선택
                              </InputLabel>
                              <Select
                                labelId="select-garden-label"
                                value={selectedGarden}
                                label="정원 선택"
                                onChange={(e) =>
                                  handleGardenChange(e.target.value)
                                }
                              >
                                {Object.keys(gardens).map((name) => (
                                  <MenuItem key={name} value={name}>
                                    {name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <Box
                              sx={{
                                border: "1px solid rgba(0, 0, 0, 0.23)",
                                borderRadius: "4px",
                                p: "16.5px 14px",
                                backgroundColor: "rgba(0, 0, 0, 0.02)",
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 600, color: "#dc2626" }}
                              >
                                정원: {selectedGarden}
                              </Typography>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {checkingReport && (
                    <LinearProgress
                      sx={{
                        borderRadius: "4px",
                        backgroundColor: "rgba(220, 38, 38, 0.1)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#dc2626",
                        },
                        my: 1,
                      }}
                    />
                  )}

                  {isReported && (
                    <Alert
                      severity="success"
                      icon={<CheckCircleIcon sx={{ color: "#15803d", mt: 0.5 }} />}
                      sx={{
                        borderRadius: "16px",
                        backgroundColor: "rgba(240, 253, 244, 0.95)",
                        border: "1px solid rgba(34, 197, 94, 0.3)",
                        boxShadow: "0 4px 16px rgba(34, 197, 94, 0.08)",
                        p: { xs: 1.5, sm: 2 },
                        "& .MuiAlert-message": { width: "100%" },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 800, color: "#166534" }}
                        >
                          이미 제출된 출석 보고서가 있습니다
                        </Typography>
                        <Chip
                          label="기존 제출 내역 불러옴"
                          size="small"
                          sx={{
                            backgroundColor: "#16a34a",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            height: "24px",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#15803d", mt: 0.5, lineHeight: 1.5 }}
                      >
                        기존에 제출하신 출석/결석 및 사유를 불러왔습니다. 변경이 필요한 부분만 수정한 후 다시 제출하시면 업데이트됩니다.
                      </Typography>
                    </Alert>
                  )}

                  {/* Members Checklist Card */}
                  <Card
                    sx={{
                      background: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                      p: 2,
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: "#dc2626" }}
                        >
                          출석체크
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Paper
                            variant="outlined"
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              backgroundColor: "#fef2f2",
                              borderColor: "#fee2e2",
                              borderRadius: "12px",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#dc2626", fontWeight: 700 }}
                            >
                              출석 {attendees.length}명
                            </Typography>
                          </Paper>
                          <Paper
                            variant="outlined"
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              backgroundColor: "#f5f5f5",
                              borderColor: "#e0e0e0",
                              borderRadius: "12px",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#666666", fontWeight: 700 }}
                            >
                              결석 {absentees.length}명
                            </Typography>
                          </Paper>
                        </Box>
                      </Box>

                      <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                        💡 기본적으로 모든 정원 가족이 <b>출석</b>으로
                        되어있습니다. 결석하신 분만 체크를 해제해 주세요.
                      </Typography>

                      <Divider sx={{ mb: 2 }} />

                      <Grid container spacing={1}>
                        {(gardens[selectedGarden] || []).map((member) => {
                          const isChecked = checkedMembers[member] !== false;
                          return (
                            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={member}>
                              <Paper
                                variant="outlined"
                                onClick={() => {
                                  if (!checkingReport) {
                                    handleToggleMember(member);
                                  }
                                }}
                                sx={{
                                  p: 1.5,
                                  cursor: checkingReport ? "not-allowed" : "pointer",
                                  borderRadius: "8px",
                                  border: isChecked
                                    ? "1.2px solid #fca5a5"
                                    : "1px solid #e0e0e0",
                                  backgroundColor: isChecked
                                    ? "#fef2f2"
                                    : "#fafafa",
                                  opacity: checkingReport ? 0.6 : 1,
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    borderColor: checkingReport
                                      ? (isChecked ? "#fca5a5" : "#e0e0e0")
                                      : (isChecked ? "#dc2626" : "#bdbdbd"),
                                    backgroundColor: checkingReport
                                      ? (isChecked ? "#fef2f2" : "#fafafa")
                                      : (isChecked ? "#fee2e2" : "#eeeeee"),
                                  },
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: isChecked ? 600 : 400,
                                    color: isChecked ? "#dc2626" : "#9e9e9e",
                                    textDecoration: isChecked
                                      ? "none"
                                      : "line-through",
                                  }}
                                >
                                  {member}
                                </Typography>
                                <Checkbox
                                  size="small"
                                  checked={isChecked}
                                  disabled={checkingReport}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={() => handleToggleMember(member)}
                                  sx={{
                                    color: "#bdbdbd",
                                    "&.Mui-checked": {
                                      color: "#dc2626",
                                    },
                                    p: 0,
                                  }}
                                />
                              </Paper>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Absentees Reasons Card */}
                  {absentees.length > 0 && (
                    <Card
                      sx={{
                        background: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "16px",
                        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                        p: 2,
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: "#dc2626", mb: 2 }}
                        >
                          결석 사유 입력 (선택사항)
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", mb: 2 }}
                        >
                          결석한 교인별로 사유(예: 개인 여행, 감기 몸살, 출장
                          등)를 적어주시면 구글 시트에 메모로 기록됩니다.
                        </Typography>
                        <Grid container spacing={2}>
                          {absentees.map((name) => (
                            <Grid
                              size={{ xs: 12, sm: 6 }}
                              key={name}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 600,
                                  minWidth: "70px",
                                  color: "#dc2626",
                                }}
                              >
                                {name}
                              </Typography>
                              <TextField
                                fullWidth
                                size="small"
                                disabled={checkingReport}
                                placeholder="예: 개인 여행, 감기 몸살 등"
                                value={absenceReasons[name] || ""}
                                onChange={(e) =>
                                  handleAbsenceReasonChange(
                                    name,
                                    e.target.value,
                                  )
                                }
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  )}

                  {/* Submit Button */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 1,
                      mb: 4,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      disabled={
                        submitting || checkingReport || membersList.length === 0
                      }
                      onClick={handleFormSubmit}
                      startIcon={
                        submitting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : isReported ? (
                          <EditNoteIcon />
                        ) : (
                          <SendIcon />
                        )
                      }
                      sx={{
                        backgroundColor: isReported ? "#2563eb" : "#dc2626",
                        "&:hover": {
                          backgroundColor: isReported ? "#1d4ed8" : "#b91c1c",
                        },
                        borderRadius: "28px",
                        px: 6,
                        py: 1.8,
                        fontWeight: 700,
                        fontSize: "1.05em",
                        boxShadow: isReported
                          ? "0 4px 14px 0 rgba(37, 99, 235, 0.3)"
                          : "0 4px 14px 0 rgba(220, 38, 38, 0.3)",
                      }}
                    >
                      {submitting
                        ? "제출 중..."
                        : isReported
                        ? "주일 출석 보고 수정(업데이트)하기"
                        : "주일 출석 보고 제출하기"}
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        slotProps={{ paper: { sx: { borderRadius: "16px" } } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: isReported
              ? "#2563eb"
              : reportType === "gathering"
              ? "#ea580c"
              : "#dc2626",
          }}
        >
          {reportType === "gathering"
            ? isReported
              ? "정원 모임 보고 수정(업데이트) 확인"
              : "정원 모임 보고 제출 확인"
            : isReported
            ? "출석 보고 수정(업데이트) 확인"
            : "출석 보고 제출 확인"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {reportType === "gathering"
              ? isReported
                ? "수정하신 내용으로 모임 보고서를 업데이트하시겠습니까? 구글 스프레드시트에 실시간 반영됩니다."
                : "작성하신 내용을 최종 제출하시겠습니까? 구글 스프레드시트에 실시간 기록됩니다."
              : isReported
              ? "수정하신 내용으로 출석 보고서를 업데이트하시겠습니까? 구글 스프레드시트의 해당 주차 시트에 실시간 반영됩니다."
              : "작성하신 내용을 최종 제출하시겠습니까? 구글 스프레드시트의 해당 주차 시트에 실시간 기록됩니다."}
          </DialogContentText>
          <Box sx={{ backgroundColor: "#f9f9f9", p: 2, borderRadius: "8px" }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <b>보고 정원:</b> {selectedGarden}
            </Typography>
            {reportType === "gathering" ? (
              <>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <b>모임 일시:</b>{" "}
                  {gatheringDate ? format(gatheringDate, "yyyy-MM-dd") : ""}{" "}
                  {gatheringTime ? format(gatheringTime, "HH:mm") : ""}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <b>모임 장소:</b> {gatheringLocation || "미기입"}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <b>보고 주일:</b> {selectedDate}
              </Typography>
            )}
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <b>참석 인원:</b> {attendees.length}명 ({attendees.join(", ")})
            </Typography>
            {absentees.length > 0 && (
              <Typography variant="body2" sx={{ color: "#d32f2f", mb: 0.5 }}>
                <b>결석 인원:</b> {absentees.length}명 ({absentees.join(", ")})
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{ color: "#555", fontWeight: 600 }}
          >
            취소
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            startIcon={isReported ? <EditNoteIcon /> : <CheckCircleOutlineIcon />}
            sx={{
              backgroundColor: isReported
                ? "#2563eb"
                : reportType === "gathering"
                ? "#ea580c"
                : "#dc2626",
              "&:hover": {
                backgroundColor: isReported
                  ? "#1d4ed8"
                  : reportType === "gathering"
                  ? "#c2410c"
                  : "#b91c1c",
              },
              borderRadius: "20px",
              px: 3,
              fontWeight: 600,
            }}
          >
            {isReported ? "수정 완료" : "제출 완료"}
          </Button>
        </DialogActions>
      </Dialog>
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
      error: error.response?.data?.message || "보고 제출에 실패했습니다."
    };
  }
}
