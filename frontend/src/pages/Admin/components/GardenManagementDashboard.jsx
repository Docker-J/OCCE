/**
 * @file GardenManagementDashboard.jsx
 * @description 온교회 정원(목장) 마스터 목록 관리 대시보드 (탭 전용 뷰)
 * - 4대 정원 요약 지표 카드 (전체 정원, 운영 중 정원, 배정 세대, 미배정 세대)
 * - 정원 목록 조회, 검색 및 필터링
 * - 신규 정원 등록 및 인라인 정보 수정 (정원명, 정원지기, 순서, 운영 상태)
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

import {
  getAdminGardensWithStats,
  createGarden,
  updateGarden,
  deleteGarden,
} from "../../../api/admin";

const GardenManagementDashboard = ({ users = [], onGardensUpdated }) => {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 편집/추가 폼 상태
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGardenId, setEditingGardenId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    orderNum: 0,
    leaderMemberId: null,
    isActive: true,
  });

  // 삭제 확인 다이얼로그 대상
  const [gardenToDelete, setGardenToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  // 4대 통계 지표 계산
  const metrics = useMemo(() => {
    const totalGardens = gardens.length;
    const activeGardens = gardens.filter((g) => g.isActive).length;
    const unassignedGarden = gardens.find((g) => g.id === 1);
    const unassignedHouseholds = unassignedGarden?.householdCount ?? 0;
    const totalAssignedHouseholds = gardens
      .filter((g) => g.id !== 1)
      .reduce((sum, g) => sum + (g.householdCount ?? 0), 0);

    return {
      totalGardens,
      activeGardens,
      totalAssignedHouseholds,
      unassignedHouseholds,
    };
  }, [gardens]);

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

  // 폼 열기 (신규 등록)
  const handleOpenCreateForm = () => {
    setEditingGardenId(null);
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

  // 폼 열기 (기존 정원 수정)
  const handleOpenEditForm = (garden) => {
    setEditingGardenId(garden.id);
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

  // 폼 닫기
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingGardenId(null);
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
      if (editingGardenId) {
        await updateGarden(editingGardenId, {
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
      setEditingGardenId(null);
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
                정원을 생성·수정하고, 소속 가구와 교인 현황을 관리합니다.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
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
              disabled={isFormOpen}
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

        {/* 인라인 등록/수정 폼 카드 */}
        {isFormOpen && (
          <Box sx={{ p: 3, backgroundColor: "#f8fafc", borderBottom: "1px solid rgba(0, 0, 0, 0.06)" }}>
            <Paper
              elevation={0}
              component="form"
              onSubmit={handleSubmitForm}
              sx={{
                p: 2.5,
                borderRadius: "16px",
                border: "1.5px solid #86efac",
                backgroundColor: "#ffffff",
                boxShadow: "0 6px 20px rgba(22, 163, 74, 0.08)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#15803d" }}>
                  {editingGardenId ? `[${formData.name}] 정원 정보 수정` : "신규 정원 등록"}
                </Typography>
                <IconButton size="small" onClick={handleCloseForm} sx={{ color: "#94a3b8" }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              <Grid container spacing={2}>
                {/* 정원명 */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    label="정원 이름"
                    placeholder="예: 에덴1정원, 가나안정원"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    disabled={editingGardenId === 1} // '미배정' 정원명은 불변
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>

                {/* 노출 순서 */}
                <Grid size={{ xs: 12, sm: 6 }}>
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

                {/* 정원지기(리더) 선택 */}
                <Grid size={{ xs: 12, sm: 8 }}>
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

                {/* 운영 상태 (활성/비활성) */}
                <Grid size={{ xs: 12, sm: 4 }} sx={{ display: "flex", alignItems: "center" }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                        color="success"
                        disabled={editingGardenId === 1} // 미배정은 항상 활성
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 600, color: formData.isActive ? "#16a34a" : "#64748b" }}>
                        {formData.isActive ? "운영 중 (활성)" : "미운영 (비활성)"}
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2.5 }}>
                <Button onClick={handleCloseForm} size="small" sx={{ borderRadius: "8px", color: "#64748b" }}>
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  startIcon={<SaveIcon />}
                  disabled={submitting}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#16a34a",
                    "&:hover": { backgroundColor: "#15803d" },
                    fontWeight: 700,
                    px: 2.5,
                  }}
                >
                  {submitting ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "저장하기"}
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

        {/* 정원 목록 테이블 */}
        <TableContainer sx={{ minHeight: 360 }}>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ "& th": { backgroundColor: "#f8fafc", fontWeight: 700, color: "#475569", py: 1.5 } }}>
                <TableCell align="center" width="80">순서</TableCell>
                <TableCell width="220">정원명</TableCell>
                <TableCell width="220">정원지기 (리더)</TableCell>
                <TableCell align="center" width="130">소속 세대수</TableCell>
                <TableCell align="center" width="130">소속 교인수</TableCell>
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
                filteredGardens.map((g) => {
                  const isUnassigned = g.id === 1;
                  return (
                    <TableRow
                      key={g.id}
                      hover
                      sx={{
                        backgroundColor: !g.isActive ? "#f8fafc" : "inherit",
                        opacity: !g.isActive ? 0.75 : 1,
                        transition: "background-color 0.15s ease",
                      }}
                    >
                      {/* 순서 */}
                      <TableCell align="center" sx={{ color: "#64748b", fontWeight: 700 }}>
                        {g.orderNum ?? 0}
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

                      {/* 소속 세대수 */}
                      <TableCell align="center">
                        <Chip
                          size="small"
                          icon={<HomeWorkOutlinedIcon style={{ fontSize: 15 }} />}
                          label={`${g.householdCount ?? 0}가구`}
                          variant="outlined"
                          sx={{
                            height: 24,
                            fontSize: "0.78rem",
                            borderColor: (g.householdCount ?? 0) > 0 ? "#cbd5e1" : "#e2e8f0",
                            color: (g.householdCount ?? 0) > 0 ? "#1e293b" : "#94a3b8",
                            fontWeight: (g.householdCount ?? 0) > 0 ? 800 : 500,
                          }}
                        />
                      </TableCell>

                      {/* 소속 교인수 */}
                      <TableCell align="center">
                        <Chip
                          size="small"
                          icon={<PeopleAltOutlinedIcon style={{ fontSize: 15 }} />}
                          label={`${g.memberCount ?? 0}명`}
                          variant="outlined"
                          sx={{
                            height: 24,
                            fontSize: "0.78rem",
                            borderColor: (g.memberCount ?? 0) > 0 ? "#bbf7d0" : "#e2e8f0",
                            backgroundColor: (g.memberCount ?? 0) > 0 ? "rgba(34, 197, 94, 0.05)" : "transparent",
                            color: (g.memberCount ?? 0) > 0 ? "#15803d" : "#94a3b8",
                            fontWeight: (g.memberCount ?? 0) > 0 ? 800 : 500,
                          }}
                        />
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
                          <Tooltip title="정원 정보 수정">
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
      {/* 정원 삭제 확인 서브 다이얼로그                              */}
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
          {(gardenToDelete?.householdCount ?? 0) > 0 ? (
            <Box>
              <Alert severity="warning" sx={{ mb: 2, borderRadius: "10px" }}>
                현재 <strong>[{gardenToDelete?.name}]</strong>에 소속된 세대가 <strong>{gardenToDelete?.householdCount}가구</strong>(교인 {gardenToDelete?.memberCount}명) 있습니다.
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
            {(gardenToDelete?.householdCount ?? 0) > 0 ? "확인" : "취소"}
          </Button>
          {(gardenToDelete?.householdCount ?? 0) === 0 && (
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
