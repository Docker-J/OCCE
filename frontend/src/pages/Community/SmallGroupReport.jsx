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
import { getGardensAndMembers, submitAttendanceReport } from "../../api/attendance.js";

const titleBackground = {
  background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
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
    const { default: SignInModal } = await import("../../components/User/SignInModal");
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
    if (!selectedDate) {
      openSnackbar("error", "보고 주일을 선택해 주세요.");
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    setConfirmOpen(false);
    setSubmitting(true);

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
        openSnackbar("success", `${selectedGarden} 출석 보고가 완료되었습니다!`);
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
      }
    );
  };

  return (
    <>
      <title>정원 출석 보고 - OCCE</title>
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
            정원 출석 보고
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
            주일 정원 모임 후, 출석 및 기도제목을 나누어주세요.
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container" style={{ maxWidth: "800px", width: "100%", margin: "0 auto", padding: "24px 16px" }}>
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
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#1b5e20" }}>
                  로그인이 필요한 서비스입니다
                </Typography>
                <Typography variant="body1" sx={{ color: "#555", mb: 4, lineHeight: 1.6 }}>
                  정원 출석 보고는 온교회 등록 정원지기 및 목회자만 작성하실 수 있습니다.
                  <br />
                  가입은 교인 등록 명부에 등록된 성명과 전화번호 정보가 일치해야 가능합니다.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleLoginClick}
                  startIcon={<LoginIcon />}
                  sx={{
                    backgroundColor: "#2e7d32",
                    "&:hover": { backgroundColor: "#1b5e20" },
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
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#2e7d32", mb: 2 }} />
              <Typography variant="body1" sx={{ color: "#666" }}>
                정원 및 멤버 정보를 불러오는 중입니다...
              </Typography>
            </Box>
          ) : error ? (
            // 3. Error View
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "16px",
                border: "1px solid rgba(239, 83, 80, 0.3)",
                p: 4,
                textAlign: "center",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: "#d32f2f", fontWeight: 700, mb: 2 }}>
                  오류가 발생했습니다
                </Typography>
                <Typography variant="body1" sx={{ color: "#555", mb: 3 }}>
                  {error}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={fetchData}
                  sx={{
                    color: "#2e7d32",
                    borderColor: "#2e7d32",
                    "&:hover": { borderColor: "#1b5e20", backgroundColor: "rgba(46, 125, 50, 0.04)" },
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
                        <InputLabel id="select-date-label">보고주일</InputLabel>
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
                          <InputLabel id="select-garden-label">정원 선택</InputLabel>
                          <Select
                            labelId="select-garden-label"
                            value={selectedGarden}
                            label="정원 선택"
                            onChange={(e) => setSelectedGarden(e.target.value)}
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
                          <Typography variant="body1" sx={{ fontWeight: 600, color: "#1b5e20" }}>
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
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1b5e20" }}>
                      출석체크
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Paper
                        variant="outlined"
                        sx={{ px: 1.5, py: 0.5, backgroundColor: "#e8f5e9", borderColor: "#c8e6c9", borderRadius: "12px" }}
                      >
                        <Typography variant="caption" sx={{ color: "#2e7d32", fontWeight: 700 }}>
                          출석 {attendees.length}명
                        </Typography>
                      </Paper>
                      <Paper
                        variant="outlined"
                        sx={{ px: 1.5, py: 0.5, backgroundColor: "#ffeede", borderColor: "#ffccbc", borderRadius: "12px" }}
                      >
                        <Typography variant="caption" sx={{ color: "#d32f2f", fontWeight: 700 }}>
                          결석 {absentees.length}명
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                    💡 기본적으로 모든 정원 가족이 <b>출석</b>으로 되어있습니다. 결석하신 분만 체크를 해제해 주세요.
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  {membersList.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body1" sx={{ color: "#888", fontStyle: "italic" }}>
                        정원에 속한 멤버가 존재하지 않습니다.
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={1}>
                      {membersList.map((member) => {
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
                                border: isChecked ? "1px solid #a5d6a7" : "1px solid #e0e0e0",
                                backgroundColor: isChecked ? "#f1f8e9" : "#fafafa",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderColor: isChecked ? "#81c784" : "#bdbdbd",
                                  backgroundColor: isChecked ? "#e8f5e9" : "#eeeeee",
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
                                  color: isChecked ? "#2e7d32" : "#9e9e9e",
                                  textDecoration: isChecked ? "none" : "line-through",
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
                                    color: "#2e7d32",
                                  },
                                  p: 0,
                                }}
                              />
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
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
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#c62828", mb: 2 }}>
                      결석 사유 입력 (선택사항)
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                      결석한 교인별로 사유(예: 개인 여행, 감기 몸살, 출장 등)를 적어주시면 구글 시트에 메모로 기록됩니다.
                    </Typography>
                    <Grid container spacing={2}>
                      {absentees.map((name) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={name} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, minWidth: "70px", color: "#d32f2f" }}>
                            {name}
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="예: 개인 여행, 감기 몸살 등"
                            value={absenceReasons[name] || ""}
                            onChange={(e) => handleAbsenceReasonChange(name, e.target.value)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  disabled={submitting || membersList.length === 0}
                  onClick={handleFormSubmit}
                  startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  sx={{
                    backgroundColor: "#2e7d32",
                    "&:hover": { backgroundColor: "#1b5e20" },
                    borderRadius: "28px",
                    px: 6,
                    py: 1.8,
                    fontWeight: 700,
                    fontSize: "1.05em",
                    boxShadow: "0 4px 14px 0 rgba(46, 125, 50, 0.3)",
                  }}
                >
                  {submitting ? "제출 중..." : "출석 보고 제출하기"}
                </Button>
              </Box>
            </Box>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} borderRadius="16px">
        <DialogTitle sx={{ fontWeight: 700, color: "#1b5e20" }}>
          출석 보고 제출 확인
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            작성하신 내용을 최종 제출하시겠습니까? 구글 스프레드시트 탭(<b>{selectedDate}</b>)에 실시간 기록됩니다.
          </DialogContentText>
          <Box sx={{ backgroundColor: "#f9f9f9", p: 2, borderRadius: "8px" }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <b>보고 정원:</b> {selectedGarden}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <b>보고 주일:</b> {selectedDate}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <b>출석 인원:</b> {attendees.length}명 ({attendees.join(", ")})
            </Typography>
            {absentees.length > 0 && (
              <Typography variant="body2" sx={{ color: "#d32f2f", mb: 0.5 }}>
                <b>결석 인원:</b> {absentees.length}명 ({absentees.join(", ")})
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: "#555", fontWeight: 600 }}>
            취소
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            startIcon={<CheckCircleOutlineIcon />}
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
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
