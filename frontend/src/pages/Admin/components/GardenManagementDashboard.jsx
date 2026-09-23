/**
 * @file GardenManagementDashboard.jsx
 * @description 온교회 정원(목장) 마스터 목록 관리 대시보드 (탭 전용 뷰)
 * - 4대 정원 요약 지표 카드 (전체 정원, 운영 중 정원, 배정 세대, 미배정 세대)
 * - 정원 목록 조회, 검색 및 필터링
 * - 팝업 모달 기반 신규 정원 등록 및 정보 수정 (스크롤 위치 무관 즉각 반응)
 * - 소속 세대 및 교인 명단 즉시 확인 (테이블 칩 클릭 시 전용 명단 모달 제공)
 * - '미배정' 기본 정원 보호 및 소속 가구 안전 삭제 가드
 */

import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  CircularProgress,
  Tooltip,
  FormControlLabel,
  Switch,
  Alert,
  Autocomplete,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

import ForestIcon from "@mui/icons-material/Forest";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import BlockIcon from "@mui/icons-material/Block";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import YardOutlinedIcon from "@mui/icons-material/YardOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {
  getAdminGardensWithStats,
  createGarden,
  updateGarden,
  deleteGarden,
  reorderGardens,
} from "../../../api/admin";

const GardenManagementDashboard = ({ users = [], onGardensUpdated }) => {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 드래그 앤 드롭 및 순서 재배치 상태
  const [draggedGardenId, setDraggedGardenId] = useState(null);
  const [dragOverGardenId, setDragOverGardenId] = useState(null);
  const [isReordering, setIsReordering] = useState(false);

  // 편집/추가 모달 상태 (기존 상단 인라인에서 팝업 모달로 전환하여 즉각 반응 보장)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGarden, setEditingGarden] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    orderNum: 0,
    leaderMemberId: null,
    isActive: true,
  });

  // 소속 세대 및 교인 명단 확인 모달
  const [viewingGarden, setViewingGarden] = useState(null);

  // 삭제 확인 다이얼로그 대상
  const [gardenToDelete, setGardenToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // 실시간 users 데이터 기반 정원별 교인 매핑
  const gardenMembersMap = useMemo(() => {
    const map = {};
    (users || []).forEach((u) => {
      if (u.status === "REMOVED") return;
      const idKey = u.gardenId;
      const nameKey = u.gardenName;
      if (idKey) {
        if (!map[idKey]) map[idKey] = [];
        map[idKey].push(u);
      }
      if (nameKey && nameKey !== idKey) {
        if (!map[nameKey]) map[nameKey] = [];
        map[nameKey].push(u);
      }
    });
    return map;
  }, [users]);

  // 특정 정원의 소속 교인 목록 추출
  const getGardenMembers = (g) => {
    if (!g) return [];
    const byId = g.id ? gardenMembersMap[g.id] : null;
    if (byId && byId.length > 0) return byId;
    const byName = g.name ? gardenMembersMap[g.name] : null;
    return byName || [];
  };

  // 특정 정원의 소속 세대 목록 추출
  const getGardenHouseholds = (g) => {
    const members = getGardenMembers(g);
    const householdMap = new Map();
    members.forEach((m) => {
      const hId = m.householdId || `temp-${m.id}`;
      if (!householdMap.has(hId)) {
        householdMap.set(hId, {
          id: hId,
          householdName: m.householdName || `${m.name} 성도 가정`,
          headName: m.headName || m.name,
          address: m.address,
          city: m.city,
          province: m.province,
          members: [m],
        });
      } else {
        householdMap.get(hId).members.push(m);
      }
    });
    return Array.from(householdMap.values());
  };

  // 정원지기(리더) 후보 목록 (활동 중인 교인)
  const candidateLeaders = useMemo(() => {
    return (users || [])
      .filter((m) => m.status !== "REMOVED")
      .map((m) => ({
        id: m.id,
        name: m.name,
        phone: m.phone,
        position: m.position,
        label: `${m.name}${m.position ? ` (${m.position})` : ""} · ${m.phone || "연락처 미등록"}`,
      }));
  }, [users]);

  // 정원 통계 목록 불러오기
  const fetchGardensList = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await getAdminGardensWithStats();
      setGardens(res.gardens || []);
    } catch (err) {
      console.error("Failed to fetch gardens with stats:", err);
      setErrorMessage(err?.response?.data?.message || "정원 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGardensList();
  }, []);

  // 4대 통계 지표 계산 (users 실시간 데이터와 백엔드 통계 병합)
  const metrics = useMemo(() => {
    const totalGardens = gardens.length;
    const activeGardens = gardens.filter((g) => g.isActive).length;
    const unassignedGarden = gardens.find((g) => g.id === 1);
    const unassignedHouseholds = unassignedGarden
      ? (unassignedGarden.householdCount ?? getGardenHouseholds(unassignedGarden).length)
      : 0;
    const totalAssignedHouseholds = gardens
      .filter((g) => g.id !== 1)
      .reduce((sum, g) => sum + (g.householdCount ?? getGardenHouseholds(g).length), 0);

    return {
      totalGardens,
      activeGardens,
      totalAssignedHouseholds,
      unassignedHouseholds,
    };
  }, [gardens, gardenMembersMap]);

  // 검색 필터링된 정원 목록
  const filteredGardens = useMemo(() => {
    if (!searchTerm.trim()) return gardens;
    const term = searchTerm.trim().toLowerCase();
    return gardens.filter(
      (g) =>
        (g.name || "").toLowerCase().includes(term) ||
        (g.leaderName || "").toLowerCase().includes(term)
    );
  }, [gardens, searchTerm]);

  // 모달 열기 (신규 등록)
  const handleOpenCreateForm = () => {
    setEditingGarden(null);
    setFormData({
      name: "",
      orderNum: gardens.length > 0 ? Math.max(...gardens.map((g) => g.orderNum || 0)) + 1 : 1,
      leaderMemberId: null,
      isActive: true,
    });
    setErrorMessage("");
    setSuccessMessage("");
    setIsFormOpen(true);
  };

  // 모달 열기 (기존 정원 수정)
  const handleOpenEditForm = (garden) => {
    setEditingGarden(garden);
    setFormData({
      name: garden.name,
      orderNum: garden.orderNum ?? 0,
      leaderMemberId: garden.leaderMemberId || null,
      isActive: Boolean(garden.isActive),
    });
    setErrorMessage("");
    setSuccessMessage("");
    setIsFormOpen(true);
  };

  // 모달 닫기
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingGarden(null);
    setErrorMessage("");
  };

  // 폼 저장 제출
  const handleSubmitForm = async (e) => {
    e?.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage("정원 이름을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (editingGarden) {
        await updateGarden(editingGarden.id, {
          name: formData.name.trim(),
          orderNum: Number(formData.orderNum) || 0,
          leaderMemberId: formData.leaderMemberId,
          isActive: formData.isActive,
        });
        setSuccessMessage(`[${formData.name}] 정원 정보가 수정되었습니다.`);
      } else {
        await createGarden({
          name: formData.name.trim(),
          orderNum: Number(formData.orderNum) || 0,
          leaderMemberId: formData.leaderMemberId,
          isActive: formData.isActive,
        });
        setSuccessMessage(`[${formData.name}] 신규 정원이 등록되었습니다.`);
      }

      setIsFormOpen(false);
      setEditingGarden(null);
      await fetchGardensList();
      onGardensUpdated?.();
    } catch (err) {
      console.error("Save garden error:", err);
      setErrorMessage(err?.response?.data?.message || "정원 저장 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // 삭제 확정 처리
  const handleConfirmDelete = async () => {
    if (!gardenToDelete) return;
    setDeleting(true);
    try {
      await deleteGarden(gardenToDelete.id);
      setGardenToDelete(null);
      setSuccessMessage(`[${gardenToDelete.name}] 정원이 삭제되었습니다.`);
      await fetchGardensList();
      onGardensUpdated?.();
    } catch (err) {
      console.error("Delete garden error:", err);
      alert(err?.response?.data?.message || "정원 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  // 정원 순서 드래그 앤 드롭 및 순서 재배치 적용
  const applyReorder = async (sourceId, targetId) => {
    const fromIndex = gardens.findIndex((g) => g.id === sourceId);
    const toIndex = gardens.findIndex((g) => g.id === targetId);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

    const previousGardens = [...gardens];
    const updated = [...gardens];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    // 순서 번호(orderNum) 1부터 연속 재부여
    const reorderedWithNums = updated.map((item, idx) => ({
      ...item,
      orderNum: idx + 1,
    }));

    // 즉시 로컬 상태 반영 (낙관적 업데이트)
    setGardens(reorderedWithNums);
    setDraggedGardenId(null);
    setDragOverGardenId(null);

    try {
      setIsReordering(true);
      const orderedIds = reorderedWithNums.map((g) => g.id);
      await reorderGardens(orderedIds);
      setSuccessMessage("정원 순서가 성공적으로 저장되었습니다.");
      onGardensUpdated?.();
    } catch (err) {
      console.error("Failed to reorder gardens:", err);
      setErrorMessage(err?.response?.data?.message || "정원 순서 저장 중 오류가 발생했습니다.");
      setGardens(previousGardens); // 실패 시 원복
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragStart = (e, gardenId) => {
    if (searchTerm.trim() || isReordering) {
      e.preventDefault();
      return;
    }
    setDraggedGardenId(gardenId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", gardenId.toString());
  };

  const handleDragOver = (e, gardenId) => {
    e.preventDefault();
    if (!draggedGardenId || draggedGardenId === gardenId) return;
    e.dataTransfer.dropEffect = "move";
    if (dragOverGardenId !== gardenId) {
      setDragOverGardenId(gardenId);
    }
  };

  const handleDragLeave = (e, gardenId) => {
    if (dragOverGardenId === gardenId) {
      setDragOverGardenId(null);
    }
  };

  const handleDrop = async (e, targetGardenId) => {
    e.preventDefault();
    const sourceId = draggedGardenId;
    setDraggedGardenId(null);
    setDragOverGardenId(null);
    if (!sourceId || sourceId === targetGardenId) return;

    await applyReorder(sourceId, targetGardenId);
  };

  const handleDragEnd = () => {
    setDraggedGardenId(null);
    setDragOverGardenId(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* ========================================================= */}
      {/* 1. 상단 4대 정원 요약 지표 카드                           */}
      {/* ========================================================= */}
      <Grid container spacing={2}>
        {/* 총 정원수 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              backgroundColor: "#ffffff",
            }}
          >
            <CardContent sx={{ p: 2.2, "&:last-child": { pb: 2.2 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                    전체 정원
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mt: 0.3 }}>
                    {metrics.totalGardens}개
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "rgba(22, 163, 74, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <YardOutlinedIcon sx={{ color: "#16a34a", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 운영 중 정원 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              backgroundColor: "#ffffff",
            }}
          >
            <CardContent sx={{ p: 2.2, "&:last-child": { pb: 2.2 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                    운영 중인 정원
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#16a34a", mt: 0.3 }}>
                    {metrics.activeGardens}개
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TaskAltIcon sx={{ color: "#22c55e", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 배정 완료 세대 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              backgroundColor: "#ffffff",
            }}
          >
            <CardContent sx={{ p: 2.2, "&:last-child": { pb: 2.2 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                    정원 배정 세대
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#2563eb", mt: 0.3 }}>
                    {metrics.totalAssignedHouseholds}가구
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "rgba(37, 99, 235, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HomeWorkOutlinedIcon sx={{ color: "#2563eb", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 미배정 세대 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              backgroundColor: "#ffffff",
            }}
          >
            <CardContent sx={{ p: 2.2, "&:last-child": { pb: 2.2 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                    미배정 세대
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      color: metrics.unassignedHouseholds > 0 ? "#ea580c" : "#64748b",
                      mt: 0.3,
                    }}
                  >
                    {metrics.unassignedHouseholds}가구
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "rgba(234, 88, 12, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HelpOutlineIcon sx={{ color: "#ea580c", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ========================================================= */}
      {/* 2. 메인 정원 관리 카드                                    */}
      {/* ========================================================= */}
      <Card
        sx={{
          borderRadius: "20px",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.04)",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        {/* 상단 툴바 */}
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            backgroundColor: "#fcfdfc",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <ForestIcon sx={{ color: "#16a34a", fontSize: 26 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#14532d" }}>
                온교회 정원(목장) 목록 및 소속 현황
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                소속 가구/교인수를 클릭하면 명단을 바로 확인할 수 있으며, 행을 드래그하여 순서를 바로 변경할 수 있습니다.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            {/* 순서 저장 중 인디케이터 */}
            {isReordering && (
              <Chip
                size="small"
                icon={<CircularProgress size={14} sx={{ color: "#16a34a" }} />}
                label="순서 저장 중..."
                sx={{ backgroundColor: "#f0fdf4", color: "#166534", fontWeight: 700 }}
              />
            )}

            {/* 검색창 */}
            <TextField
              size="small"
              placeholder="정원명, 정원지기 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: { xs: "100%", sm: 240 },
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#94a3b8", fontSize: "1.1rem" }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm("")}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
            />

            <Tooltip title="목록 새로고침">
              <IconButton size="small" onClick={fetchGardensList} disabled={loading}>
                <RefreshIcon fontSize="small" sx={{ color: "#64748b" }} />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateForm}
              sx={{
                borderRadius: "10px",
                backgroundColor: "#16a34a",
                "&:hover": { backgroundColor: "#15803d" },
                fontWeight: 700,
                px: 2.2,
                boxShadow: "0 2px 8px rgba(22, 163, 74, 0.25)",
              }}
            >
              새 정원 등록
            </Button>
          </Box>
        </Box>

        {/* 검색 중 안내 */}
        {searchTerm && (
          <Box sx={{ px: 3, pt: 1.5 }}>
            <Alert severity="info" sx={{ borderRadius: "10px", py: 0.5 }}>
              검색 필터가 적용된 상태에서는 순서 드래그 기능이 비활성화됩니다. 검색어를 지우면 전체 목록에서 순서를 자유롭게 드래그하여 변경할 수 있습니다.
            </Alert>
          </Box>
        )}

        {/* 피드백 메시지 */}
        {errorMessage && (
          <Box sx={{ px: 3, pt: 2 }}>
            <Alert severity="error" sx={{ borderRadius: "10px" }} onClose={() => setErrorMessage("")}>
              {errorMessage}
            </Alert>
          </Box>
        )}
        {successMessage && (
          <Box sx={{ px: 3, pt: 2 }}>
            <Alert severity="success" sx={{ borderRadius: "10px" }} onClose={() => setSuccessMessage("")}>
              {successMessage}
            </Alert>
          </Box>
        )}

        {/* 정원 목록 테이블 */}
        <TableContainer sx={{ minHeight: 360 }}>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ "& th": { backgroundColor: "#f8fafc", fontWeight: 700, color: "#475569", py: 1.5 } }}>
                <TableCell align="center" width="105">
                  <Tooltip title="행을 위아래로 드래그하여 순서를 바꿀 수 있습니다">
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "help" }}>
                      <DragIndicatorIcon sx={{ fontSize: 16, color: "#64748b" }} />
                      <span>순서</span>
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell width="200">정원명</TableCell>
                <TableCell width="200">정원지기 (리더)</TableCell>
                <TableCell align="center" width="140">소속 세대수</TableCell>
                <TableCell align="center" width="140">소속 교인수</TableCell>
                <TableCell align="center" width="120">운영 상태</TableCell>
                <TableCell align="center" width="120">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && gardens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={32} sx={{ color: "#16a34a" }} />
                  </TableCell>
                </TableRow>
              ) : filteredGardens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8, color: "#94a3b8" }}>
                    {searchTerm ? "검색 조건에 맞는 정원이 없습니다." : "등록된 정원이 없습니다."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredGardens.map((g, index) => {
                  const isUnassigned = g.id === 1;
                  const gMembers = getGardenMembers(g);
                  const gHouseholds = getGardenHouseholds(g);
                  const hCount = g.householdCount !== undefined && g.householdCount !== null ? g.householdCount : gHouseholds.length;
                  const mCount = g.memberCount !== undefined && g.memberCount !== null ? g.memberCount : gMembers.length;
                  const canDrag = !searchTerm.trim() && !isReordering;
                  const isBeingDragged = draggedGardenId === g.id;
                  const isDragOver = dragOverGardenId === g.id && draggedGardenId !== g.id;

                  return (
                    <TableRow
                      key={g.id}
                      hover
                      draggable={canDrag}
                      onDragStart={(e) => handleDragStart(e, g.id)}
                      onDragOver={(e) => handleDragOver(e, g.id)}
                      onDragLeave={(e) => handleDragLeave(e, g.id)}
                      onDrop={(e) => handleDrop(e, g.id)}
                      onDragEnd={handleDragEnd}
                      sx={{
                        backgroundColor: isDragOver
                          ? "rgba(34, 197, 94, 0.08)"
                          : isBeingDragged
                          ? "#f1f5f9"
                          : !g.isActive
                          ? "#f8fafc"
                          : "inherit",
                        opacity: isBeingDragged ? 0.35 : !g.isActive ? 0.75 : 1,
                        borderTop: isDragOver ? "3px solid #16a34a" : undefined,
                        borderBottom: isDragOver ? "3px solid #16a34a" : undefined,
                        cursor: canDrag ? "grab" : "default",
                        "&:active": {
                          cursor: canDrag ? "grabbing" : "default",
                        },
                        transition: "background-color 0.15s ease, opacity 0.15s ease",
                      }}
                    >
                      {/* 순서 & 드래그 핸들 */}
                      <TableCell align="center" sx={{ color: "#64748b", fontWeight: 700, py: 1, userSelect: "none" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.4 }}>
                          <Tooltip title={searchTerm ? "검색 중에는 드래그 순서 변경이 불가합니다" : "드래그하여 순서 변경 (위아래로 이동)"}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: searchTerm ? "#cbd5e1" : "#94a3b8",
                                p: 0.3,
                                borderRadius: "4px",
                                "&:hover": { color: searchTerm ? "#cbd5e1" : "#16a34a", backgroundColor: "rgba(22, 163, 74, 0.08)" },
                              }}
                            >
                              <DragIndicatorIcon fontSize="small" />
                            </Box>
                          </Tooltip>

                          <Typography variant="body2" sx={{ fontWeight: 800, minWidth: 20, textAlign: "center" }}>
                            {index + 1}
                          </Typography>

                          {!searchTerm && (
                            <Box sx={{ display: "flex", flexDirection: "column", ml: 0.2 }}>
                              <Tooltip title="한 칸 위로">
                                <span>
                                  <IconButton
                                    size="small"
                                    disabled={index === 0 || isReordering}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (index > 0) applyReorder(g.id, filteredGardens[index - 1].id);
                                    }}
                                    sx={{ p: 0.1, width: 18, height: 14, color: "#64748b", "&:hover": { color: "#16a34a" } }}
                                  >
                                    <KeyboardArrowUpIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <Tooltip title="한 칸 아래로">
                                <span>
                                  <IconButton
                                    size="small"
                                    disabled={index === filteredGardens.length - 1 || isReordering}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (index < filteredGardens.length - 1) applyReorder(g.id, filteredGardens[index + 1].id);
                                    }}
                                    sx={{ p: 0.1, width: 18, height: 14, color: "#64748b", "&:hover": { color: "#16a34a" } }}
                                  >
                                    <KeyboardArrowDownIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Box>
                          )}
                        </Box>
                      </TableCell>

                      {/* 정원명 */}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "8px",
                              backgroundColor: isUnassigned ? "#f1f5f9" : "rgba(22, 163, 74, 0.08)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <ForestIcon sx={{ color: isUnassigned ? "#94a3b8" : "#16a34a", fontSize: 18 }} />
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: "#1e293b", fontSize: "0.95rem" }}>
                            {g.name}
                          </Typography>
                          {isUnassigned && (
                            <Chip
                              size="small"
                              label="기본"
                              sx={{
                                height: 20,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                backgroundColor: "#e2e8f0",
                                color: "#475569",
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>

                      {/* 정원지기 */}
                      <TableCell>
                        {g.leaderName ? (
                          <Chip
                            size="small"
                            label={g.leaderName}
                            sx={{
                              backgroundColor: "rgba(22, 163, 74, 0.08)",
                              color: "#16a34a",
                              fontWeight: 700,
                              height: 26,
                            }}
                          />
                        ) : (
                          <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                            미지정
                          </Typography>
                        )}
                      </TableCell>

                      {/* 소속 세대수 (클릭 시 명단 확인) */}
                      <TableCell align="center">
                        <Tooltip title="클릭하여 소속 세대 및 교인 명단 확인">
                          <Chip
                            size="small"
                            icon={<HomeWorkOutlinedIcon style={{ fontSize: 15 }} />}
                            label={`${hCount}가구`}
                            onClick={() => setViewingGarden(g)}
                            variant="outlined"
                            sx={{
                              cursor: "pointer",
                              height: 26,
                              fontSize: "0.8rem",
                              borderColor: hCount > 0 ? "#94a3b8" : "#e2e8f0",
                              color: hCount > 0 ? "#1e293b" : "#94a3b8",
                              fontWeight: hCount > 0 ? 800 : 500,
                              backgroundColor: hCount > 0 ? "#f8fafc" : "transparent",
                              "&:hover": {
                                backgroundColor: "#e2e8f0",
                                borderColor: "#64748b",
                              },
                            }}
                          />
                        </Tooltip>
                      </TableCell>

                      {/* 소속 교인수 (클릭 시 명단 확인) */}
                      <TableCell align="center">
                        <Tooltip title="클릭하여 소속 교인 명단 확인">
                          <Chip
                            size="small"
                            icon={<PeopleAltOutlinedIcon style={{ fontSize: 15 }} />}
                            label={`${mCount}명`}
                            onClick={() => setViewingGarden(g)}
                            variant="outlined"
                            sx={{
                              cursor: "pointer",
                              height: 26,
                              fontSize: "0.8rem",
                              borderColor: mCount > 0 ? "#86efac" : "#e2e8f0",
                              backgroundColor: mCount > 0 ? "rgba(34, 197, 94, 0.08)" : "transparent",
                              color: mCount > 0 ? "#15803d" : "#94a3b8",
                              fontWeight: mCount > 0 ? 800 : 500,
                              "&:hover": {
                                backgroundColor: "rgba(34, 197, 94, 0.18)",
                                borderColor: "#22c55e",
                              },
                            }}
                          />
                        </Tooltip>
                      </TableCell>

                      {/* 운영 상태 */}
                      <TableCell align="center">
                        {g.isActive ? (
                          <Chip
                            size="small"
                            icon={<CheckCircleOutlineIcon style={{ fontSize: 14 }} />}
                            label="운영 중"
                            color="success"
                            variant="outlined"
                            sx={{ height: 24, fontSize: "0.74rem", fontWeight: 700 }}
                          />
                        ) : (
                          <Chip
                            size="small"
                            icon={<BlockIcon style={{ fontSize: 14 }} />}
                            label="비활성"
                            sx={{ height: 24, fontSize: "0.74rem", backgroundColor: "#f1f5f9", color: "#64748b" }}
                          />
                        )}
                      </TableCell>

                      {/* 관리 버튼 */}
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.8 }}>
                          <Tooltip title="정원 정보 수정 (팝업)">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEditForm(g)}
                              sx={{
                                color: "#3b82f6",
                                backgroundColor: "rgba(59, 130, 246, 0.06)",
                                "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.15)" },
                              }}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {isUnassigned ? (
                            <Tooltip title="기본 정원은 삭제할 수 없습니다">
                              <span>
                                <IconButton size="small" disabled sx={{ color: "#cbd5e1" }}>
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          ) : (
                            <Tooltip title="정원 삭제">
                              <IconButton
                                size="small"
                                onClick={() => setGardenToDelete(g)}
                                sx={{
                                  color: "#ef4444",
                                  backgroundColor: "rgba(239, 68, 68, 0.06)",
                                  "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.15)" },
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ========================================================= */}
      {/* 3. 정원 등록 및 정보 수정 모달 다이얼로그 (중앙 팝업)         */}
      {/* ========================================================= */}
      <Dialog
        open={isFormOpen}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
              boxShadow: "0 16px 48px rgba(0, 0, 0, 0.16)",
              p: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#15803d", display: "flex", alignItems: "center", gap: 1 }}>
          <ForestIcon sx={{ color: "#16a34a" }} />
          {editingGarden ? `[${editingGarden.name}] 정원 정보 수정` : "신규 정원 등록"}
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2.5 }}>
          {/* 수정 모드일 때: 소속 세대 및 교인 현황 요약 박스 */}
          {editingGarden && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2.5,
                borderRadius: "14px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#14532d", mb: 1 }}>
                🌱 [{editingGarden.name}] 소속 현황
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 1.5 }}>
                <Chip
                  icon={<HomeWorkOutlinedIcon style={{ fontSize: 16 }} />}
                  label={`소속 세대: ${editingGarden.householdCount ?? getGardenHouseholds(editingGarden).length}가구`}
                  sx={{ backgroundColor: "#dcfce7", color: "#166534", fontWeight: 700 }}
                />
                <Chip
                  icon={<PeopleAltOutlinedIcon style={{ fontSize: 16 }} />}
                  label={`소속 교인: ${editingGarden.memberCount ?? getGardenMembers(editingGarden).length}명`}
                  sx={{ backgroundColor: "#dcfce7", color: "#166534", fontWeight: 700 }}
                />
              </Box>

              {getGardenMembers(editingGarden).length > 0 && (
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", display: "block", mb: 0.6 }}>
                    소속 교인 명단 ({getGardenMembers(editingGarden).length}명):
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6, maxHeight: 110, overflowY: "auto" }}>
                    {getGardenMembers(editingGarden).map((m) => (
                      <Chip
                        key={m.id}
                        label={`${m.name}${m.isHead ? " (세대주)" : ""}`}
                        size="small"
                        sx={{
                          backgroundColor: m.isHead ? "#bbf7d0" : "#ffffff",
                          border: "1px solid #86efac",
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          )}

          {/* 입력 필드들 */}
          <Grid container spacing={2}>
            {/* 정원명 */}
            <Grid size={{ xs: 12, sm: 7 }}>
              <TextField
                fullWidth
                required
                size="small"
                label="정원 이름"
                placeholder="예: 에덴1정원, 가나안정원"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                disabled={editingGarden?.id === 1}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            {/* 노출 순서 */}
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="노출 순서 (낮을수록 앞쪽)"
                value={formData.orderNum}
                onChange={(e) => setFormData((prev) => ({ ...prev, orderNum: Number(e.target.value) }))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            {/* 정원지기 선택 */}
            <Grid size={12}>
              <Autocomplete
                size="small"
                options={candidateLeaders}
                getOptionLabel={(opt) => opt.label || ""}
                value={candidateLeaders.find((l) => l.id === formData.leaderMemberId) || null}
                onChange={(e, val) => setFormData((prev) => ({ ...prev, leaderMemberId: val?.id || null }))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="정원지기(리더) 교인 선택"
                    placeholder="교인 성명 검색..."
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                )}
              />
            </Grid>

            {/* 운영 상태 */}
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    color="success"
                    disabled={editingGarden?.id === 1}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600, color: formData.isActive ? "#16a34a" : "#64748b" }}>
                    {formData.isActive ? "운영 중 (활성 정원)" : "미운영 (비활성 정원)"}
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseForm} sx={{ color: "#64748b", borderRadius: "10px" }}>
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitForm}
            disabled={submitting}
            sx={{
              borderRadius: "10px",
              backgroundColor: "#16a34a",
              "&:hover": { backgroundColor: "#15803d" },
              fontWeight: 800,
              px: 3,
            }}
          >
            {submitting ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "저장하기"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================= */}
      {/* 4. 소속 세대 및 교인 명단 확인 전용 모달 다이얼로그             */}
      {/* ========================================================= */}
      <Dialog
        open={Boolean(viewingGarden)}
        onClose={() => setViewingGarden(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
              boxShadow: "0 16px 48px rgba(0, 0, 0, 0.16)",
              p: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#15803d", display: "flex", alignItems: "center", gap: 1 }}>
          <ForestIcon sx={{ color: "#16a34a" }} />
          [{viewingGarden?.name}] 소속 세대 및 교인 현황
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2.5 }}>
          {viewingGarden && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* 요약 칩 */}
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <Chip
                  icon={<HomeWorkOutlinedIcon style={{ fontSize: 16 }} />}
                  label={`총 ${viewingGarden.householdCount ?? getGardenHouseholds(viewingGarden).length}가구`}
                  sx={{ backgroundColor: "#eff6ff", color: "#1d4ed8", fontWeight: 700 }}
                />
                <Chip
                  icon={<PeopleAltOutlinedIcon style={{ fontSize: 16 }} />}
                  label={`총 ${viewingGarden.memberCount ?? getGardenMembers(viewingGarden).length}명`}
                  sx={{ backgroundColor: "#f0fdf4", color: "#15803d", fontWeight: 700 }}
                />
                {viewingGarden.leaderName && (
                  <Chip
                    label={`정원지기: ${viewingGarden.leaderName}`}
                    sx={{ backgroundColor: "#fef3c7", color: "#b45309", fontWeight: 700 }}
                  />
                )}
              </Box>

              {/* 소속 세대 목록 */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
                  🏠 소속 세대 ({getGardenHouseholds(viewingGarden).length}가구)
                </Typography>
                {getGardenHouseholds(viewingGarden).length === 0 ? (
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    소속된 세대가 없습니다.
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 180, overflowY: "auto" }}>
                    {getGardenHouseholds(viewingGarden).map((h) => (
                      <Paper
                        key={h.id}
                        elevation={0}
                        sx={{
                          p: 1.2,
                          px: 1.8,
                          borderRadius: "10px",
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                            {h.householdName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#64748b" }}>
                            세대주: {h.headName} {h.address ? `· ${h.address}` : ""}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={`${h.members.length}명`}
                          sx={{ height: 22, fontSize: "0.72rem", backgroundColor: "#e2e8f0" }}
                        />
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>

              <Divider />

              {/* 소속 교인 명단 */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
                  👥 소속 교인 ({getGardenMembers(viewingGarden).length}명)
                </Typography>
                {getGardenMembers(viewingGarden).length === 0 ? (
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    소속된 교인이 없습니다.
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, maxHeight: 180, overflowY: "auto" }}>
                    {getGardenMembers(viewingGarden).map((m) => (
                      <Chip
                        key={m.id}
                        label={`${m.name}${m.position ? ` (${m.position})` : ""}${m.isHead ? " · 세대주" : ""}`}
                        sx={{
                          backgroundColor: m.isHead ? "#dcfce7" : "#f1f5f9",
                          color: m.isHead ? "#15803d" : "#334155",
                          fontWeight: m.isHead ? 800 : 500,
                          fontSize: "0.8rem",
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setViewingGarden(null)} variant="contained" sx={{ borderRadius: "10px", backgroundColor: "#16a34a" }}>
            확인
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================= */}
      {/* 5. 정원 삭제 확인 서브 다이얼로그                              */}
      {/* ========================================================= */}
      <Dialog
        open={Boolean(gardenToDelete)}
        onClose={() => setGardenToDelete(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "18px", p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#dc2626" }}>
          정원 삭제 확인
        </DialogTitle>
        <DialogContent>
          {(gardenToDelete?.householdCount ?? getGardenHouseholds(gardenToDelete).length) > 0 ? (
            <Box>
              <Alert severity="warning" sx={{ mb: 2, borderRadius: "10px" }}>
                현재 <strong>[{gardenToDelete?.name}]</strong>에 소속된 세대가 <strong>{gardenToDelete?.householdCount ?? getGardenHouseholds(gardenToDelete).length}가구</strong>(교인 {gardenToDelete?.memberCount ?? getGardenMembers(gardenToDelete).length}명) 있습니다.
              </Alert>
              <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                안전한 교적 관리를 위해, 소속 세대가 있는 정원은 직접 삭제할 수 없습니다.
                <br /><br />
                소속 가구를 다른 정원으로 먼저 이동시키거나, 해당 정원의 운영 상태를 <strong>[미운영(비활성)]</strong>으로 변경해 주세요.
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.6 }}>
              정말 <strong>[{gardenToDelete?.name}]</strong> 정원을 삭제하시겠습니까?
              <br />
              현재 소속된 세대가 없으므로 안전하게 영구 삭제됩니다.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button onClick={() => setGardenToDelete(null)} sx={{ color: "#64748b" }}>
            {(gardenToDelete?.householdCount ?? getGardenHouseholds(gardenToDelete).length) > 0 ? "확인" : "취소"}
          </Button>
          {(gardenToDelete?.householdCount ?? getGardenHouseholds(gardenToDelete).length) === 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              disabled={deleting}
              sx={{ borderRadius: "8px", fontWeight: 700 }}
            >
              {deleting ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "삭제 확정"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

GardenManagementDashboard.propTypes = {
  users: PropTypes.array,
  onGardensUpdated: PropTypes.func,
};

export default GardenManagementDashboard;
