import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import useAuthStore from "../../store/useAuthStore";
import useSnackbar from "../../util/useSnackbar";
import useModals from "../../util/useModal";
import {
  getAdminUsers,
  updateUserRole,
  deleteUser,
} from "../../api/admin";
import { getGardensAndMembers } from "../../api/attendance";
import { Link } from "react-router";

import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TablePagination,
  TableSortLabel,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import LoginIcon from "@mui/icons-material/Login";
import ForestIcon from "@mui/icons-material/Forest";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";

const titleBackground = {
  backgroundImage: 'url("/img/Community/SmallGroup.webp")',
  backgroundPositionY: "35%",
};

const formatPhoneNumber = (phone) => {
  if (!phone) return "-";
  const cleaned = phone.replace(/\D/g, "");
  // Canada/US 10-digit or 11-digit with country code 1
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    const num = cleaned.slice(1);
    return `+1 (${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6)}`;
  }
  if (cleaned.length === 10) {
    return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

const MemberManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { openSnackbar } = useSnackbar();
  const { openModal } = useModals();

  const authenticated = useAuthStore((state) => state.authenticated);
  const authInitialized = useAuthStore((state) => state.authInitialized);
  const admin = useAuthStore((state) => state.admin);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Search, Filter, Sort and Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // 'all' | 'staff' | 'keeper' | 'member'
  const [gardenFilter, setGardenFilter] = useState("all");
  const [notificationFilter, setNotificationFilter] = useState("all"); // 'all' | 'enabled' | 'disabled'
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' | 'desc'

  // Action states
  const [actionLoadingUser, setActionLoadingUser] = useState(null); // username currently being updated
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Role Confirmation Modal states
  const [userForRoleModal, setUserForRoleModal] = useState(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);

  // Gardens management state
  const [availableGardens, setAvailableGardens] = useState([]);
  const [selectedGardens, setSelectedGardens] = useState([]);
  const [customGardenInput, setCustomGardenInput] = useState("");

  const isFetchingRef = useRef(false);

  // Fetch users from backend
  const fetchUsers = useCallback(
    async (isManualRefresh = false) => {
      if (!authenticated || !admin) return;
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const data = await getAdminUsers();
        setUsers(data.users || []);
        if (isManualRefresh) {
          openSnackbar("success", "교인 목록을 새로고침했습니다.");
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        openSnackbar(
          "error",
          error.response?.data?.message || "교인 목록을 불러오지 못했습니다.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
        isFetchingRef.current = false;
      }
    },
    [authenticated, admin, openSnackbar],
  );

  useEffect(() => {
    if (authInitialized && authenticated && admin) {
      fetchUsers();
      getGardensAndMembers(
        (data) => {
          if (data && data.gardens) {
            const gardenList = Object.keys(data.gardens).sort();
            setAvailableGardens(gardenList);
          }
        },
        (err) => console.warn("Could not fetch gardens list:", err),
      );
    }
  }, [authInitialized, authenticated, admin]);

  // Open GardenKeeper Role Confirmation Modal
  const handleOpenRoleModal = (user) => {
    setUserForRoleModal(user);
    const initial = user.garden
      ? user.garden.split(",").map((g) => g.trim()).filter(Boolean)
      : [];
    setSelectedGardens(initial);
    setCustomGardenInput("");
    setRoleModalOpen(true);
  };

  // Toggle selection of a garden
  const handleToggleGarden = (gardenName) => {
    setSelectedGardens((prev) =>
      prev.includes(gardenName)
        ? prev.filter((g) => g !== gardenName)
        : [...prev, gardenName],
    );
  };

  // Add custom garden directly
  const handleAddCustomGarden = () => {
    const trimmed = customGardenInput.trim();
    if (trimmed && !selectedGardens.includes(trimmed)) {
      setSelectedGardens((prev) => [...prev, trimmed]);
      if (!availableGardens.includes(trimmed)) {
        setAvailableGardens((prev) => [...prev, trimmed].sort());
      }
      setCustomGardenInput("");
    }
  };

  // Confirm and Execute GardenKeeper Role & Gardens update/assign/remove
  const handleSaveRoleAndGardens = async (actionToRun) => {
    if (!userForRoleModal) return;
    const action =
      actionToRun || (userForRoleModal.isGardenKeeper ? "update_gardens" : "assign");

    if (action !== "remove" && selectedGardens.length === 0) {
      openSnackbar("error", "최소 1개 이상의 담당 정원을 선택해 주세요.");
      return;
    }

    setUpdatingRole(true);
    setActionLoadingUser(userForRoleModal.username);
    try {
      await updateUserRole(
        userForRoleModal.username,
        action,
        selectedGardens,
      );
      const updatedGardenStr =
        action === "remove" ? "" : selectedGardens.join(", ");
      setUsers((prev) =>
        prev.map((u) =>
          u.username === userForRoleModal.username
            ? {
                ...u,
                isGardenKeeper: action !== "remove",
                garden: updatedGardenStr,
              }
            : u,
        ),
      );
      openSnackbar(
        "success",
        action === "remove"
          ? `${userForRoleModal.name || "교인"}님의 정원지기 역할이 해제되었습니다.`
          : `${userForRoleModal.name || "교인"}님의 담당 정원이 [${updatedGardenStr}]으로 ${
              userForRoleModal.isGardenKeeper ? "수정" : "배정"
            }되었습니다.`,
      );
      setRoleModalOpen(false);
      setUserForRoleModal(null);
    } catch (error) {
      console.error("Role update failed:", error);
      openSnackbar(
        "error",
        error.response?.data?.message || "역할/정원 변경 중 오류가 발생했습니다.",
      );
    } finally {
      setUpdatingRole(false);
      setActionLoadingUser(null);
    }
  };

  // Open Delete Confirmation Dialog
  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // Confirm and Execute User Deletion
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await deleteUser(userToDelete.username);
      setUsers((prev) => prev.filter((u) => u.username !== userToDelete.username));
      openSnackbar(
        "success",
        `${userToDelete.name || "교인"}님의 계정이 삭제되었습니다.`,
      );
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Delete user failed:", error);
      openSnackbar(
        "error",
        error.response?.data?.message || "교인 계정 삭제에 실패했습니다.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // Reset page when filter, search, or sort changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm, roleFilter, gardenFilter, notificationFilter, sortDirection]);

  // Request sort column/direction
  const handleRequestSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(0);
  };

  // Filtered & Sorted Users List
  const filteredUsers = useMemo(() => {
    const list = users.filter((u) => {
      // 1. Search filter
      const search = searchTerm.trim().toLowerCase();
      const nameMatch = (u.name || "").toLowerCase().includes(search);
      const phoneMatch = (u.phone || "").replace(/\D/g, "").includes(search);
      if (search && !nameMatch && !phoneMatch) return false;

      // 2. Role filter
      if (roleFilter === "staff" && !u.isStaff) return false;
      if (roleFilter === "keeper" && !u.isGardenKeeper) return false;
      if (roleFilter === "member" && (u.isGardenKeeper || u.isStaff)) return false;

      // 3. Garden filter
      if (gardenFilter !== "all") {
        const assigned = (u.garden || "")
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean);
        if (!assigned.includes(gardenFilter)) return false;
      }

      // 4. Notification filter
      if (notificationFilter === "enabled" && !u.hasNotification) return false;
      if (notificationFilter === "disabled" && u.hasNotification) return false;

      return true;
    });

    // 5. Sort by name
    list.sort((a, b) => {
      const nameA = (a.name || "").trim();
      const nameB = (b.name || "").trim();
      const cmp = nameA.localeCompare(nameB, "ko");
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return list;
  }, [users, searchTerm, roleFilter, gardenFilter, notificationFilter, sortDirection]);

  // Paginated users for table display
  const paginatedUsers = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = users.length;
    const staffCount = users.filter((u) => u.isStaff).length;
    const keepers = users.filter((u) => u.isGardenKeeper).length;
    const notificationEnabled = users.filter((u) => u.hasNotification).length;
    return { total, staffCount, keepers, notificationEnabled };
  }, [users]);

  const handleLoginClick = async () => {
    const { default: SignInModal } = await import(
      "../../components/User/SignInModal"
    );
    openModal(SignInModal, {});
  };

  return (
    <>
      <title>교인 관리 대시보드 - OCCE</title>
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
            교인 관리 대시보드
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.85)",
              mt: "8px",
            }}
          >
            온교회 등록 교인 계정 및 정원지기 역할을 관리합니다.
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div
          className="container"
          style={{
            maxWidth: "1100px",
            width: "100%",
            margin: "0 auto",
            padding: "32px 16px",
          }}
        >
          {!authInitialized ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 10,
              }}
            >
              <CircularProgress sx={{ color: "#FF6B00", mb: 2 }} />
              <Typography variant="body1" sx={{ color: "#666" }}>
                사용자 권한을 확인하는 중입니다...
              </Typography>
            </Box>
          ) : !authenticated ? (
            // 1. Unauthenticated View
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "20px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
                textAlign: "center",
                p: 5,
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
                  교인 관리 대시보드는 온교회 스태프(Staff) 권한을 가진 계정만
                  접근하실 수 있습니다.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleLoginClick}
                  startIcon={<LoginIcon />}
                  sx={{
                    backgroundColor: "#FF6B00",
                    "&:hover": { backgroundColor: "#e65100" },
                    borderRadius: "24px",
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                  }}
                >
                  로그인하기
                </Button>
              </CardContent>
            </Card>
          ) : !admin ? (
            // 2. Unauthorized View (Not Staff)
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "20px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
                textAlign: "center",
                p: 5,
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
                  본 페이지는 온교회 스태프(Staff) 권한 보유자 전용 대시보드입니다.
                </Typography>
                <Button
                  component={Link}
                  to="/"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#FF6B00",
                    "&:hover": { backgroundColor: "#e65100" },
                    borderRadius: "24px",
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                  }}
                >
                  홈으로 이동
                </Button>
              </CardContent>
            </Card>
          ) : (
            // 3. Authorized View (Staff Member Management Dashboard)
            <>
              {/* Summary Cards */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                  gap: 2,
                  mb: 3.5,
                }}
              >
                {/* Total Members */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "16px",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      backgroundColor: "rgba(107, 114, 128, 0.1)",
                      color: "#4b5563",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SupervisorAccountIcon fontSize="medium" />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
                      총 등록 교인
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#111" }}>
                      {metrics.total}명
                    </Typography>
                  </Box>
                </Paper>

                {/* Staff */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "16px",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      backgroundColor: "rgba(37, 99, 235, 0.1)",
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SupervisorAccountIcon fontSize="medium" />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
                      스태프 (교역자)
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#2563eb" }}>
                      {metrics.staffCount}명
                    </Typography>
                  </Box>
                </Paper>

                {/* GardenKeepers */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "16px",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      backgroundColor: "rgba(234, 88, 12, 0.1)",
                      color: "#ea580c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ForestIcon fontSize="medium" />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
                      정원지기
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#ea580c" }}>
                      {metrics.keepers}명
                    </Typography>
                  </Box>
                </Paper>

                {/* Notification Active */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "16px",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      backgroundColor: "rgba(22, 163, 74, 0.1)",
                      color: "#16a34a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <NotificationsActiveIcon fontSize="medium" />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
                      알림 수신
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#16a34a" }}>
                      {metrics.notificationEnabled}명
                    </Typography>
                  </Box>
                </Paper>
              </Box>

              {/* Main Card: Controls & Table */}
              <Card
                sx={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.04)",
                  overflow: "hidden",
                }}
              >
                {/* Search & Filter Toolbar */}
                <Box
                  sx={{
                    p: { xs: 2, sm: 3 },
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    alignItems: { xs: "stretch", md: "center" },
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                    backgroundColor: "#fafafa",
                  }}
                >
                  {/* Search Input */}
                  <TextField
                    size="small"
                    placeholder="교인 성명 또는 전화번호 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      minWidth: { xs: "100%", md: 320 },
                      backgroundColor: "#fff",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#888" }} />
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

                  {/* Filters, Sort & Refresh */}
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ flexWrap: "wrap", alignItems: "center" }}
                  >
                    <FormControl size="small" sx={{ minWidth: 125, backgroundColor: "#fff" }}>
                      <InputLabel id="role-filter-label">역할 필터</InputLabel>
                      <Select
                        labelId="role-filter-label"
                        value={roleFilter}
                        label="역할 필터"
                        onChange={(e) => setRoleFilter(e.target.value)}
                        sx={{ borderRadius: "12px" }}
                      >
                        <MenuItem value="all">전체 역할</MenuItem>
                        <MenuItem value="staff">스태프만</MenuItem>
                        <MenuItem value="keeper">정원지기만</MenuItem>
                        <MenuItem value="member">역할 없음 (-)</MenuItem>
                      </Select>
                    </FormControl>

                    {availableGardens.length > 0 && (
                      <FormControl size="small" sx={{ minWidth: 120, backgroundColor: "#fff" }}>
                        <InputLabel id="garden-filter-label">정원 필터</InputLabel>
                        <Select
                          labelId="garden-filter-label"
                          value={gardenFilter}
                          label="정원 필터"
                          onChange={(e) => setGardenFilter(e.target.value)}
                          sx={{ borderRadius: "12px" }}
                        >
                          <MenuItem value="all">전체 정원</MenuItem>
                          {availableGardens.map((g) => (
                            <MenuItem key={g} value={g}>
                              {g}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}

                    <FormControl size="small" sx={{ minWidth: 125, backgroundColor: "#fff" }}>
                      <InputLabel id="notification-filter-label">알림 필터</InputLabel>
                      <Select
                        labelId="notification-filter-label"
                        value={notificationFilter}
                        label="알림 필터"
                        onChange={(e) => setNotificationFilter(e.target.value)}
                        sx={{ borderRadius: "12px" }}
                      >
                        <MenuItem value="all">전체 알림</MenuItem>
                        <MenuItem value="enabled">알림 켜짐 (ON)</MenuItem>
                        <MenuItem value="disabled">알림 미등록 (OFF)</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 140, backgroundColor: "#fff" }}>
                      <InputLabel id="sort-select-label">정렬 기준</InputLabel>
                      <Select
                        labelId="sort-select-label"
                        value={sortDirection}
                        label="정렬 기준"
                        onChange={(e) => setSortDirection(e.target.value)}
                        sx={{ borderRadius: "12px" }}
                      >
                        <MenuItem value="asc">이름순 (가나다)</MenuItem>
                        <MenuItem value="desc">이름 역순 (하파타)</MenuItem>
                      </Select>
                    </FormControl>

                    <Tooltip title="새로고침">
                      <span>
                        <IconButton
                          onClick={() => fetchUsers(true)}
                          disabled={refreshing || loading}
                          sx={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            borderRadius: "12px",
                            backgroundColor: "#fff",
                            p: 0.9,
                            "&:hover": { backgroundColor: "#f0f0f0" },
                          }}
                        >
                          {refreshing ? (
                            <CircularProgress size={20} sx={{ color: "#FF6B00" }} />
                          ) : (
                            <RefreshIcon sx={{ color: "#555" }} />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </Box>

                {/* Table View */}
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 8,
                    }}
                  >
                    <CircularProgress sx={{ color: "#FF6B00", mb: 2 }} />
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      교인 목록을 불러오고 있습니다...
                    </Typography>
                  </Box>
                ) : filteredUsers.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography variant="body1" sx={{ color: "#888", fontWeight: 500 }}>
                      {searchTerm || roleFilter !== "all" || gardenFilter !== "all" || notificationFilter !== "all"
                        ? "검색 조건에 일치하는 교인이 없습니다."
                        : "등록된 교인이 없습니다."}
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <TableContainer component={Box}>
                      <Table sx={{ minWidth: 700 }} aria-label="교인 목록 테이블">
                      <TableHead sx={{ backgroundColor: "#fbfbfb" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: "#555", py: 1.8 }}>
                            <TableSortLabel
                              active={true}
                              direction={sortDirection}
                              onClick={handleRequestSort}
                              sx={{
                                fontWeight: 700,
                                "&.Mui-active": { color: "#ea580c" },
                                "& .MuiTableSortLabel-icon": { color: "#ea580c !important" },
                              }}
                            >
                              성명
                            </TableSortLabel>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#555", py: 1.8, whiteSpace: "nowrap" }}>
                            연락처
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontWeight: 700, color: "#555", py: 1.8, whiteSpace: "nowrap" }}
                          >
                            역할
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontWeight: 700, color: "#555", py: 1.8, whiteSpace: "nowrap" }}
                          >
                            정원
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontWeight: 700, color: "#555", py: 1.8, whiteSpace: "nowrap" }}
                          >
                            알림
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontWeight: 700, color: "#555", py: 1.8 }}
                          >
                            관리
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedUsers.map((user) => {
                          const isProcessing = actionLoadingUser === user.username;

                          return (
                            <TableRow
                              key={user.username}
                              hover
                              sx={{
                                "&:last-child td, &:last-child th": { border: 0 },
                                transition: "all 0.2s ease",
                              }}
                            >
                              {/* Name */}
                              <TableCell sx={{ py: 2 }}>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 700, color: "#222" }}
                                >
                                  {user.name || "(이름 없음)"}
                                </Typography>
                                {user.email && (
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "#888", display: "block" }}
                                  >
                                    {user.email}
                                  </Typography>
                                )}
                              </TableCell>

                              {/* Phone */}
                              <TableCell sx={{ py: 2, color: "#333", fontWeight: 500, whiteSpace: "nowrap" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "nowrap" }}>
                                  <Typography
                                    component="span"
                                    sx={{
                                      width: 140,
                                      minWidth: 140,
                                      whiteSpace: "nowrap",
                                      display: "inline-block",
                                      color: "#333",
                                      fontWeight: 500,
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    {formatPhoneNumber(user.phone)}
                                  </Typography>
                                  {user.phoneVerified ? (
                                    <Tooltip title="전화번호 인증 완료 (Verified)">
                                      <Chip
                                        size="small"
                                        label="인증됨"
                                        sx={{
                                          height: 20,
                                          fontSize: "0.72rem",
                                          fontWeight: 700,
                                          borderRadius: "6px",
                                          backgroundColor: "rgba(22, 163, 74, 0.1)",
                                          color: "#16a34a",
                                          border: "1px solid rgba(22, 163, 74, 0.25)",
                                          "& .MuiChip-label": { px: 0.8 },
                                        }}
                                      />
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title="전화번호 미인증 (Not Verified)">
                                      <Chip
                                        size="small"
                                        label="미인증"
                                        sx={{
                                          height: 20,
                                          fontSize: "0.72rem",
                                          fontWeight: 700,
                                          borderRadius: "6px",
                                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                                          color: "#dc2626",
                                          border: "1px solid rgba(239, 68, 68, 0.25)",
                                          "& .MuiChip-label": { px: 0.8 },
                                        }}
                                      />
                                    </Tooltip>
                                  )}
                                </Box>
                              </TableCell>

                              {/* Role & Permissions (Staff & GardenKeeper) */}
                              <TableCell align="center" sx={{ py: 2, whiteSpace: "nowrap" }}>
                                {isProcessing ? (
                                  <CircularProgress size={22} sx={{ color: "#ea580c" }} />
                                ) : user.isStaff ? (
                                  /* Staff Badge: Staff already has all management and report permissions */
                                  <Tooltip title="온교회 교역자 / 스태프 (모든 소그룹 및 행정 권한 포함)">
                                    <Chip
                                      icon={
                                        <SupervisorAccountIcon
                                          sx={{ fontSize: "1.15rem !important", color: "inherit !important" }}
                                        />
                                      }
                                      label="스태프"
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: "0.875rem",
                                        height: 34,
                                        width: 115,
                                        minWidth: 115,
                                        justifyContent: "center",
                                        borderRadius: "10px",
                                        backgroundColor: "rgba(37, 99, 235, 0.1)",
                                        color: "#1d4ed8",
                                        border: "1px solid rgba(37, 99, 235, 0.25)",
                                      }}
                                    />
                                  </Tooltip>
                                ) : user.isGardenKeeper ? (
                                  /* Non-Staff: GardenKeeper */
                                  <Tooltip title="클릭하여 정원지기 및 담당 정원 수정 또는 해제">
                                    <Chip
                                      icon={
                                        <ForestIcon
                                          sx={{ fontSize: "1.15rem !important", color: "inherit !important" }}
                                        />
                                      }
                                      label="정원지기"
                                      clickable
                                      onClick={() => handleOpenRoleModal(user)}
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: "0.875rem",
                                        height: 34,
                                        width: 115,
                                        minWidth: 115,
                                        justifyContent: "center",
                                        borderRadius: "10px",
                                        backgroundColor: "rgba(234, 88, 12, 0.12)",
                                        color: "#ea580c",
                                        border: "1px solid rgba(234, 88, 12, 0.3)",
                                        cursor: "pointer",
                                        transition: "all 0.18s ease-in-out",
                                        "&:hover": {
                                          backgroundColor: "rgba(234, 88, 12, 0.22)",
                                          transform: "translateY(-1px)",
                                          boxShadow: "0 2px 6px rgba(234, 88, 12, 0.2)",
                                        },
                                      }}
                                    />
                                  </Tooltip>
                                ) : (
                                  /* Non-Staff: No assigned role (-) */
                                  <Tooltip title="클릭하여 정원지기 임명 및 정원 배정">
                                    <Chip
                                      label="-"
                                      clickable
                                      onClick={() => handleOpenRoleModal(user)}
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        height: 34,
                                        width: 115,
                                        minWidth: 115,
                                        justifyContent: "center",
                                        borderRadius: "10px",
                                        backgroundColor: "#f3f4f6",
                                        color: "#9ca3af",
                                        border: "1px solid rgba(0, 0, 0, 0.08)",
                                        cursor: "pointer",
                                        transition: "all 0.18s ease-in-out",
                                        "&:hover": {
                                          backgroundColor: "#e5e7eb",
                                          color: "#4b5563",
                                          transform: "translateY(-1px)",
                                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                                        },
                                      }}
                                    />
                                  </Tooltip>
                                )}
                              </TableCell>

                              {/* Garden */}
                              <TableCell align="center" sx={{ py: 2, whiteSpace: "nowrap" }}>
                                {user.garden ? (
                                  <Box sx={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", gap: 0.6, maxWidth: 180 }}>
                                    {user.garden
                                      .split(",")
                                      .map((g) => g.trim())
                                      .filter(Boolean)
                                      .map((gardenName) => (
                                        <Chip
                                          key={gardenName}
                                          label={gardenName}
                                          size="small"
                                          clickable
                                          onClick={() => handleOpenRoleModal(user)}
                                          sx={{
                                            fontWeight: 700,
                                            fontSize: "0.8rem",
                                            height: 26,
                                            borderRadius: "8px",
                                            backgroundColor: "rgba(234, 88, 12, 0.08)",
                                            color: "#c2410c",
                                            border: "1px solid rgba(234, 88, 12, 0.25)",
                                            cursor: "pointer",
                                            "&:hover": {
                                              backgroundColor: "rgba(234, 88, 12, 0.18)",
                                              transform: "translateY(-1px)",
                                            },
                                          }}
                                        />
                                      ))}
                                  </Box>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "#bbb", fontWeight: 500, fontSize: "0.9rem" }}
                                  >
                                    -
                                  </Typography>
                                )}
                              </TableCell>

                              {/* Notification Status */}
                              <TableCell align="center" sx={{ py: 2, whiteSpace: "nowrap" }}>
                                {user.hasNotification ? (
                                  <Tooltip title="주일 리마인더 및 교회 소식 알림 수신 가능" arrow>
                                    <Chip
                                      icon={
                                        <NotificationsActiveIcon
                                          sx={{ fontSize: "1rem !important", color: "#16a34a !important" }}
                                        />
                                      }
                                      label="수신중"
                                      size="small"
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: "0.78rem",
                                        height: 28,
                                        borderRadius: "8px",
                                        backgroundColor: "#f0fdf4",
                                        color: "#16a34a",
                                        border: "1px solid #bbf7d0",
                                        px: 0.6,
                                      }}
                                    />
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="등록된 알림 기기가 없습니다" arrow>
                                    <Chip
                                      icon={
                                        <NotificationsOffIcon
                                          sx={{ fontSize: "1rem !important", color: "#9ca3af !important" }}
                                        />
                                      }
                                      label="미등록"
                                      size="small"
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: "0.78rem",
                                        height: 28,
                                        borderRadius: "8px",
                                        backgroundColor: "#f3f4f6",
                                        color: "#6b7280",
                                        border: "1px solid #e5e7eb",
                                        px: 0.6,
                                      }}
                                    />
                                  </Tooltip>
                                )}
                              </TableCell>

                              {/* Delete Action */}
                              <TableCell align="center" sx={{ py: 2 }}>
                                <Tooltip title="계정 삭제">
                                  <span>
                                    <IconButton
                                      size="small"
                                      disabled={isProcessing}
                                      onClick={() => handleOpenDeleteDialog(user)}
                                      sx={{
                                        color: "#ef4444",
                                        "&:hover": {
                                          backgroundColor: "rgba(239, 68, 68, 0.08)",
                                        },
                                      }}
                                    >
                                      <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {filteredUsers.length > 0 && (
                    <TablePagination
                      component="div"
                      count={filteredUsers.length}
                      page={page}
                      onPageChange={(e, newPage) => setPage(newPage)}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                      }}
                      rowsPerPageOptions={[10, 25, 50, 100]}
                      labelRowsPerPage="페이지당 인원:"
                      labelDisplayedRows={({ from, to, count }) =>
                        `${count !== -1 ? count : `더 많은`}명 중 ${from}–${to}`
                      }
                      sx={{
                        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                        px: 2,
                      }}
                    />
                  )}
                </>
              )}
            </Card>
            </>
          )}
        </div>
      </div>

      {/* GardenKeeper Role & Garden Assignment Dialog */}
      <Dialog
        open={roleModalOpen}
        onClose={() => !updatingRole && setRoleModalOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "18px",
            p: 1,
            maxWidth: "500px",
            width: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: userForRoleModal?.isGardenKeeper ? "#c2410c" : "#ea580c",
            pb: 1,
          }}
        >
          <ForestIcon sx={{ color: "#ea580c" }} />
          {userForRoleModal?.isGardenKeeper
            ? "정원지기 담당 정원 관리"
            : "정원지기 임명 및 정원 배정"}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <DialogContentText sx={{ color: "#333", mb: 2.5, lineHeight: 1.6, fontSize: "0.98rem" }}>
            <strong>{userForRoleModal?.name || "선택한 교인"}</strong>(
            {formatPhoneNumber(userForRoleModal?.phone)})님의{" "}
            {userForRoleModal?.isGardenKeeper ? (
              <>담당 정원을 수정하거나 정원지기 역할을 해제할 수 있습니다.</>
            ) : (
              <>정원지기 역할을 부여하고 담당할 정원을 배정합니다.</>
            )}
          </DialogContentText>

          {/* Garden Selection Section */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#444", mb: 1.2 }}>
              담당 정원 선택 (1인 다정원 가능):
            </Typography>
            {availableGardens.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
                {availableGardens.map((gardenName) => {
                  const isSelected = selectedGardens.includes(gardenName);
                  return (
                    <Chip
                      key={gardenName}
                      label={gardenName}
                      clickable
                      onClick={() => handleToggleGarden(gardenName)}
                      icon={
                        isSelected ? (
                          <CheckIcon sx={{ fontSize: "1rem !important", color: "#fff !important" }} />
                        ) : undefined
                      }
                      sx={{
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: "0.88rem",
                        height: 32,
                        borderRadius: "8px",
                        backgroundColor: isSelected ? "#ea580c" : "#f3f4f6",
                        color: isSelected ? "#fff" : "#4b5563",
                        border: isSelected ? "1px solid #c2410c" : "1px solid rgba(0,0,0,0.1)",
                        "&:hover": {
                          backgroundColor: isSelected ? "#c2410c" : "#e5e7eb",
                        },
                      }}
                    />
                  );
                })}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: "#888", mb: 1.5 }}>
                정원 목록을 불러오는 중이거나 없습니다. 아래에서 직접 입력해 주세요.
              </Typography>
            )}

            {/* Custom Garden Direct Input */}
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <TextField
                size="small"
                placeholder="목록에 없는 정원 직접 입력"
                value={customGardenInput}
                onChange={(e) => setCustomGardenInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomGarden();
                  }
                }}
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddCustomGarden}
                disabled={!customGardenInput.trim()}
                sx={{
                  borderColor: "#ea580c",
                  color: "#ea580c",
                  fontWeight: 600,
                  borderRadius: "8px",
                  "&:hover": { borderColor: "#c2410c", backgroundColor: "rgba(234, 88, 12, 0.04)" },
                }}
              >
                추가
              </Button>
            </Stack>

            {/* Selected Gardens Preview */}
            <Box sx={{ mt: 1.5, minHeight: 24 }}>
              {selectedGardens.length > 0 ? (
                <Typography variant="caption" sx={{ color: "#ea580c", fontWeight: 700 }}>
                  선택된 정원 ({selectedGardens.length}개): {selectedGardens.join(", ")}
                </Typography>
              ) : (
                <Typography variant="caption" sx={{ color: "#dc2626", fontWeight: 600 }}>
                  ⚠️ 담당할 정원을 최소 1개 이상 선택해 주세요.
                </Typography>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              p: 2,
              backgroundColor: "rgba(234, 88, 12, 0.06)",
              borderRadius: "12px",
              border: "1px solid rgba(234, 88, 12, 0.2)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#c2410c",
                display: "block",
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              💡 저장 시 해당 교인은 온교회 소그룹 출석 보고서를 제출할 수 있는 권한을 얻게 되며, 매주 일요일 오후 4시 출석 리마인더 알림을 받게 됩니다.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: "space-between" }}>
          {userForRoleModal?.isGardenKeeper ? (
            <Button
              onClick={() => handleSaveRoleAndGardens("remove")}
              disabled={updatingRole}
              color="error"
              sx={{ fontWeight: 600 }}
            >
              정원지기 역할 해제
            </Button>
          ) : (
            <Box />
          )}

          <Stack direction="row" spacing={1}>
            <Button
              onClick={() => setRoleModalOpen(false)}
              disabled={updatingRole}
              sx={{ color: "#666", fontWeight: 600 }}
            >
              취소
            </Button>
            <Button
              onClick={() =>
                handleSaveRoleAndGardens(
                  userForRoleModal?.isGardenKeeper ? "update_gardens" : "assign",
                )
              }
              disabled={updatingRole || selectedGardens.length === 0}
              variant="contained"
              sx={{
                backgroundColor: "#FF6B00",
                fontWeight: 700,
                borderRadius: "20px",
                px: 2.5,
                "&:hover": {
                  backgroundColor: "#e05e00",
                },
              }}
            >
              {updatingRole ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : userForRoleModal?.isGardenKeeper ? (
                "정원 저장"
              ) : (
                "임명하기"
              )}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            p: 1,
            maxWidth: "460px",
            width: "100%",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#dc2626" }}>
          교인 계정 삭제 확인
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#444", mb: 2, lineHeight: 1.6 }}>
            정말로 <strong>{userToDelete?.name || "선택한 교인"}</strong>(
            {formatPhoneNumber(userToDelete?.phone)})의 온교회 계정을 완전히
            삭제하시겠습니까?
          </DialogContentText>
          <Box
            sx={{
              p: 2,
              backgroundColor: "rgba(220, 38, 38, 0.06)",
              borderRadius: "12px",
              border: "1px solid rgba(220, 38, 38, 0.2)",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#b91c1c", display: "block", fontWeight: 600 }}
            >
              ⚠️ 주의: 계정을 삭제하면 해당 교인은 온교회 서비스를 이용할 수 없으며,
              정원지기 권한도 모두 영구 삭제됩니다. 복구가 불가능합니다.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
            sx={{ color: "#666", fontWeight: 600 }}
          >
            취소
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <DeleteOutlineIcon />
              )
            }
            sx={{
              backgroundColor: "#dc2626",
              "&:hover": { backgroundColor: "#b91c1c" },
              borderRadius: "20px",
              px: 2.5,
              fontWeight: 700,
            }}
          >
            {deleting ? "삭제 중..." : "영구 삭제"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MemberManagement;
