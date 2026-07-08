import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
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
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import LoginIcon from "@mui/icons-material/Login";
import SendIcon from "@mui/icons-material/Send";
import useModals from "../../util/useModal.js";
import useSnackbar from "../../util/useSnackbar.js";
import {
  getGardensAndMembers,
  submitAttendanceReport,
  submitGatheringReport,
} from "../../api/attendance.js";
import { useSearchParams } from "react-router";
import { format } from "date-fns";
import ButtonDatePicker from "../../common/ButtonDatePicker";

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

const SmallGroupReport = () => {
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();

  const authenticated = useSelector((state) => state.authToken?.authenticated);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStaff, setIsStaff] = useState(false);
  const [assignedGarden, setAssignedGarden] = useState(null);
  const [gardens, setGardens] = useState({});
  const [selectedGarden, setSelectedGarden] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [checkedMembers, setCheckedMembers] = useState({});
  const [absenceReasons, setAbsenceReasons] = useState({});
  const [submitting, setSubmitting] = useState(false);
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
  const [gatheringTime, setGatheringTime] = useState("19:30");
  const [gatheringLocation, setGatheringLocation] = useState("");
  const [gatheringNotes, setGatheringNotes] = useState("");

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
    setReportType(type);
    setSearchParams({ type });
  };

  // Generate recent Sundays for the date dropdown
  const recentSundays = useMemo(() => getRecentSundays(), []);

  useEffect(() => {
    if (recentSundays.length > 0) {
      setSelectedDate(formatDateString(recentSundays[0]));
    }
  }, [recentSundays]);

  // Fetch gardens and members when user is authenticated
  const fetchData = () => {
    if (!authenticated) return;
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
    fetchData();
  }, [authenticated]);

  // Handle selected garden members initialization
  useEffect(() => {
    if (selectedGarden && gardens[selectedGarden]) {
      const initialChecked = {};
      gardens[selectedGarden].forEach((member) => {
        initialChecked[member] = true; // Present by default
      });
      setCheckedMembers(initialChecked);
    } else {
      setCheckedMembers({});
    }
  }, [selectedGarden, gardens]);

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
    setSubmitting(true);

    if (reportType === "gathering") {
      const payload = {
        date: format(gatheringDate, "yyyy-MM-dd"),
        time: gatheringTime,
        location: gatheringLocation,
        notes: gatheringNotes,
        gardenName: selectedGarden,
        attendees,
        absentees,
      };

      submitGatheringReport(
        payload,
        () => {
          setSubmitting(false);
          openSnackbar(
            "success",
            `${selectedGarden} 정원 모임 보고가 완료되었습니다!`,
          );
          setGatheringNotes("");
          setGatheringLocation("");
          // Reset members state
          if (gardens[selectedGarden]) {
            const resetChecked = {};
            gardens[selectedGarden].forEach((member) => {
              resetChecked[member] = true;
            });
            setCheckedMembers(resetChecked);
          }
        },
        (errMsg) => {
          setSubmitting(false);
          openSnackbar(
            "error",
            errMsg || "정원 모임 보고 제출에 실패했습니다.",
          );
        },
      );
    } else {
      const payload = {
        date: selectedDate,
        gardenName: selectedGarden,
        attendees,
        absentees,
        absenceReasons,
      };

      submitAttendanceReport(
        payload,
        () => {
          setSubmitting(false);
          openSnackbar(
            "success",
            `${selectedGarden} 출석 보고가 완료되었습니다!`,
          );
          setAbsenceReasons({});
          // Reset members state
          if (gardens[selectedGarden]) {
            const resetChecked = {};
            gardens[selectedGarden].forEach((member) => {
              resetChecked[member] = true;
            });
            setCheckedMembers(resetChecked);
          }
        },
        (errMsg) => {
          setSubmitting(false);
          openSnackbar("error", errMsg || "출석 보고 제출에 실패했습니다.");
        },
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
          {!authenticated ? (
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
                  정원 보고는 온교회 등록 정원지기 및 목회자만 작성하실 수
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
                                  setSelectedGarden(e.target.value)
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
                        <Grid
                          size={{ xs: 12, sm: 6 }}
                          sx={{ display: "flex", flexDirection: "column" }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: "#666", mb: 0.5, fontWeight: 600 }}
                          >
                            모임 날짜
                          </Typography>
                          <ButtonDatePicker
                            value={gatheringDate}
                            onChange={setGatheringDate}
                            sx={{ width: "100%" }}
                          />
                        </Grid>

                        {/* Gathering Time */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="모임 시간"
                            type="time"
                            value={gatheringTime}
                            onChange={(e) => setGatheringTime(e.target.value)}
                            slotProps={{ inputLabel: { shrink: true } }}
                          />
                        </Grid>

                        {/* Gathering Location */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            required
                            label="모임 장소"
                            placeholder="예: 정원지기 가정, 카페, 교회 등"
                            value={gatheringLocation}
                            onChange={(e) =>
                              setGatheringLocation(e.target.value)
                            }
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

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
                                onClick={() => handleToggleMember(member)}
                                sx={{
                                  p: 1.5,
                                  cursor: "pointer",
                                  borderRadius: "8px",
                                  border: isChecked
                                    ? "1.2px solid #fdba74"
                                    : "1px solid #e0e0e0",
                                  backgroundColor: isChecked
                                    ? "#fff7ed"
                                    : "#fafafa",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    borderColor: isChecked
                                      ? "#ea580c"
                                      : "#bdbdbd",
                                    backgroundColor: isChecked
                                      ? "#ffedd5"
                                      : "#eeeeee",
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
                      disabled={submitting || membersList.length === 0}
                      onClick={handleFormSubmit}
                      startIcon={
                        submitting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SendIcon />
                        )
                      }
                      sx={{
                        backgroundColor: "#ea580c",
                        "&:hover": { backgroundColor: "#c2410c" },
                        borderRadius: "28px",
                        px: 6,
                        py: 1.8,
                        fontWeight: 700,
                        fontSize: "1.05em",
                        boxShadow: "0 4px 14px 0 rgba(234, 88, 12, 0.3)",
                      }}
                    >
                      {submitting ? "제출 중..." : "정원 모임 보고 제출하기"}
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
                                  setSelectedGarden(e.target.value)
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
                                onClick={() => handleToggleMember(member)}
                                sx={{
                                  p: 1.5,
                                  cursor: "pointer",
                                  borderRadius: "8px",
                                  border: isChecked
                                    ? "1.2px solid #fca5a5"
                                    : "1px solid #e0e0e0",
                                  backgroundColor: isChecked
                                    ? "#fef2f2"
                                    : "#fafafa",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    borderColor: isChecked
                                      ? "#dc2626"
                                      : "#bdbdbd",
                                    backgroundColor: isChecked
                                      ? "#fee2e2"
                                      : "#eeeeee",
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
                      disabled={submitting || membersList.length === 0}
                      onClick={handleFormSubmit}
                      startIcon={
                        submitting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SendIcon />
                        )
                      }
                      sx={{
                        backgroundColor: "#dc2626",
                        "&:hover": { backgroundColor: "#b91c1c" },
                        borderRadius: "28px",
                        px: 6,
                        py: 1.8,
                        fontWeight: 700,
                        fontSize: "1.05em",
                        boxShadow: "0 4px 14px 0 rgba(220, 38, 38, 0.3)",
                      }}
                    >
                      {submitting ? "제출 중..." : "주일 출석 보고 제출하기"}
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
            color: reportType === "gathering" ? "#ea580c" : "#dc2626",
          }}
        >
          {reportType === "gathering"
            ? "정원 모임 보고 제출 확인"
            : "출석 보고 제출 확인"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            작성하신 내용을 최종 제출하시겠습니까? 구글 스프레드시트의 해당 주차
            시트에 실시간 기록됩니다.
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
                  {gatheringTime}
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
            startIcon={<CheckCircleOutlineIcon />}
            sx={{
              backgroundColor:
                reportType === "gathering" ? "#ea580c" : "#dc2626",
              "&:hover": {
                backgroundColor:
                  reportType === "gathering" ? "#c2410c" : "#b91c1c",
              },
              borderRadius: "20px",
              px: 3,
              fontWeight: 600,
            }}
          >
            제출 완료
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SmallGroupReport;
