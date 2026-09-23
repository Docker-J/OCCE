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
  Checkbox,
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
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

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
    status: "IN_PROGRESS",
    notes: "",
  });

  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedMembersToEnroll, setSelectedMembersToEnroll] = useState([]);
  const [enrollTargetCohortId, setEnrollTargetCohortId] = useState("");
  const [enrollStatus, setEnrollStatus] = useState("IN_PROGRESS");

  // Checkbox selection in Course-wide overview for batch enrollment
  const [selectedMemberIdsForBatch, setSelectedMemberIdsForBatch] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  // Collapsible panels state: course (Panel 1), cohort (Panel 2), member (Panel 3)
  const [isCourseCollapsed, setIsCourseCollapsed] = useState(false);
  const [isCohortCollapsed, setIsCohortCollapsed] = useState(false);
  const [isMemberCollapsed, setIsMemberCollapsed] = useState(false);

  const isMaximized = isCourseCollapsed && isCohortCollapsed && !isMemberCollapsed;

  const toggleMaximize = () => {
    if (isMaximized) {
      setIsCourseCollapsed(false);
      setIsCohortCollapsed(false);
    } else {
      setIsCourseCollapsed(true);
      setIsCohortCollapsed(true);
      setIsMemberCollapsed(false);
    }
  };

  const handleCollapseMember = () => {
    setIsMemberCollapsed(true);
    if (isCourseCollapsed && isCohortCollapsed) {
      setIsCourseCollapsed(false);
      setIsCohortCollapsed(false);
    }
  };

  // Set of member IDs who have already completed or are currently in progress in this course (across all cohorts)
  const enrolledOrCompletedMemberIds = useMemo(() => {
    const set = new Set();
    courseAllMembers.forEach((m) => {
      if (m.enrollmentId || m.courseStatus) {
        set.add(String(m.memberId));
        set.add(Number(m.memberId));
      }
    });
    // Safety net: include current cohort members as well
    cohortMembers.forEach((m) => {
      if (m.memberId) {
        set.add(String(m.memberId));
        set.add(Number(m.memberId));
      }
    });
    return set;
  }, [courseAllMembers, cohortMembers]);

  // Available active members for enrollment autocomplete
  // Any member who has taken/is taking ANY cohort of this course is strictly excluded
  const candidateMembers = useMemo(() => {
    const preselectedIds = new Set(
      selectedMembersToEnroll.map((m) => String(m.id || m.memberId))
    );
    return users.filter((u) => {
      if (u.status === "REMOVED") return false;
      const uidStr = String(u.id);
      if (preselectedIds.has(uidStr)) return true;
      // 기수가 달라도 이미 해당 코스를 수강/이수한 교인은 수강 대상에서 완전히 제외
      if (enrolledOrCompletedMemberIds.has(uidStr) || enrolledOrCompletedMemberIds.has(Number(u.id))) {
        return false;
      }
      return true;
    });
  }, [users, enrolledOrCompletedMemberIds, selectedMembersToEnroll]);

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
    if (e && e.preventDefault) e.preventDefault();
    if (!courseForm.name.trim() || submitting) return;
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
        status: cohort.status || "IN_PROGRESS",
        notes: cohort.notes || "",
      });
    } else {
      setCohortForm({
        termName: `${(cohorts.length || 0) + 1}기`,
        instructor: "",
        status: "IN_PROGRESS",
        notes: "",
      });
    }
    setCohortModalOpen(true);
  };

  const handleSubmitCohort = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedCourse?.id || !cohortForm.termName.trim() || submitting) return;
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
      await deleteCohort(selectedCourse.id, cohort.id);
      setFeedback({ type: "success", message: `'${cohort.termName}' 기수가 삭제되었습니다.` });
      fetchCohortsList(selectedCourse.id);
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.message || err.message });
    }
  };

  // ================= Enrollment Handlers =================
  const handleOpenEnrollModal = (preselected = null) => {
    if (selectedCourse?.id) {
      fetchCourseAllMembersList(selectedCourse.id);
    }
    if (preselected) {
      const items = Array.isArray(preselected) ? preselected : [preselected];
      const resolved = items.map((item) => {
        const memberId = item.id || item.memberId;
        const found = users.find((u) => u.id === memberId);
        return (
          found || {
            id: memberId,
            memberId: memberId,
            name: item.name,
            nameEn: item.nameEn,
            department: item.department,
            gardenName: item.gardenName,
          }
        );
      });
      setSelectedMembersToEnroll(resolved);
    } else {
      setSelectedMembersToEnroll([]);
    }
    setEnrollTargetCohortId(selectedCohort?.id || (cohorts.length > 0 ? cohorts[0].id : ""));
    setEnrollStatus("IN_PROGRESS");
    setEnrollModalOpen(true);
  };

  const handleEnrollMember = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetCohortId = enrollTargetCohortId || selectedCohort?.id;
    if (!targetCohortId || selectedMembersToEnroll.length === 0 || submitting) return;

    const memberIds = selectedMembersToEnroll.map((m) => m.id || m.memberId);
    setSubmitting(true);
    try {
      const res = await enrollCohortMember(targetCohortId, {
        memberIds,
        memberId: memberIds[0],
        status: enrollStatus,
        completionDate: enrollStatus === "COMPLETED" ? new Date().toISOString().split("T")[0] : null,
      });
      setFeedback({
        type: "success",
        message: res.message || `${memberIds.length}명의 수강생이 등록되었습니다.`,
      });
      setEnrollModalOpen(false);
      setSelectedMembersToEnroll([]);
      setSelectedMemberIdsForBatch([]);
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

  // Eligible members for new enrollment (미수강 교인)
  const eligibleVisibleMembers = useMemo(() => {
    return filteredCourseAllMembers.filter((m) => !m.enrollmentId && !m.courseStatus);
  }, [filteredCourseAllMembers]);

  // Toggle single member checkbox in Course-wide overview
  const handleToggleBatchMember = (memberId) => {
    setSelectedMemberIdsForBatch((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  // Toggle select all visible eligible (미수강) members in Course-wide overview
  const handleToggleSelectAllBatch = () => {
    const eligibleIds = eligibleVisibleMembers.map((m) => m.memberId);
    if (eligibleIds.length === 0) return;
    const allSelected = eligibleIds.every((id) => selectedMemberIdsForBatch.includes(id));
    if (allSelected) {
      setSelectedMemberIdsForBatch((prev) => prev.filter((id) => !eligibleIds.includes(id)));
    } else {
      setSelectedMemberIdsForBatch((prev) => Array.from(new Set([...prev, ...eligibleIds])));
    }
  };

  // Open modal with all currently checked members
  const handleOpenBatchEnrollModal = () => {
    const selectedMembers = courseAllMembers.filter((m) =>
      selectedMemberIdsForBatch.includes(m.memberId)
    );
    handleOpenEnrollModal(selectedMembers);
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
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2.5,
          width: "100%",
          alignItems: "stretch",
        }}
      >
        {/* 1. 과정 (Course) 컬럼 */}
        {isCourseCollapsed ? (
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.06)",
              minHeight: { xs: "auto", md: "520px" },
              width: { xs: "100%", md: "52px" },
              flexShrink: 0,
              display: "flex",
              flexDirection: { xs: "row", md: "column" },
              alignItems: "center",
              justifyContent: { xs: "space-between", md: "flex-start" },
              py: { xs: 1.2, md: 2 },
              px: { xs: 2, md: 0 },
              backgroundColor: "#f8fafc",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#f1f5f9",
                borderColor: "#cbd5e1",
              },
            }}
            onClick={() => setIsCourseCollapsed(false)}
          >
            {/* Desktop vertical layout */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                height: "100%",
                width: "100%",
              }}
            >
              <Tooltip title="과정 목록 펼치기">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCourseCollapsed(false);
                  }}
                  sx={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    "&:hover": { backgroundColor: "#f8fafc" },
                  }}
                >
                  <KeyboardDoubleArrowRightIcon sx={{ fontSize: 16, color: "#475569" }} />
                </IconButton>
              </Tooltip>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexGrow: 1,
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    color: "#334155",
                    letterSpacing: "1px",
                    whiteSpace: "nowrap",
                  }}
                >
                  📖 {selectedCourse ? selectedCourse.name : "교육·양육 과정"}
                </Typography>
              </Box>
            </Box>

            {/* Mobile horizontal layout */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#334155" }}>
                📖 {selectedCourse ? selectedCourse.name : "교육·양육 과정"} (터치하여 펼치기)
              </Typography>
              <KeyboardDoubleArrowDownIcon sx={{ fontSize: 18, color: "#64748b" }} />
            </Box>
          </Card>
        ) : (
          <Box
            sx={{
              width: {
                xs: "100%",
                md: isMemberCollapsed ? "auto" : isCohortCollapsed ? "340px" : "300px",
              },
              flex: {
                xs: "1 1 auto",
                md: isMemberCollapsed ? 1 : "none",
              },
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
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
                  p: 2,
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b", fontSize: "0.95rem" }}>
                  📖 교육·양육 과정
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenCourseModal("create")}
                    sx={{
                      backgroundColor: "#FF6B00",
                      "&:hover": { backgroundColor: "#ea580c" },
                      borderRadius: "8px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      boxShadow: "none",
                      px: 1.2,
                      py: 0.4,
                    }}
                  >
                    새 과정
                  </Button>
                  <Tooltip title="과정 패널 접기">
                    <IconButton
                      size="small"
                      onClick={() => setIsCourseCollapsed(true)}
                      sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        p: 0.5,
                        "&:hover": { backgroundColor: "#f1f5f9" },
                      }}
                    >
                      <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 16, color: "#64748b" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
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
          </Box>
        )}

        {/* 2. 기수 (Cohorts) 컬럼 */}
        {isCohortCollapsed ? (
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.06)",
              minHeight: { xs: "auto", md: "520px" },
              width: { xs: "100%", md: "52px" },
              flexShrink: 0,
              display: "flex",
              flexDirection: { xs: "row", md: "column" },
              alignItems: "center",
              justifyContent: { xs: "space-between", md: "flex-start" },
              py: { xs: 1.2, md: 2 },
              px: { xs: 2, md: 0 },
              backgroundColor: "#f8fafc",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#f1f5f9",
                borderColor: "#cbd5e1",
              },
            }}
            onClick={() => setIsCohortCollapsed(false)}
          >
            {/* Desktop vertical layout */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                height: "100%",
                width: "100%",
              }}
            >
              <Tooltip title="기수 목록 펼치기">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCohortCollapsed(false);
                  }}
                  sx={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    "&:hover": { backgroundColor: "#f8fafc" },
                  }}
                >
                  <KeyboardDoubleArrowRightIcon sx={{ fontSize: 16, color: "#475569" }} />
                </IconButton>
              </Tooltip>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexGrow: 1,
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    color: "#334155",
                    letterSpacing: "1px",
                    whiteSpace: "nowrap",
                  }}
                >
                  🗓️ {selectedCohort ? selectedCohort.termName : "개설 기수 목록"}
                </Typography>
              </Box>
            </Box>

            {/* Mobile horizontal layout */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#334155" }}>
                🗓️ {selectedCohort ? selectedCohort.termName : "개설 기수 목록"} (터치하여 펼치기)
              </Typography>
              <KeyboardDoubleArrowDownIcon sx={{ fontSize: 18, color: "#64748b" }} />
            </Box>
          </Card>
        ) : (
          <Box
            sx={{
              width: {
                xs: "100%",
                md: isMemberCollapsed ? "auto" : isCourseCollapsed ? "340px" : "300px",
              },
              flex: {
                xs: "1 1 auto",
                md: isMemberCollapsed ? 1 : "none",
              },
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
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
                  p: 2,
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b", fontSize: "0.95rem" }}>
                  🗓️ 개설 기수 목록
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  {selectedCourse && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenCohortModal("create")}
                      sx={{
                        backgroundColor: "#FF6B00",
                        "&:hover": { backgroundColor: "#ea580c" },
                        borderRadius: "8px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        boxShadow: "none",
                        px: 1.2,
                        py: 0.4,
                      }}
                    >
                      기수 개설
                    </Button>
                  )}
                  <Tooltip title="기수 패널 접기">
                    <IconButton
                      size="small"
                      onClick={() => setIsCohortCollapsed(true)}
                      sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        p: 0.5,
                        "&:hover": { backgroundColor: "#f1f5f9" },
                      }}
                    >
                      <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 16, color: "#64748b" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
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
          </Box>
        )}

        {/* 3. 수강생 명단 및 코스 전체 현황 (Column 3) */}
        {isMemberCollapsed ? (
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.06)",
              minHeight: { xs: "auto", md: "520px" },
              width: { xs: "100%", md: "52px" },
              flexShrink: 0,
              display: "flex",
              flexDirection: { xs: "row", md: "column" },
              alignItems: "center",
              justifyContent: { xs: "space-between", md: "flex-start" },
              py: { xs: 1.2, md: 2 },
              px: { xs: 2, md: 0 },
              backgroundColor: "#f8fafc",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#f1f5f9",
                borderColor: "#cbd5e1",
              },
            }}
            onClick={() => setIsMemberCollapsed(false)}
          >
            {/* Desktop vertical layout */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                height: "100%",
                width: "100%",
              }}
            >
              <Tooltip title="명단 패널 펼치기">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMemberCollapsed(false);
                  }}
                  sx={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    "&:hover": { backgroundColor: "#f8fafc" },
                  }}
                >
                  <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 16, color: "#475569" }} />
                </IconButton>
              </Tooltip>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexGrow: 1,
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    color: "#334155",
                    letterSpacing: "1px",
                    whiteSpace: "nowrap",
                  }}
                >
                  👥 수강생 명단 및 코스전체 현황
                </Typography>
              </Box>
            </Box>

            {/* Mobile horizontal layout */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#334155" }}>
                👥 수강생 명단 및 코스전체 현황 (터치하여 펼치기)
              </Typography>
              <KeyboardDoubleArrowDownIcon sx={{ fontSize: 18, color: "#64748b" }} />
            </Box>
          </Card>
        ) : (
          <Box
            sx={{
              flex: "1 1 0",
              minWidth: 0,
              width: "100%",
              transition: "all 0.2s ease",
            }}
          >
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
                {/* 뷰 모드 토글: 기수별 명단 vs 코스 전체 현황 & 좌측 패널 접힘 시 상태 칩 */}
                <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
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

                  {/* 좌측 패널이 접혀 있을 때 현재 과정/기수 컨텍스트 뱃지 */}
                  {(isCourseCollapsed || isCohortCollapsed) && selectedCourse && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      {isCourseCollapsed && (
                        <Tooltip title="클릭하여 과정 패널 펼치기">
                          <Chip
                            size="small"
                            label={`과정: ${selectedCourse.name}`}
                            onClick={() => setIsCourseCollapsed(false)}
                            onDelete={() => setIsCourseCollapsed(false)}
                            deleteIcon={<KeyboardDoubleArrowRightIcon sx={{ fontSize: "14px !important" }} />}
                            sx={{
                              backgroundColor: "rgba(255, 107, 0, 0.08)",
                              color: "#ea580c",
                              fontWeight: 700,
                              fontSize: "0.74rem",
                              cursor: "pointer",
                              "& .MuiChip-deleteIcon": { color: "#ea580c" },
                            }}
                          />
                        </Tooltip>
                      )}
                      {isCohortCollapsed && selectedCohort && (
                        <Tooltip title="클릭하여 기수 패널 펼치기">
                          <Chip
                            size="small"
                            label={`기수: ${selectedCohort.termName}`}
                            onClick={() => setIsCohortCollapsed(false)}
                            onDelete={() => setIsCohortCollapsed(false)}
                            deleteIcon={<KeyboardDoubleArrowRightIcon sx={{ fontSize: "14px !important" }} />}
                            sx={{
                              backgroundColor: "rgba(37, 99, 235, 0.08)",
                              color: "#2563eb",
                              fontWeight: 700,
                              fontSize: "0.74rem",
                              cursor: "pointer",
                              "& .MuiChip-deleteIcon": { color: "#2563eb" },
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  )}
                </Box>

                {/* 우측: 액션 버튼 + 최대화/복원 버튼 + 명단 접기 버튼 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, my: "auto" }} />

                  {/* 명단 화면 최대화 / 원래대로 버튼 */}
                  <Tooltip title={isMaximized ? "좌측 패널 복원 (원래 크기로)" : "명단 화면 최대화 (좌측 패널 일괄 접기)"}>
                    <Button
                      size="small"
                      variant={isMaximized ? "contained" : "outlined"}
                      startIcon={isMaximized ? <FullscreenExitIcon /> : <FullscreenIcon />}
                      onClick={toggleMaximize}
                      sx={{
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        height: 32,
                        px: 1.2,
                        whiteSpace: "nowrap",
                        ...(isMaximized
                          ? {
                              backgroundColor: "#1e293b",
                              color: "#fff",
                              "&:hover": { backgroundColor: "#0f172a" },
                            }
                          : {
                              borderColor: "#cbd5e1",
                              color: "#475569",
                              "&:hover": { borderColor: "#94a3b8", backgroundColor: "#f8fafc" },
                            }),
                      }}
                    >
                      {isMaximized ? "원래 크기로" : "화면 최대화"}
                    </Button>
                  </Tooltip>

                  {/* 명단 패널 접기 버튼 */}
                  <Tooltip title="명단 패널 접기">
                    <IconButton
                      size="small"
                      onClick={handleCollapseMember}
                      sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        p: 0.6,
                        "&:hover": { backgroundColor: "#f1f5f9" },
                      }}
                    >
                      <KeyboardDoubleArrowRightIcon sx={{ fontSize: 16, color: "#64748b" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
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
                        <TableCell sx={{ fontWeight: 800, color: "#475569" }}>성명</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: "#475569" }}>부서 / 정원</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 800, color: "#475569" }}>
                          수강 상태
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
                            </TableCell>

                            <TableCell>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155" }}>
                                {member.department || "장년부"}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
                                {member.gardenName}
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

                  {/* 다중 선택 일괄 배정 바 */}
                  {selectedMemberIdsForBatch.length > 0 && (
                    <Box
                      sx={{
                        mb: 1.5,
                        p: 1.2,
                        px: 2,
                        borderRadius: "10px",
                        backgroundColor: "rgba(255, 107, 0, 0.08)",
                        border: "1px solid rgba(255, 107, 0, 0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#ea580c" }}>
                        선택된 교인: <strong>{selectedMemberIdsForBatch.length}명</strong>
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          onClick={() => setSelectedMemberIdsForBatch([])}
                          sx={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 700 }}
                        >
                          선택 해제
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<GroupAddIcon />}
                          onClick={handleOpenBatchEnrollModal}
                          disabled={cohorts.length === 0}
                          sx={{
                            backgroundColor: "#FF6B00",
                            "&:hover": { backgroundColor: "#ea580c" },
                            borderRadius: "8px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            boxShadow: "none",
                          }}
                        >
                          선택한 {selectedMemberIdsForBatch.length}명 일괄 기수 배정
                        </Button>
                      </Stack>
                    </Box>
                  )}

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
                          <TableCell padding="checkbox" sx={{ pl: 1, backgroundColor: "#f8fafc" }}>
                            <Tooltip
                              title={
                                eligibleVisibleMembers.length === 0
                                  ? "배정 가능한 미수강 교인이 없습니다"
                                  : "미수강 교인 전체 선택 / 해제"
                              }
                            >
                              <span>
                                <Checkbox
                                  size="small"
                                  disabled={eligibleVisibleMembers.length === 0}
                                  indeterminate={
                                    selectedMemberIdsForBatch.length > 0 &&
                                    !eligibleVisibleMembers.every((m) =>
                                      selectedMemberIdsForBatch.includes(m.memberId)
                                    )
                                  }
                                  checked={
                                    eligibleVisibleMembers.length > 0 &&
                                    eligibleVisibleMembers.every((m) =>
                                      selectedMemberIdsForBatch.includes(m.memberId)
                                    )
                                  }
                                  onChange={handleToggleSelectAllBatch}
                                  sx={{
                                    color: "#94a3b8",
                                    "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#FF6B00" },
                                  }}
                                />
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 800, color: "#475569" }}>성명</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: "#475569" }}>소속 (부서/정원)</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569" }}>
                            이수 현황
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569" }}>
                            기수 정보
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
                          const isNotEnrolled = !m.enrollmentId && !m.courseStatus;

                          return (
                            <TableRow
                              key={m.memberId}
                              sx={{
                                "&:hover": { backgroundColor: "#f8fafc" },
                                transition: "background-color 0.15s",
                              }}
                            >
                              <TableCell padding="checkbox" sx={{ pl: 1 }}>
                                <Tooltip
                                  title={
                                    isCompleted
                                      ? "이미 본 과정을 수료한 교인입니다"
                                      : isInProgress
                                      ? "현재 본 과정을 수강 중인 교인입니다"
                                      : isNotEnrolled
                                      ? "기수 배정 선택"
                                      : "이미 본 과정에 등록된 교인입니다"
                                  }
                                >
                                  <span>
                                    <Checkbox
                                      size="small"
                                      disabled={!isNotEnrolled}
                                      checked={selectedMemberIdsForBatch.includes(m.memberId)}
                                      onChange={() => handleToggleBatchMember(m.memberId)}
                                      sx={{
                                        color: "#cbd5e1",
                                        "&.Mui-checked": { color: "#FF6B00" },
                                      }}
                                    />
                                  </span>
                                </Tooltip>
                              </TableCell>
                              <TableCell sx={{ py: 1.2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                  {m.name}
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155" }}>
                                  {m.department || "장년부"}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
                                  {m.gardenName}
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
                                  <Typography
                                    variant="caption"
                                    sx={{ fontWeight: 700, color: "#16a34a" }}
                                  >
                                    {m.termName || "수료"}
                                  </Typography>
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
        </Box>
        )}
      </Box>

      {/* ================= MODAL: 과정 등록/수정 ================= */}
      <Dialog
        open={courseModalOpen}
        onClose={() => !submitting && setCourseModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            maxHeight: "90vh",
          },
        }}
      >
        <form
          onSubmit={handleSubmitCourse}
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            maxHeight: "90vh",
            overflow: "hidden",
          }}
        >
          <DialogTitle sx={{ fontWeight: 800, flexShrink: 0, px: 3, pt: 2.5, pb: 1.5 }}>
            {courseModalMode === "create" ? "새 교육과정 개설" : "교육과정 정보 수정"}
          </DialogTitle>
          <DialogContent dividers sx={{ py: 2.5, px: 3, overflowY: "auto", flex: "1 1 auto" }}>
            <Stack spacing={2.5}>
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
          <DialogActions sx={{ p: 2.5, pt: 1.5, flexShrink: 0 }}>
            <Button onClick={() => setCourseModalOpen(false)} disabled={submitting} sx={{ color: "#64748b" }}>
              취소
            </Button>
            <Button
              type="submit"
              onClick={handleSubmitCourse}
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
        PaperProps={{
          sx: {
            borderRadius: "16px",
            maxHeight: "90vh",
          },
        }}
      >
        <form
          onSubmit={handleSubmitCohort}
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            maxHeight: "90vh",
            overflow: "hidden",
          }}
        >
          <DialogTitle sx={{ fontWeight: 800, flexShrink: 0, px: 3, pt: 2.5, pb: 1.5 }}>
            {cohortModalMode === "create"
              ? `[${selectedCourse?.name}] 새 기수 개설`
              : "기수 정보 수정"}
          </DialogTitle>
          <DialogContent dividers sx={{ py: 2.5, px: 3, overflowY: "auto", flex: "1 1 auto" }}>
            <Stack spacing={2.5}>
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
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1.5, flexShrink: 0 }}>
            <Button onClick={() => setCohortModalOpen(false)} disabled={submitting} sx={{ color: "#64748b" }}>
              취소
            </Button>
            <Button
              type="submit"
              onClick={handleSubmitCohort}
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
        PaperProps={{
          sx: {
            borderRadius: "16px",
            maxHeight: "90vh",
          },
        }}
      >
        <form
          onSubmit={handleEnrollMember}
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            maxHeight: "90vh",
            overflow: "hidden",
          }}
        >
          <DialogTitle sx={{ fontWeight: 800, flexShrink: 0, px: 3, pt: 2.5, pb: 1.5 }}>
            {selectedCourse
              ? `[${selectedCourse.name}] 수강생 기수 등록${
                  selectedMembersToEnroll.length > 0
                    ? ` (${selectedMembersToEnroll.length}명 선택됨)`
                    : ""
                }`
              : "수강생 기수 등록"}
          </DialogTitle>
          <DialogContent dividers sx={{ py: 2.5, px: 3, overflowY: "auto", flex: "1 1 auto" }}>
            <Stack spacing={2.5}>
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
                        {c.termName}
                        {c.instructor ? ` (인도자: ${c.instructor})` : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Box>
                <Autocomplete
                  multiple
                  options={candidateMembers}
                  getOptionLabel={(opt) =>
                    `${opt.name} · ${opt.department || "장년부"} (${opt.gardenName || "미배정"})`
                  }
                  isOptionEqualToValue={(opt, val) =>
                    String(opt.id || opt.memberId) === String(val?.id || val?.memberId)
                  }
                  value={selectedMembersToEnroll}
                  onChange={(e, val) => setSelectedMembersToEnroll(val)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          key={key}
                          size="small"
                          label={`${option.name} (${option.gardenName || option.department || "미배정"})`}
                          {...tagProps}
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            backgroundColor: "rgba(255, 107, 0, 0.1)",
                            color: "#ea580c",
                          }}
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="수강 대상 교인 (여러 명 다중 선택 가능)"
                      size="small"
                      placeholder={
                        selectedMembersToEnroll.length === 0
                          ? "등록할 교인 이름을 입력하여 추가하세요"
                          : "교인을 계속 추가 검색할 수 있습니다"
                      }
                    />
                  )}
                />
                <Box sx={{ mt: 0.8, px: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    * 본 코스를 이미 수강했거나 수강 중인 교인은 기수와 관계없이 수강 대상에서 완전히 제외됩니다.
                  </Typography>
                </Box>
              </Box>

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
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1.5, flexShrink: 0 }}>
            <Button onClick={() => setEnrollModalOpen(false)} disabled={submitting} sx={{ color: "#64748b" }}>
              취소
            </Button>
            <Button
              type="submit"
              onClick={handleEnrollMember}
              variant="contained"
              disabled={
                submitting ||
                selectedMembersToEnroll.length === 0 ||
                cohorts.length === 0 ||
                (!enrollTargetCohortId && !selectedCohort?.id)
              }
              sx={{ backgroundColor: "#FF6B00", "&:hover": { backgroundColor: "#ea580c" }, borderRadius: "8px" }}
            >
              {submitting
                ? "등록 중..."
                : selectedMembersToEnroll.length > 0
                ? `${selectedMembersToEnroll.length}명 등록하기`
                : "등록하기"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CourseManagementDashboard;
