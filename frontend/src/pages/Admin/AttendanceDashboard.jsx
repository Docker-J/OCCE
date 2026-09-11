import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  LinearProgress,
  Tooltip,
  Stack,
  Alert,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";

import { getAdminAttendanceStats } from "../../api/admin";
import useSnackbar from "../../util/useSnackbar";
import GardenAttendanceDetailModal from "./GardenAttendanceDetailModal";

const AttendanceDashboard = () => {
  const { openSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedGardenForDetail, setSelectedGardenForDetail] = useState(null);

  const handleOpenDetailModal = (gardenName) => {
    setSelectedGardenForDetail(gardenName);
    setDetailModalOpen(true);
  };

  // Table sorting
  const [sortField, setSortField] = useState("rate");
  const [sortDirection, setSortDirection] = useState("desc");

  const fetchData = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setErrorMsg("");

      try {
        const res = await getAdminAttendanceStats();
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
        const msg =
          err.response?.data?.message ||
          "출석 통계를 불러오는 중 오류가 발생했습니다.";
        setErrorMsg(msg);
        openSnackbar("error", msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [openSnackbar],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const weeks = data?.weeks || [];
  const availableDates = useMemo(() => weeks.map((w) => w.date), [weeks]);
  const currentWeek = useMemo(() => {
    return weeks.find((w) => w.date === selectedDate) || weeks[0] || null;
  }, [weeks, selectedDate]);

  const currentIndex = availableDates.indexOf(selectedDate);
  const hasPrevious = currentIndex < availableDates.length - 1; // older date
  const hasNext = currentIndex > 0; // newer date

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

  // Sorted Garden Stats for currently selected week
  const sortedGardenStats = useMemo(() => {
    if (!currentWeek?.gardenStats) return [];
    const list = [...currentWeek.gardenStats];

    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "string") {
        const cmp = valA.localeCompare(valB, "ko");
        return sortDirection === "asc" ? cmp : -cmp;
      }

      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

    return list;
  }, [currentWeek?.gardenStats, sortField, sortDirection]);

  if (loading && !data) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 12,
        }}
      >
        <CircularProgress sx={{ color: "#FF6B00", mb: 2 }} />
        <Typography variant="body1" sx={{ color: "#666", fontWeight: 500 }}>
          구글 드라이브 주간 출석부 데이터를 분석하고 있습니다...
        </Typography>
      </Box>
    );
  }

  if (errorMsg && !data) {
    return (
      <Box sx={{ py: 6 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => fetchData()}>
              다시 시도
            </Button>
          }
          sx={{ borderRadius: "12px" }}
        >
          {errorMsg}
        </Alert>
      </Box>
    );
  }

  const summary = currentWeek?.summary;
  const trend = data?.trend || [];

  return (
    <Box sx={{ pb: 4 }}>
      {/* 1. Date Controls & Actions Toolbar */}
      <Card
        sx={{
          mb: 3,
          p: 2,
          borderRadius: "16px",
          background: "#fff",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Left: Date Selection */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="이전 주일 출석부">
              <span>
                <IconButton
                  size="small"
                  onClick={handlePrevDate}
                  disabled={!hasPrevious || refreshing || loading}
                  sx={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    borderRadius: "10px",
                    p: 0.8,
                  }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel id="attendance-date-label">주일 날짜 선택</InputLabel>
              <Select
                labelId="attendance-date-label"
                value={selectedDate}
                label="주일 날짜 선택"
                onChange={(e) => handleDateChange(e.target.value)}
                sx={{ borderRadius: "10px", fontWeight: 700 }}
              >
                {availableDates.map((d, i) => (
                  <MenuItem key={d} value={d}>
                    {d} {i === 0 ? "(최근 주일)" : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tooltip title="다음 주일 출석부">
              <span>
                <IconButton
                  size="small"
                  onClick={handleNextDate}
                  disabled={!hasNext || refreshing || loading}
                  sx={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    borderRadius: "10px",
                    p: 0.8,
                  }}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          {/* Right: Refresh button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
              {selectedDate} 주일 출석 현황
            </Typography>
            <Tooltip title="실시간 새로고침">
              <span>
                <IconButton
                  onClick={() => fetchData(true)}
                  disabled={refreshing || loading}
                  sx={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    borderRadius: "10px",
                    p: 0.8,
                  }}
                >
                  {refreshing ? (
                    <CircularProgress size={18} sx={{ color: "#FF6B00" }} />
                  ) : (
                    <RefreshIcon fontSize="small" sx={{ color: "#555" }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Card>

      {/* 2. Top Summary Metric Cards (4 Cards) */}
      {summary && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 4,
          }}
        >
          {/* Card 1: Total Attendance */}
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(22, 163, 74, 0.15)",
              background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
            }}
          >
            <CardContent sx={{ p: "20px !important" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#16a34a" }}>
                  주일 총 출석 인원
                </Typography>
                <PeopleIcon sx={{ color: "#16a34a", fontSize: "1.4rem" }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 0.8 }}>
                {summary.totalAttendees}
                <Typography component="span" variant="body1" sx={{ color: "#64748b", fontWeight: 500, ml: 0.5 }}>
                  / {summary.totalMembers}명
                </Typography>
              </Typography>
              <Chip
                label={`출석률 ${summary.overallAttendanceRate}%`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  backgroundColor: "#dcfce7",
                  color: "#15803d",
                  borderRadius: "6px",
                }}
              />
            </CardContent>
          </Card>

          {/* Card 2: Garden Reporting Progress */}
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(37, 99, 235, 0.15)",
              background: "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)",
            }}
          >
            <CardContent sx={{ p: "20px !important" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#2563eb" }}>
                  정원 보고 진척도
                </Typography>
                <AssignmentTurnedInIcon sx={{ color: "#2563eb", fontSize: "1.4rem" }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 0.8 }}>
                {summary.reportedGardensCount}
                <Typography component="span" variant="body1" sx={{ color: "#64748b", fontWeight: 500, ml: 0.5 }}>
                  / {summary.totalGardensCount} 정원
                </Typography>
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={summary.reportingRate}
                  sx={{
                    flexGrow: 1,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "#dbeafe",
                    "& .MuiLinearProgress-bar": { backgroundColor: "#2563eb", borderRadius: 3 },
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#2563eb" }}>
                  {summary.reportingRate}%
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Card 3: Unreported Gardens */}
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(234, 88, 12, 0.15)",
              background: "linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)",
            }}
          >
            <CardContent sx={{ p: "20px !important" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#ea580c" }}>
                  미보고 정원
                </Typography>
                <WarningAmberIcon sx={{ color: "#ea580c", fontSize: "1.4rem" }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 0.8 }}>
                {summary.unreportedGardens.length}
                <Typography component="span" variant="body1" sx={{ color: "#64748b", fontWeight: 500, ml: 0.5 }}>
                  곳
                </Typography>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxHeight: 36, overflow: "hidden" }}>
                {summary.unreportedGardens.length === 0 ? (
                  <Chip
                    label="모든 정원 보고 완료"
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      backgroundColor: "#dcfce7",
                      color: "#15803d",
                      borderRadius: "6px",
                    }}
                  />
                ) : (
                  summary.unreportedGardens.slice(0, 3).map((g) => (
                    <Chip
                      key={g}
                      label={g}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.72rem",
                        backgroundColor: "#fee2e2",
                        color: "#dc2626",
                        borderRadius: "6px",
                        height: 20,
                      }}
                    />
                  ))
                )}
                {summary.unreportedGardens.length > 3 && (
                  <Typography variant="caption" sx={{ color: "#888", alignSelf: "center" }}>
                    +{summary.unreportedGardens.length - 3}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Card 4: Comparison vs Previous Week */}
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(100, 116, 139, 0.15)",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            }}
          >
            <CardContent sx={{ p: "20px !important" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748b" }}>
                  전주 대비 변동
                </Typography>
                {summary.delta ? (
                  summary.delta.attendeesDiff >= 0 ? (
                    <TrendingUpIcon sx={{ color: "#16a34a", fontSize: "1.4rem" }} />
                  ) : (
                    <TrendingDownIcon sx={{ color: "#dc2626", fontSize: "1.4rem" }} />
                  )
                ) : (
                  <EventIcon sx={{ color: "#94a3b8", fontSize: "1.4rem" }} />
                )}
              </Box>
              {summary.delta ? (
                <>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      color: summary.delta.attendeesDiff >= 0 ? "#16a34a" : "#dc2626",
                      mb: 0.8,
                    }}
                  >
                    {summary.delta.attendeesDiff >= 0 ? `+${summary.delta.attendeesDiff}` : summary.delta.attendeesDiff}
                    <Typography component="span" variant="body1" sx={{ color: "#64748b", fontWeight: 500, ml: 0.5 }}>
                      명
                    </Typography>
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                    출석률 {summary.delta.rateDiff >= 0 ? `+${summary.delta.rateDiff}%p` : `${summary.delta.rateDiff}%p`}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" sx={{ color: "#94a3b8", mt: 1.5, fontWeight: 500 }}>
                  이전 주 비교 데이터 없음
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* 3. Recent Weeks Trend (최근 주차별 출석 추이) */}
      {trend.length > 1 && (
        <Card
          sx={{
            mb: 4,
            borderRadius: "16px",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <BarChartIcon sx={{ color: "#ea580c" }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                최근 주차별 출석 추이
              </Typography>
            </Box>

            {/* Visual Bar Columns for Trend */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `repeat(${trend.length}, 1fr)`,
                gap: 2,
                pt: 2,
                pb: 1,
                alignItems: "flex-end",
                minHeight: 180,
              }}
            >
              {trend.map((w) => {
                const isCurrent = w.date === selectedDate;
                const maxAttendees = Math.max(...trend.map((t) => t.attended || 1), 100);
                const heightPercent = Math.min(100, Math.max(15, (w.attended / maxAttendees) * 100));

                return (
                  <Box
                    key={w.date}
                    onClick={() => handleDateChange(w.date)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "transform 0.18s ease",
                      "&:hover": { transform: "translateY(-3px)" },
                    }}
                  >
                    {/* Attendance count label */}
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 800,
                        color: isCurrent ? "#ea580c" : "#475569",
                        mb: 0.5,
                        fontSize: "0.85rem",
                      }}
                    >
                      {w.attended}명
                    </Typography>

                    {/* Bar representation */}
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 48,
                        height: `${heightPercent}px`,
                        minHeight: 24,
                        borderRadius: "8px 8px 4px 4px",
                        backgroundColor: isCurrent ? "#ea580c" : "#cbd5e1",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "&:hover": {
                          backgroundColor: isCurrent ? "#c2410c" : "#94a3b8",
                        },
                      }}
                    />

                    {/* Date label */}
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        fontWeight: isCurrent ? 800 : 600,
                        color: isCurrent ? "#ea580c" : "#64748b",
                        fontSize: "0.75rem",
                        textAlign: "center",
                      }}
                    >
                      {w.date.slice(5)}
                    </Typography>

                    {/* Rate pill */}
                    <Chip
                      label={`${w.rate}%`}
                      size="small"
                      sx={{
                        mt: 0.5,
                        height: 18,
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        backgroundColor: isCurrent ? "rgba(234, 88, 12, 0.15)" : "#f1f5f9",
                        color: isCurrent ? "#c2410c" : "#64748b",
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* 4. Garden Attendance Ranking & Table */}
      <Card
        sx={{
          borderRadius: "16px",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2.5, pb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
              정원별 출석 현황
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
              총 {sortedGardenStats.length}개 정원
            </Typography>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8, width: 110 }}>
                    보고 상태
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>
                    <TableSortLabel
                      active={sortField === "gardenName"}
                      direction={sortDirection}
                      onClick={() => handleSort("gardenName")}
                    >
                      정원명
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>
                    <TableSortLabel
                      active={sortField === "total"}
                      direction={sortDirection}
                      onClick={() => handleSort("total")}
                    >
                      총원
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>
                    <TableSortLabel
                      active={sortField === "attended"}
                      direction={sortDirection}
                      onClick={() => handleSort("attended")}
                    >
                      출석
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>
                    <TableSortLabel
                      active={sortField === "absent"}
                      direction={sortDirection}
                      onClick={() => handleSort("absent")}
                    >
                      결석
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", py: 1.8, minWidth: 160 }}>
                    <TableSortLabel
                      active={sortField === "rate"}
                      direction={sortDirection}
                      onClick={() => handleSort("rate")}
                    >
                      출석률
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", py: 1.8, width: 100 }}>
                    상세
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedGardenStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: "#888" }}>
                      등록된 정원 출석 데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedGardenStats.map((g) => {
                    const barColor =
                      g.rate >= 80 ? "#16a34a" : g.rate >= 60 ? "#ea580c" : "#dc2626";

                    return (
                      <TableRow
                        key={g.gardenName}
                        hover
                        onClick={() => handleOpenDetailModal(g.gardenName)}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          cursor: "pointer",
                          transition: "background-color 0.15s ease",
                          "&:hover": { backgroundColor: "rgba(234, 88, 12, 0.04)" },
                        }}
                      >
                        {/* Reported Badge */}
                        <TableCell sx={{ py: 2 }}>
                          {g.reported ? (
                            <Chip
                              icon={<CheckCircleIcon sx={{ fontSize: "1rem !important", color: "#16a34a !important" }} />}
                              label="보고완료"
                              size="small"
                              sx={{
                                height: 24,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                backgroundColor: "rgba(22, 163, 74, 0.1)",
                                color: "#16a34a",
                                border: "1px solid rgba(22, 163, 74, 0.25)",
                              }}
                            />
                          ) : (
                            <Chip
                              icon={<ErrorOutlineIcon sx={{ fontSize: "1rem !important", color: "#ea580c !important" }} />}
                              label="미보고"
                              size="small"
                              sx={{
                                height: 24,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                backgroundColor: "rgba(234, 88, 12, 0.1)",
                                color: "#ea580c",
                                border: "1px solid rgba(234, 88, 12, 0.25)",
                              }}
                            />
                          )}
                        </TableCell>

                        {/* Garden Name */}
                        <TableCell sx={{ py: 2, fontWeight: 700, color: "#1e293b" }}>
                          {g.gardenName}
                        </TableCell>

                        {/* Total */}
                        <TableCell align="center" sx={{ py: 2, fontWeight: 600, color: "#475569" }}>
                          {g.total}명
                        </TableCell>

                        {/* Attended */}
                        <TableCell align="center" sx={{ py: 2, fontWeight: 700, color: "#16a34a" }}>
                          {g.attended}명
                        </TableCell>

                        {/* Absent */}
                        <TableCell align="center" sx={{ py: 2, fontWeight: 600, color: "#dc2626" }}>
                          {g.absent}명
                        </TableCell>

                        {/* Rate with Progress bar */}
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, justifyContent: "center" }}>
                            <LinearProgress
                              variant="determinate"
                              value={g.rate}
                              sx={{
                                width: 90,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "#e2e8f0",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: barColor,
                                  borderRadius: 4,
                                },
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 800,
                                color: barColor,
                                width: 45,
                                textAlign: "right",
                              }}
                            >
                              {g.rate}%
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Detail Button */}
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetailModal(g.gardenName);
                            }}
                            sx={{
                              borderRadius: "8px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              borderColor: "rgba(234, 88, 12, 0.4)",
                              color: "#ea580c",
                              py: 0.3,
                              px: 1.2,
                              minWidth: 70,
                              "&:hover": {
                                borderColor: "#ea580c",
                                backgroundColor: "rgba(234, 88, 12, 0.08)",
                              },
                            }}
                          >
                            상세보기
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Garden Attendance Detail Modal */}
      <GardenAttendanceDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        gardenName={selectedGardenForDetail}
        date={selectedDate}
      />
    </Box>
  );
};

export default AttendanceDashboard;
