/**
 * @file CourseManagementDashboard.jsx
 * @description 양육 및 교육과정(코스) - 기수(Cohorts) 2계층 분리 관리 대시보드
 */

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
  Stack,
  Alert,
  Autocomplete,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SchoolIcon from "@mui/icons-material/School";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseCohorts,
  getCourseAllMembers,
  createCohort,
  updateCohort,
  deleteCohort,
  getCohortMembers,
  enrollCohortMember,
  updateEnrollmentStatus,
  completeAllCohortMembers,
  removeCohortMember,
} from "../../../api/admin";

const CATEGORY_OPTIONS = ["새가족", "제자도", "사역훈련", "성경연구", "기도/영성", "기타"];

const COHORT_STATUS_META = {
  OPEN: { label: "모집중", color: "#0284c7", bg: "rgba(2, 132, 199, 0.1)" },
  IN_PROGRESS: { label: "진행중", color: "#ea580c", bg: "rgba(234, 88, 12, 0.1)" },
  COMPLETED: { label: "종강/수료", color: "#16a34a", bg: "rgba(22, 163, 74, 0.1)" },
};

const CourseManagementDashboard = ({ users = [] }) => {
  // Course state
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Cohort state
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [loadingCohorts, setLoadingCohorts] = useState(false);

  // Cohort Members state
  const [cohortMembers, setCohortMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // View mode for the 3rd column: 'cohort' (기수별 명단) | 'course_all' (코스 전체 현황)
  const [viewMode, setViewMode] = useState("cohort");

  // Course-wide members state
  const [courseAllMembers, setCourseAllMembers] = useState([]);
  const [loadingAllMembers, setLoadingAllMembers] = useState(false);
  const [courseStatusFilter, setCourseStatusFilter] = useState("ALL"); // 'ALL' | 'COMPLETED' | 'IN_PROGRESS' | 'NOT_ENROLLED'
  const [courseSearchTerm, setCourseSearchTerm] = useState("");

  // Modals
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState("create"); // 'create' | 'edit'
  const [courseForm, setCourseForm] = useState({ name: "", category: "제자도", description: "" });

  const [cohortModalOpen, setCohortModalOpen] = useState(false);
  const [cohortModalMode, setCohortModalMode] = useState("create"); // 'create' | 'edit'
  const [cohortForm, setCohortForm] = useState({
    termName: "",
    instructor: "",
    startDate: "",
    endDate: "",
    status: "IN_PROGRESS",
    notes: "",
  });

  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedMemberToEnroll, setSelectedMemberToEnroll] = useState(null);
  const [enrollTargetCohortId, setEnrollTargetCohortId] = useState("");
  const [enrollStatus, setEnrollStatus] = useState("IN_PROGRESS");
  const [enrollCompletionDate, setEnrollCompletionDate] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  // Available active members for enrollment autocomplete
  const candidateMembers = useMemo(() => {
    return users.filter((u) => u.status !== "REMOVED");
  }, [users]);

  // Load courses
  const fetchCoursesList = async (autoSelectId = null) => {
    setLoadingCourses(true);
    try {
      const data = await getCourses();
      const list = data.courses || [];
      setCourses(list);
      if (list.length > 0) {
        const found = autoSelectId ? list.find((c) => c.id === autoSelectId) : null;
        setSelectedCourse(found || selectedCourse || list[0]);
      } else {
        setSelectedCourse(null);
        setCohorts([]);
        setSelectedCohort(null);
      }
    } catch (err) {
      setFeedback({ type: "error", message: "과정 목록을 불러오지 못했습니다: " + err.message });
    } finally {
      setLoadingCourses(false);
    }
  };

  // Load cohorts for selected course
  const fetchCohortsList = async (courseId, autoSelectCohortId = null) => {
    if (!courseId) return;
    setLoadingCohorts(true);
    try {
      const data = await getCourseCohorts(courseId);
      const list = data.cohorts || [];
      setCohorts(list);
      if (list.length > 0) {
        const found = autoSelectCohortId ? list.find((c) => c.id === autoSelectCohortId) : null;
        setSelectedCohort(found || selectedCohort || list[0]);
      } else {
        setSelectedCohort(null);
        setCohortMembers([]);
      }
    } catch (err) {
      setFeedback({ type: "error", message: "기수 목록을 불러오지 못했습니다: " + err.message });
    } finally {
      setLoadingCohorts(false);
    }
  };

  // Load members for selected cohort
  const fetchCohortMembersList = async (cohortId) => {
    if (!cohortId) return;
    setLoadingMembers(true);
    try {
      const data = await getCohortMembers(cohortId);
      setCohortMembers(data.members || []);
    } catch (err) {
      setFeedback({ type: "error", message: "수강생 명단을 불러오지 못했습니다: " + err.message });
    } finally {
      setLoadingMembers(false);
    }
  };

  // Load all church members' status for the selected course
  const fetchCourseAllMembersList = async (courseId) => {
    if (!courseId) {
      setCourseAllMembers([]);
      return;
    }
    setLoadingAllMembers(true);
    try {
      const data = await getCourseAllMembers(courseId);
      setCourseAllMembers(data.members || []);
    } catch (err) {
      console.error("fetchCourseAllMembersList error:", err);
    } finally {
      setLoadingAllMembers(false);
    }
  };

  useEffect(() => {
    fetchCoursesList();
  }, []);

  useEffect(() => {
    if (selectedCourse?.id) {
      fetchCohortsList(selectedCourse.id);
      fetchCourseAllMembersList(selectedCourse.id);
    } else {
      setCohorts([]);
      setSelectedCohort(null);
      setCohortMembers([]);
      setCourseAllMembers([]);
    }
  }, [selectedCourse?.id]);

  useEffect(() => {
    if (selectedCohort?.id) {
      fetchCohortMembersList(selectedCohort.id);
    }
  }, [selectedCohort?.id]);

  // Course-wide member overview statistics
  const courseOverviewStats = useMemo(() => {
    let completed = 0;
    let inProgress = 0;
    let notEnrolled = 0;

    courseAllMembers.forEach((m) => {
      if (m.courseStatus === "COMPLETED") completed++;
      else if (m.courseStatus === "IN_PROGRESS") inProgress++;
      else notEnrolled++;
    });

    return {
      total: courseAllMembers.length,
      completed,
      inProgress,
      notEnrolled,
    };
  }, [courseAllMembers]);

  // Filtered course-wide members
  const filteredCourseAllMembers = useMemo(() => {
    let list = courseAllMembers;

    if (courseStatusFilter === "COMPLETED") {
      list = list.filter((m) => m.courseStatus === "COMPLETED");
    } else if (courseStatusFilter === "IN_PROGRESS") {
      list = list.filter((m) => m.courseStatus === "IN_PROGRESS");
    } else if (courseStatusFilter === "NOT_ENROLLED") {
      list = list.filter((m) => !m.courseStatus);
    }

    if (courseSearchTerm.trim()) {
      const q = courseSearchTerm.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.nameEn?.toLowerCase().includes(q) ||
          m.department?.toLowerCase().includes(q) ||
          m.gardenName?.toLowerCase().includes(q) ||
          m.termName?.toLowerCase().includes(q) ||
          m.phone?.includes(q)
      );
    }

    return list;
  }, [courseAllMembers, courseStatusFilter, courseSearchTerm]);

  // Auto clear feedback after 4s
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // ================= Course Handlers =================
  const handleOpenCourseModal = (mode = "create", course = null) => {
    setCourseModalMode(mode);
    if (mode === "edit" && course) {
      setCourseForm({
        name: course.name,
        category: course.category || "제자도",
        description: course.description || "",
      });
    } else {
      setCourseForm({ name: "", category: "제자도", description: "" });
    }
    setCourseModalOpen(true);
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.name.trim()) return;
    setSubmitting(true);
    try {
      if (courseModalMode === "create") {
        const res = await createCourse(courseForm);
        setFeedback({ type: "success", message: "과정이 성공적으로 등록되었습니다." });
        setCourseModalOpen(false);
        fetchCoursesList(res.course?.id);
      } else {
        await updateCourse(selectedCourse.id, courseForm);
        setFeedback({ type: "success", message: "과정 정보가 수정되었습니다." });
        setCourseModalOpen(false);
        fetchCoursesList(selectedCourse.id);
      }
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.message || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (course) => {
    if (
      !window.confirm(
        `'${course.name}' 과정을 삭제하시겠습니까?\n소속된 모든 기수 및 수강생 기록도 함께 삭제됩니다.`
      )
    ) {
      return;
    }
    try {
      await deleteCourse(course.id);
      setFeedback({ type: "success", message: `'${course.name}' 과정이 삭제되었습니다.` });
      fetchCoursesList();
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.message || err.message });
    }
  };

  // ================= Cohort Handlers =================
  const handleOpenCohortModal = (mode = "create", cohort = null) => {
    setCohortModalMode(mode);
    if (mode === "edit" && cohort) {
      setCohortForm({
        termName: cohort.termName,
        instructor: cohort.instructor || "",
        startDate: cohort.startDate || "",
        endDate: cohort.endDate || "",
        status: cohort.status || "IN_PROGRESS",
        notes: cohort.notes || "",
      });
    } else {
      setCohortForm({
        termName: `${(cohorts.length || 0) + 1}기`,
        instructor: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        status: "IN_PROGRESS",
        notes: "",
      });
    }
    setCohortModalOpen(true);
  };

  const handleSubmitCohort = async (e) => {
    e.preventDefault();
    if (!selectedCourse?.id || !cohortForm.termName.trim()) return;
    setSubmitting(true);
    try {
      if (cohortModalMode === "create") {
        const res = await createCohort(selectedCourse.id, cohortForm);
        setFeedback({ type: "success", message: "새 기수가 개설되었습니다." });
        setCohortModalOpen(false);
        fetchCohortsList(selectedCourse.id, res.cohort?.id);
      } else {
        await updateCohort(selectedCohort.id, cohortForm);
        setFeedback({ type: "success", message: "기수 정보가 수정되었습니다." });
        setCohortModalOpen(false);
        fetchCohortsList(selectedCourse.id, selectedCohort.id);
      }
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.message || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCohort = async (cohort) => {
    if (
      !window.confirm(
        `'${cohort.termName}' 기수를 삭제하시겠습니까?\n등록된 수강생 명단도 함께 삭제됩니다.`
      )
    ) {
      return;
    }
    try {
      await deleteCohort(cohort.id);
      setFeedback({ type: "success", message: `'${cohort.termName}' 기수가 삭제되었습니다.` });
      fetchCohortsList(selectedCourse.id);
      fetchCourseAllMembersList(selectedCourse.id);
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.message || err.message });
    }
  };

  // ================= Enrollment Handlers =================
  const handleOpenEnrollModal = (preselectedMember = null) => {
    if (preselectedMember) {
      const memberId = preselectedMember.id || preselectedMember.memberId;
      const found = users.find((u) => u.id === memberId);
      setSelectedMemberToEnroll(
        found || {
          id: memberId,
          name: preselectedMember.name,
          nameEn: preselectedMember.nameEn,
          department: preselectedMember.department,
          gardenName: preselectedMember.gardenName,
        }
      );
    } else {
      setSelectedMemberToEnroll(null);
    }
    setEnrollTargetCohortId(selectedCohort?.id || (cohorts.length > 0 ? cohorts[0].id : ""));
    setEnrollStatus("IN_PROGRESS");
    setEnrollCompletionDate("");
    setEnrollModalOpen(true);
  };

  const handleEnrollMember = async (e) => {
    e.preventDefault();
    const targetCohortId = enrollTargetCohortId || selectedCohort?.id;
    const memberId = selectedMemberToEnroll?.id || selectedMemberToEnroll?.memberId;
    if (!targetCohortId || !memberId) return;
    setSubmitting(true);
    try {
      await enrollCohortMember(targetCohortId, {
        memberId,
        status: enrollStatus,
        completionDate: enrollStatus === "COMPLETED" ? enrollCompletionDate : null,
      });
      setFeedback({
        type: "success",
        message: `${selectedMemberToEnroll.name} 성도님이 수강생으로 등록되었습니다.`,
      });
      setEnrollModalOpen(false);
      if (selectedCohort?.id) {
        fetchCohortMembersList(selectedCohort.id);
      }
      fetchCohortsList(selectedCourse.id, selectedCohort?.id);
      fetchCourseAllMembersList(selectedCourse.id);
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.message || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleMemberStatus = async (member) => {
    const nextStatus = member.status === "COMPLETED" ? "IN_PROGRESS" : "COMPLETED";
    try {
      await updateEnrollmentStatus(selectedCohort.id, member.memberId, {
        status: nextStatus,
        completionDate: nextStatus === "COMPLETED" ? new Date().toISOString().split("T")[0] : null,
      });
      fetchCohortMembersList(selectedCohort.id);
      fetchCohortsList(selectedCourse.id, selectedCohort.id);
      fetchCourseAllMembersList(selectedCourse.id);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const handleCompleteAll = async () => {
    const inProgressCount = cohortMembers.filter((m) => m.status === "IN_PROGRESS").length;
    if (inProgressCount === 0) {
      alert("진행 중인 수강생이 없습니다.");
      return;
    }
    if (
      !window.confirm(
        `현재 진행 중인 ${inProgressCount}명의 수강생 전원을 오늘 날짜로 일괄 수료 처리하시겠습니까?`
      )
    ) {
      return;
    }
    try {
      const res = await completeAllCohortMembers(
        selectedCohort.id,
        new Date().toISOString().split("T")[0]
      );
      setFeedback({ type: "success", message: res.message });
      fetchCohortMembersList(selectedCohort.id);
      fetchCohortsList(selectedCourse.id, selectedCohort.id);
      fetchCourseAllMembersList(selectedCourse.id);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const handleRemoveMember = async (member) => {
    if (
      !window.confirm(
        `'${member.name}' 성도님의 본 기수(${selectedCohort.termName}) 수강 등록을 취소하시겠습니까?`
      )
    ) {
      return;
    }
    try {
      await removeCohortMember(selectedCohort.id, member.memberId);
      setFeedback({ type: "success", message: `${member.name} 성도님의 등록이 취소되었습니다.` });
      fetchCohortMembersList(selectedCohort.id);
      fetchCohortsList(selectedCourse.id, selectedCohort.id);
      fetchCourseAllMembersList(selectedCourse.id);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  return (
    <Box sx={{ width: "100%", pb: 8 }}>
      {/* 피드백 알림 */}
      {feedback && (
        <Alert
          severity={feedback.type}
          sx={{ mb: 3, borderRadius: "12px", fontWeight: 600 }}
          onClose={() => setFeedback(null)}
        >
          {feedback.message}
        </Alert>
      )}

      {/* 상단 3계층 레이아웃: [과정 리스트] | [기수 선택 및 관리] | [수강생 명단] */}
      <Grid container spacing={3}>
        {/* 1. 과정 (Course) 컬럼 */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.06)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                p: 2.2,
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fafafa",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b" }}>
                📖 교육·양육 과정
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleOpenCourseModal("create")}
                sx={{
                  backgroundColor: "#FF6B00",
                  "&:hover": { backgroundColor: "#ea580c" },
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  boxShadow: "none",
                  px: 1.5,
                }}
              >
                새 과정
              </Button>
            </Box>

            <Box sx={{ p: 1.5, flexGrow: 1, overflowY: "auto", maxHeight: "680px" }}>
              {loadingCourses ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress size={28} sx={{ color: "#FF6B00" }} />
                </Box>
              ) : courses.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6, color: "#94a3b8" }}>
                  <SchoolIcon sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
                  <Typography variant="body2">등록된 교육과정이 없습니다.</Typography>
                </Box>
              ) : (
                <Stack spacing={1}>
                  {courses.map((course) => {
                    const isSelected = selectedCourse?.id === course.id;
                    return (
                      <Box
                        key={course.id}
                        onClick={() => setSelectedCourse(course)}
                        sx={{
                          p: 1.8,
                          borderRadius: "12px",
                          cursor: "pointer",
                          backgroundColor: isSelected ? "rgba(255, 107, 0, 0.08)" : "#fff",
                          border: isSelected ? "2px solid #FF6B00" : "1px solid #f1f5f9",
                          transition: "all 0.15s ease",
                          "&:hover": {
                            backgroundColor: isSelected
                              ? "rgba(255, 107, 0, 0.12)"
                              : "#f8fafc",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Box sx={{ pr: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.5 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 800,
                                  color: isSelected ? "#ea580c" : "#1e293b",
                                  fontSize: "0.92rem",
                                }}
                              >
                                {course.name}
                              </Typography>
                              {course.category && (
                                <Chip
                                  size="small"
                                  label={course.category}
                                  sx={{
                                    height: 18,
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                    backgroundColor: "#f1f5f9",
                                    color: "#64748b",
                                  }}
                                />
                              )}
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{ color: "#64748b", display: "block" }}
                            >
                              개설: <strong>{course.cohortCount || 0}개 기수</strong> · 수료:{" "}
                              <strong>{course.completedCount || 0}명</strong>
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Tooltip title="과정 수정">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenCourseModal("edit", course);
                                }}
                              >
                                <EditOutlinedIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="과정 삭제">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCourse(course);
                                }}
                              >
                                <DeleteOutlineIcon sx={{ fontSize: 16, color: "#ef4444" }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Card>
        </Grid>

        {/* 2. 기수 (Cohorts) 컬럼 */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.06)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                p: 2.2,
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fafafa",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b" }}>
                🗓️ 개설 기수 목록
              </Typography>
              {selectedCourse && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenCohortModal("create")}
                  sx={{
                    borderColor: "#ea580c",
                    color: "#ea580c",
                    "&:hover": { borderColor: "#c2410c", backgroundColor: "rgba(234, 88, 12, 0.05)" },
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    px: 1.5,
                  }}
                >
                  기수 개설
                </Button>
              )}
            </Box>

            <Box sx={{ p: 1.5, flexGrow: 1, overflowY: "auto", maxHeight: "680px" }}>
              {!selectedCourse ? (
                <Box sx={{ textAlign: "center", py: 6, color: "#94a3b8" }}>
                  <Typography variant="body2">좌측에서 과정을 선택해 주세요.</Typography>
                </Box>
              ) : loadingCohorts ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress size={28} sx={{ color: "#ea580c" }} />
                </Box>
              ) : cohorts.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6, color: "#94a3b8" }}>
                  <Typography variant="body2">
                    개설된 기수가 없습니다.
                    <br />
                    상단의 <strong>[기수 개설]</strong> 버튼을 눌러주세요.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.2}>
                  {cohorts.map((cohort) => {
                    const isSelected = selectedCohort?.id === cohort.id;
                    const statusMeta =
                      COHORT_STATUS_META[cohort.status] || COHORT_STATUS_META.IN_PROGRESS;
                    return (
                      <Box
                        key={cohort.id}
                        onClick={() => setSelectedCohort(cohort)}
                        sx={{
                          p: 1.8,
                          borderRadius: "12px",
                          cursor: "pointer",
                          backgroundColor: isSelected ? "rgba(37, 99, 235, 0.06)" : "#fff",
                          border: isSelected ? "2px solid #2563eb" : "1px solid #f1f5f9",
                          transition: "all 0.15s ease",
                          "&:hover": {
                            backgroundColor: isSelected
                              ? "rgba(37, 99, 235, 0.1)"
                              : "#f8fafc",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 0.8,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 800,
                                color: isSelected ? "#1d4ed8" : "#1e293b",
                                fontSize: "0.95rem",
                              }}
                            >
                              {cohort.termName}
                            </Typography>
                            <Chip
                              size="small"
                              label={statusMeta.label}
                              sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                backgroundColor: statusMeta.bg,
                                color: statusMeta.color,
                              }}
                            />
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Tooltip title="기수 수정">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenCohortModal("edit", cohort);
                                }}
                              >
                                <EditOutlinedIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="기수 삭제">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCohort(cohort);
                                }}
                              >
                                <DeleteOutlineIcon sx={{ fontSize: 16, color: "#ef4444" }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                          인도자: <strong>{cohort.instructor || "미지정"}</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                          수강: <strong>{cohort.totalEnrolled || 0}명</strong> (진행중{" "}
                          {cohort.inProgressCount || 0} · 수료 {cohort.completedCount || 0})
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Card>
        </Grid>

        {/* 3. 수강생 명단 및 코스 전체 현황 (Column 3) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.06)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* 상단 탭 / 토글 바 */}
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fafafa",
                flexWrap: "wrap",
                gap: 1.5,
              }}
            >
              {/* 뷰 모드 토글: 기수별 명단 vs 코스 전체 현황 */}
              <Box
                sx={{
                  display: "flex",
                  p: "3px",
                  bgcolor: "#f1f5f9",
                  borderRadius: "10px",
                  gap: 0.5,
                }}
              >
                <Button
                  size="small"
                  onClick={() => setViewMode("cohort")}
                  sx={{
                    borderRadius: "8px",
                    px: 1.6,
                    py: 0.5,
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    backgroundColor: viewMode === "cohort" ? "#fff" : "transparent",
                    color: viewMode === "cohort" ? "#1e293b" : "#64748b",
                    boxShadow: viewMode === "cohort" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    "&:hover": { backgroundColor: viewMode === "cohort" ? "#fff" : "rgba(255,255,255,0.6)" },
                  }}
                >
                  기수별 수강생 {selectedCohort ? `(${selectedCohort.termName})` : ""}
                </Button>
                <Button
                  size="small"
                  onClick={() => setViewMode("course_all")}
                  sx={{
                    borderRadius: "8px",
                    px: 1.6,
                    py: 0.5,
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    backgroundColor: viewMode === "course_all" ? "#fff" : "transparent",
                    color: viewMode === "course_all" ? "#ea580c" : "#64748b",
                    boxShadow: viewMode === "course_all" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    "&:hover": { backgroundColor: viewMode === "course_all" ? "#fff" : "rgba(255,255,255,0.6)" },
                  }}
                >
                  코스 전체 교인 현황
                </Button>
              </Box>

              {/* 기수별 뷰 액션 버튼 */}
              {viewMode === "cohort" && selectedCohort && (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DoneAllIcon />}
                    onClick={handleCompleteAll}
                    disabled={cohortMembers.length === 0 || cohortMembers.every((m) => m.status === "COMPLETED")}
                    sx={{
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      borderColor: "#16a34a",
                      color: "#16a34a",
                      "&:hover": { borderColor: "#15803d", backgroundColor: "rgba(22, 163, 74, 0.05)" },
                    }}
                  >
                    전원 일괄수료
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<GroupAddIcon />}
                    onClick={() => handleOpenEnrollModal()}
                    sx={{
                      backgroundColor: "#FF6B00",
                      "&:hover": { backgroundColor: "#ea580c" },
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      boxShadow: "none",
                    }}
                  >
                    수강생 추가
                  </Button>
                </Stack>
              )}

              {/* 코스 전체 뷰 액션 */}
              {viewMode === "course_all" && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                    총 교인 {courseOverviewStats.total}명
                  </Typography>
                  <Tooltip title="새로고침">
                    <IconButton
                      size="small"
                      onClick={() => selectedCourse?.id && fetchCourseAllMembersList(selectedCourse.id)}
                      disabled={loadingAllMembers}
                    >
                      <RefreshIcon sx={{ fontSize: 18, color: "#64748b" }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
            </Box>

            {/* 본문 영역 */}
            <Box sx={{ p: 2, flexGrow: 1, overflowY: "auto", maxHeight: "680px" }}>
              {viewMode === "cohort" ? (
                /* ================= VIEW 1: 기수별 명단 ================= */
                !selectedCohort ? (
                  <Box sx={{ textAlign: "center", py: 10, color: "#94a3b8" }}>
                    <SchoolIcon sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
                    <Typography variant="body2">
                      기수를 선택하면 수강생 명단이 나타납니다.
                      <br />
                      또는 상단의 <strong>[코스 전체 교인 현황]</strong> 탭을 클릭하여 전체 이수 현황을 확인하세요.
                    </Typography>
                  </Box>
                ) : loadingMembers ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                    <CircularProgress size={32} sx={{ color: "#FF6B00" }} />
                  </Box>
                ) : cohortMembers.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 10, color: "#94a3b8" }}>
                    <GroupAddIcon sx={{ fontSize: 44, opacity: 0.3, mb: 1 }} />
                    <Typography variant="body2">
                      본 기수에 등록된 수강생이 없습니다.
                      <br />
                      우측 상단의 <strong>[수강생 추가]</strong> 버튼을 통해 교인을 등록하세요.
                    </Typography>
                  </Box>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                        <TableCell sx={{ fontWeight: 800, color: "#475569" }}>성명 / 영문명</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: "#475569" }}>부서 / 정원</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: "#475569" }}>연락처</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 800, color: "#475569" }}>
                          수강 상태
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 800, color: "#475569" }}>
                          수료일자
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 800, color: "#475569" }}>
                          관리
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cohortMembers.map((member) => {
                        const isCompleted = member.status === "COMPLETED";
                        return (
                          <TableRow
                            key={member.enrollmentId}
                            sx={{
                              "&:hover": { backgroundColor: "#f8fafc" },
                              transition: "background-color 0.15s",
                            }}
                          >
                            <TableCell sx={{ py: 1.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                {member.name}
                              </Typography>
                              {member.nameEn && (
                                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                                  {member.nameEn}
                                </Typography>
                              )}
                            </TableCell>

                            <TableCell>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155" }}>
                                {member.department || "장년부"}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
                                {member.gardenName}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography variant="caption" sx={{ color: "#475569" }}>
                                {member.phone || "-"}
                              </Typography>
                            </TableCell>

                            <TableCell align="center">
                              <Tooltip title={isCompleted ? "클릭하여 수강중으로 변경" : "클릭하여 수료완료 처리"}>
                                <Chip
                                  size="small"
                                  icon={
                                    isCompleted ? (
                                      <CheckCircleIcon sx={{ fontSize: 14 }} />
                                    ) : (
                                      <HourglassEmptyIcon sx={{ fontSize: 14 }} />
                                    )
                                  }
                                  label={isCompleted ? "수료완료" : "수강중"}
                                  onClick={() => handleToggleMemberStatus(member)}
                                  sx={{
                                    cursor: "pointer",
                                    fontWeight: 800,
                                    fontSize: "0.72rem",
                                    backgroundColor: isCompleted
                                      ? "rgba(22, 163, 74, 0.1)"
                                      : "rgba(234, 88, 12, 0.1)",
                                    color: isCompleted ? "#16a34a" : "#ea580c",
                                    "&:hover": {
                                      backgroundColor: isCompleted
                                        ? "rgba(22, 163, 74, 0.2)"
                                        : "rgba(234, 88, 12, 0.2)",
                                    },
                                  }}
                                />
                              </Tooltip>
                            </TableCell>

                            <TableCell align="center">
                              <Typography variant="caption" sx={{ color: isCompleted ? "#16a34a" : "#94a3b8", fontWeight: 600 }}>
                                {member.completionDate || "-"}
                              </Typography>
                            </TableCell>

                            <TableCell align="center">
                              <Tooltip title="수강생 등록 취소">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveMember(member)}
                                  sx={{ color: "#94a3b8", "&:hover": { color: "#ef4444" } }}
                                >
                                  <PersonRemoveIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )
              ) : (
                /* ================= VIEW 2: 코스 전체 교인 현황 ================= */
                <Box>
                  {/* 필터 칩 및 검색 바 */}
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "stretch", sm: "center" },
                      justifyContent: "space-between",
                      gap: 1.5,
                    }}
                  >
                    {/* 수료/수강중/미수강 필터 */}
                    <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap", gap: 0.8 }}>
                      <Chip
                        label={`전체 ${courseOverviewStats.total}`}
                        onClick={() => setCourseStatusFilter("ALL")}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          backgroundColor: courseStatusFilter === "ALL" ? "#1e293b" : "#f1f5f9",
                          color: courseStatusFilter === "ALL" ? "#fff" : "#475569",
                          "&:hover": { backgroundColor: courseStatusFilter === "ALL" ? "#0f172a" : "#e2e8f0" },
                        }}
                      />
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                        label={`수료 ${courseOverviewStats.completed}`}
                        onClick={() => setCourseStatusFilter("COMPLETED")}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          backgroundColor:
                            courseStatusFilter === "COMPLETED" ? "#16a34a" : "rgba(22, 163, 74, 0.08)",
                          color: courseStatusFilter === "COMPLETED" ? "#fff" : "#16a34a",
                          "&:hover": {
                            backgroundColor:
                              courseStatusFilter === "COMPLETED" ? "#15803d" : "rgba(22, 163, 74, 0.16)",
                          },
                        }}
                      />
                      <Chip
                        icon={<HourglassEmptyIcon sx={{ fontSize: 14 }} />}
                        label={`수강중 ${courseOverviewStats.inProgress}`}
                        onClick={() => setCourseStatusFilter("IN_PROGRESS")}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          backgroundColor:
                            courseStatusFilter === "IN_PROGRESS" ? "#ea580c" : "rgba(234, 88, 12, 0.08)",
                          color: courseStatusFilter === "IN_PROGRESS" ? "#fff" : "#ea580c",
                          "&:hover": {
                            backgroundColor:
                              courseStatusFilter === "IN_PROGRESS" ? "#c2410c" : "rgba(234, 88, 12, 0.16)",
                          },
                        }}
                      />
                      <Chip
                        label={`미수강 ${courseOverviewStats.notEnrolled}`}
                        onClick={() => setCourseStatusFilter("NOT_ENROLLED")}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          backgroundColor: courseStatusFilter === "NOT_ENROLLED" ? "#64748b" : "#f8fafc",
                          color: courseStatusFilter === "NOT_ENROLLED" ? "#fff" : "#64748b",
                          border: courseStatusFilter === "NOT_ENROLLED" ? "none" : "1px solid #e2e8f0",
                          "&:hover": {
                            backgroundColor: courseStatusFilter === "NOT_ENROLLED" ? "#475569" : "#f1f5f9",
                          },
                        }}
                      />
                    </Stack>

                    {/* 교인 검색 */}
                    <TextField
                      size="small"
                      placeholder="교인명, 정원, 기수 검색..."
                      value={courseSearchTerm}
                      onChange={(e) => setCourseSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        minWidth: { xs: "100%", sm: 200 },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          height: 32,
                          fontSize: "0.8rem",
                          backgroundColor: "#fff",
                        },
                      }}
                    />
                  </Box>

                  {/* 교인 코스 현황 테이블 */}
                  {loadingAllMembers ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                      <CircularProgress size={32} sx={{ color: "#FF6B00" }} />
                    </Box>
                  ) : filteredCourseAllMembers.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 8, color: "#94a3b8" }}>
                      <Typography variant="body2">검색 및 필터 조건에 해당하는 교인이 없습니다.</Typography>
                    </Box>
                  ) : (
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                          <TableCell sx={{ fontWeight: 800, color: "#475569" }}>성명 / 영문명</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: "#475569" }}>소속 (부서/정원)</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: "#475569" }}>연락처</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569" }}>
                            이수 현황
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569" }}>
                            기수 / 이수 정보
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569" }}>
                            관리
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredCourseAllMembers.map((m) => {
                          const isCompleted = m.courseStatus === "COMPLETED";
                          const isInProgress = m.courseStatus === "IN_PROGRESS";
                          const isNotEnrolled = !m.courseStatus;

                          return (
                            <TableRow
                              key={m.memberId}
                              sx={{
                                "&:hover": { backgroundColor: "#f8fafc" },
                                transition: "background-color 0.15s",
                              }}
                            >
                              <TableCell sx={{ py: 1.2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                  {m.name}
                                </Typography>
                                {m.nameEn && (
                                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                                    {m.nameEn}
                                  </Typography>
                                )}
                              </TableCell>

                              <TableCell>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155" }}>
                                  {m.department || "장년부"}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
                                  {m.gardenName}
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <Typography variant="caption" sx={{ color: "#475569" }}>
                                  {m.phone || "-"}
                                </Typography>
                              </TableCell>

                              <TableCell align="center">
                                {isCompleted ? (
                                  <Chip
                                    size="small"
                                    icon={<CheckCircleIcon sx={{ fontSize: 13 }} />}
                                    label="수료완료"
                                    sx={{
                                      fontWeight: 800,
                                      fontSize: "0.72rem",
                                      backgroundColor: "rgba(22, 163, 74, 0.1)",
                                      color: "#16a34a",
                                    }}
                                  />
                                ) : isInProgress ? (
                                  <Chip
                                    size="small"
                                    icon={<HourglassEmptyIcon sx={{ fontSize: 13 }} />}
                                    label="수강중"
                                    sx={{
                                      fontWeight: 800,
                                      fontSize: "0.72rem",
                                      backgroundColor: "rgba(234, 88, 12, 0.1)",
                                      color: "#ea580c",
                                    }}
                                  />
                                ) : (
                                  <Chip
                                    size="small"
                                    label="미수강"
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: "0.72rem",
                                      backgroundColor: "#f1f5f9",
                                      color: "#64748b",
                                    }}
                                  />
                                )}
                              </TableCell>

                              <TableCell align="center">
                                {isCompleted ? (
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{ fontWeight: 700, color: "#16a34a", display: "block" }}
                                    >
                                      {m.termName || "이수"}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                                      {m.completionDate || "날짜 미기입"}
                                    </Typography>
                                  </Box>
                                ) : isInProgress ? (
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{ fontWeight: 700, color: "#ea580c", display: "block" }}
                                    >
                                      {m.termName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                                      {m.instructor ? `인도: ${m.instructor}` : "진행중"}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Typography variant="caption" sx={{ color: "#cbd5e1" }}>
                                    -
                                  </Typography>
                                )}
                              </TableCell>

                              <TableCell align="center">
                                {isNotEnrolled ? (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<GroupAddIcon sx={{ fontSize: 14 }} />}
                                    onClick={() => handleOpenEnrollModal(m)}
                                    disabled={cohorts.length === 0}
                                    sx={{
                                      borderRadius: "6px",
                                      fontSize: "0.7rem",
                                      py: 0.3,
                                      px: 1,
                                      fontWeight: 700,
                                      borderColor: "#FF6B00",
                                      color: "#FF6B00",
                                      "&:hover": {
                                        borderColor: "#ea580c",
                                        backgroundColor: "rgba(255, 107, 0, 0.05)",
                                      },
                                    }}
                                  >
                                    기수 배정
                                  </Button>
                                ) : (
                                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                                    등록됨
                                  </Typography>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* ================= MODAL: 과정 등록/수정 ================= */}
      <Dialog
        open={courseModalOpen}
        onClose={() => !submitting && setCourseModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <form onSubmit={handleSubmitCourse}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {courseModalMode === "create" ? "새 교육과정 개설" : "교육과정 정보 수정"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                label="과정명 (Course Name)"
                size="small"
                fullWidth
                required
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                placeholder="예: 새가족 성경공부, 제자훈련"
              />
              <FormControl size="small" fullWidth>
                <InputLabel>분류 (Category)</InputLabel>
                <Select
                  value={courseForm.category}
                  label="분류 (Category)"
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="과정 소개 및 안내 (선택)"
                size="small"
                fullWidth
                multiline
                rows={3}
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1 }}>
            <Button onClick={() => setCourseModalOpen(false)} disabled={submitting} sx={{ color: "#64748b" }}>
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || !courseForm.name.trim()}
              sx={{ backgroundColor: "#FF6B00", "&:hover": { backgroundColor: "#ea580c" }, borderRadius: "8px" }}
            >
              {submitting ? "저장 중..." : "확인"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ================= MODAL: 기수 개설/수정 ================= */}
      <Dialog
        open={cohortModalOpen}
        onClose={() => !submitting && setCohortModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <form onSubmit={handleSubmitCohort}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {cohortModalMode === "create"
              ? `[${selectedCourse?.name}] 새 기수 개설`
              : "기수 정보 수정"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                label="기수명"
                size="small"
                fullWidth
                required
                value={cohortForm.termName}
                onChange={(e) => setCohortForm({ ...cohortForm, termName: e.target.value })}
                placeholder="예: 1기, 2기, 2024년 가을학기"
              />
              <TextField
                label="담당 교역자 / 인도자"
                size="small"
                fullWidth
                value={cohortForm.instructor}
                onChange={(e) => setCohortForm({ ...cohortForm, instructor: e.target.value })}
                placeholder="예: OOO 목사"
              />
              <TextField
                label="개강일"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={cohortForm.startDate}
                onChange={(e) => setCohortForm({ ...cohortForm, startDate: e.target.value })}
              />
              <TextField
                label="종강/수료일"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={cohortForm.endDate}
                onChange={(e) => setCohortForm({ ...cohortForm, endDate: e.target.value })}
              />
              <FormControl size="small" fullWidth>
                <InputLabel>기수 운영 상태</InputLabel>
                <Select
                  value={cohortForm.status}
                  label="기수 운영 상태"
                  onChange={(e) => setCohortForm({ ...cohortForm, status: e.target.value })}
                >
                  <MenuItem value="OPEN">모집중 (OPEN)</MenuItem>
                  <MenuItem value="IN_PROGRESS">진행중 (IN_PROGRESS)</MenuItem>
                  <MenuItem value="COMPLETED">종강/수료완료 (COMPLETED)</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1 }}>
            <Button onClick={() => setCohortModalOpen(false)} disabled={submitting} sx={{ color: "#64748b" }}>
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || !cohortForm.termName.trim()}
              sx={{ backgroundColor: "#FF6B00", "&:hover": { backgroundColor: "#ea580c" }, borderRadius: "8px" }}
            >
              {submitting ? "저장 중..." : "확인"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ================= MODAL: 수강생 등록 ================= */}
      <Dialog
        open={enrollModalOpen}
        onClose={() => !submitting && setEnrollModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <form onSubmit={handleEnrollMember}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {selectedCourse ? `[${selectedCourse.name}] 수강생 기수 등록` : "수강생 기수 등록"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              {cohorts.length === 0 ? (
                <Alert severity="warning" sx={{ borderRadius: "8px" }}>
                  본 과정에 개설된 기수가 없습니다. 기수 관리에서 먼저 기수를 개설해주세요.
                </Alert>
              ) : (
                <FormControl size="small" fullWidth required>
                  <InputLabel>등록 대상 기수</InputLabel>
                  <Select
                    value={enrollTargetCohortId || (selectedCohort ? selectedCohort.id : cohorts[0]?.id || "")}
                    label="등록 대상 기수"
                    onChange={(e) => setEnrollTargetCohortId(e.target.value)}
                  >
                    {cohorts.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.termName} {c.instructor ? `(인도자: ${c.instructor})` : ""} ·{" "}
                        {COHORT_STATUS_META[c.status]?.label || c.status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Autocomplete
                options={candidateMembers}
                getOptionLabel={(opt) =>
                  `${opt.name} ${opt.nameEn ? `(${opt.nameEn})` : ""} · ${opt.department || "장년부"} (${opt.gardenName || "미배정"})`
                }
                isOptionEqualToValue={(opt, val) =>
                  (opt.id || opt.memberId) === (val?.id || val?.memberId)
                }
                value={selectedMemberToEnroll}
                onChange={(e, val) => setSelectedMemberToEnroll(val)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="교인 검색 (성명 또는 영문명)"
                    size="small"
                    required
                    placeholder="등록할 교인 이름을 입력하세요"
                  />
                )}
              />

              <FormControl size="small" fullWidth>
                <InputLabel>수강 상태</InputLabel>
                <Select
                  value={enrollStatus}
                  label="수강 상태"
                  onChange={(e) => setEnrollStatus(e.target.value)}
                >
                  <MenuItem value="IN_PROGRESS">수강중 (현재 훈련 진행중)</MenuItem>
                  <MenuItem value="COMPLETED">수료완료 (이미 이수 완료)</MenuItem>
                </Select>
              </FormControl>

              {enrollStatus === "COMPLETED" && (
                <TextField
                  label="수료 일자"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={enrollCompletionDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setEnrollCompletionDate(e.target.value)}
                />
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1 }}>
            <Button onClick={() => setEnrollModalOpen(false)} disabled={submitting} sx={{ color: "#64748b" }}>
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                submitting ||
                !selectedMemberToEnroll ||
                cohorts.length === 0 ||
                (!enrollTargetCohortId && !selectedCohort?.id)
              }
              sx={{ backgroundColor: "#FF6B00", "&:hover": { backgroundColor: "#ea580c" }, borderRadius: "8px" }}
            >
              {submitting ? "등록 중..." : "등록하기"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CourseManagementDashboard;
