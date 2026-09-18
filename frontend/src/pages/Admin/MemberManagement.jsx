/**
 * @file MemberManagement.jsx
 * @description 온교회 교인 계정 및 정원지기 역할 관리 대시보드
 * 개별 컴포넌트, 커스텀 훅, 유틸리티 분리 구조 적용
 */

import { useState } from "react";
import { Link } from "react-router";
import useModals from "../../util/useModal";
import AttendanceDashboard from "./AttendanceDashboard";

// 커스텀 훅 & 유틸
import { useMemberManagement } from "./hooks/useMemberManagement";
import { TITLE_BG_STYLE } from "./utils/memberUtils";

// 분리된 하위 컴포넌트들
import MemberStats from "./components/MemberStats";
import MemberFilterToolbar from "./components/MemberFilterToolbar";
import MemberTableRow from "./components/MemberTableRow";
import GardenRoleModal from "./components/GardenRoleModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TablePagination,
  TableSortLabel,
  Tabs,
  Tab,
} from "@mui/material";

import LoginIcon from "@mui/icons-material/Login";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";

const MemberManagement = () => {
  const { openModal } = useModals();
  const [adminTab, setAdminTab] = useState(0);

  // 커스텀 훅에서 상태와 액션 추출
  const { state, actions } = useMemberManagement();
  const {
    authInitialized,
    authenticated,
    admin,
    loading,
    refreshing,
    searchTerm,
    isSearchPending,
    roleFilter,
    gardenFilter,
    notificationFilter,
    page,
    rowsPerPage,
    sortDirection,
    availableGardens,
    actionLoadingUser,
    filteredUsers,
    paginatedUsers,
    metrics,
    userForRoleModal,
    updatingRole,
    userToDelete,
    deleting,
  } = state;

  const {
    setSearchTerm,
    setRoleFilter,
    setGardenFilter,
    setNotificationFilter,
    setPage,
    setRowsPerPage,
    setSortDirection,
    handleRequestSort,
    fetchUsers,
    setUserForRoleModal,
    handleSaveRoleAndGardens,
    setUserToDelete,
    handleConfirmDelete,
    setAvailableGardens,
  } = actions;

  // 로그인 모달 동적 로드
  const handleLoginClick = async () => {
    const { default: SignInModal } = await import("../../components/User/SignInModal");
    openModal(SignInModal, {});
  };

  // 커스텀 정원 추가
  const handleAddAvailableGarden = (newGarden) => {
    setAvailableGardens((prev) => (prev.includes(newGarden) ? prev : [...prev, newGarden].sort()));
  };

  return (
    <>
      <title>{adminTab === 0 ? "교인 관리 대시보드 - OCCE" : "출석 통계 대시보드 - OCCE"}</title>

      {/* 상단 타이틀 배너 */}
      <div className="title-wrapper" style={TITLE_BG_STYLE}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{ fontWeight: 830, letterSpacing: "0.2em", pl: "0.2em", color: "white" }}
          >
            {adminTab === 0 ? "교인 관리 대시보드" : "출석 통계 대시보드"}
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
            {adminTab === 0
              ? "온교회 등록 교인 계정 및 정원지기 역할을 관리합니다."
              : "구글 드라이브 주간 출석부의 실시간 출석 현황과 통계를 분석합니다."}
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div
          className="container"
          style={{ maxWidth: "1100px", width: "100%", margin: "0 auto", padding: "32px 16px" }}
        >
          {/* 1. 인증 초기화 중 */}
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
            /* 2. 비로그인 사용자 */
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
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#dc2626" }}>
                  로그인이 필요한 서비스입니다
                </Typography>
                <Typography variant="body1" sx={{ color: "#555", mb: 4, lineHeight: 1.6 }}>
                  교인 관리 대시보드는 온교회 스태프(Staff) 권한을 가진 계정만 접근하실 수 있습니다.
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
            /* 3. 스태프 권한 없는 사용자 */
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
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#dc2626" }}>
                  접근 권한이 없습니다
                </Typography>
                <Typography variant="body1" sx={{ color: "#555", mb: 4, lineHeight: 1.6 }}>
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
            /* 4. 인증된 스태프 화면 */
            <>
              {/* 대시보드 탭 */}
              <Tabs
                value={adminTab}
                onChange={(e, val) => setAdminTab(val)}
                sx={{ mb: 3.5, borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}
              >
                <Tab
                  label="교인 계정 관리"
                  icon={<PeopleIcon sx={{ fontSize: "1.2rem" }} />}
                  iconPosition="start"
                />
                <Tab
                  label="출석 통계 대시보드"
                  icon={<BarChartIcon sx={{ fontSize: "1.2rem" }} />}
                  iconPosition="start"
                />
              </Tabs>

              {/* Tab 0: 교인 계정 관리 */}
              <Box sx={{ display: adminTab === 0 ? "block" : "none" }}>
                {/* 1) 4대 통계 요약 카드 */}
                <MemberStats metrics={metrics} />

                {/* 2) 메인 테이블 카드 */}
                <Card
                  sx={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.04)",
                    overflow: "hidden",
                  }}
                >
                  {/* 검색 및 필터 툴바 */}
                  <MemberFilterToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    roleFilter={roleFilter}
                    onRoleFilterChange={setRoleFilter}
                    gardenFilter={gardenFilter}
                    onGardenFilterChange={setGardenFilter}
                    availableGardens={availableGardens}
                    notificationFilter={notificationFilter}
                    onNotificationFilterChange={setNotificationFilter}
                    sortDirection={sortDirection}
                    onSortDirectionChange={setSortDirection}
                    onRefresh={() => fetchUsers(true)}
                    loading={loading}
                    refreshing={refreshing}
                  />

                  {/* 테이블 본문 */}
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
                        {searchTerm ||
                        roleFilter !== "all" ||
                        gardenFilter !== "all" ||
                        notificationFilter !== "all"
                          ? "검색 조건에 일치하는 교인이 없습니다."
                          : "등록된 교인이 없습니다."}
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <TableContainer
                        component={Box}
                        sx={{
                          opacity: isSearchPending ? 0.6 : 1,
                          transition: "opacity 0.15s ease",
                        }}
                      >
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
                              <TableCell
                                sx={{
                                  fontWeight: 700,
                                  color: "#555",
                                  py: 1.8,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                연락처
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: 700,
                                  color: "#555",
                                  py: 1.8,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                역할
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: 700,
                                  color: "#555",
                                  py: 1.8,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                정원
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: 700,
                                  color: "#555",
                                  py: 1.8,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                알림
                              </TableCell>
                              <TableCell align="center" sx={{ fontWeight: 700, color: "#555", py: 1.8 }}>
                                관리
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {paginatedUsers.map((user) => (
                              <MemberTableRow
                                key={user.username}
                                user={user}
                                isProcessing={actionLoadingUser === user.username}
                                onOpenRoleModal={(u) => setUserForRoleModal(u)}
                                onOpenDeleteDialog={(u) => setUserToDelete(u)}
                              />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {/* 페이지네이션 */}
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
                          `${count !== -1 ? count : "더 많은"}명 중 ${from}–${to}`
                        }
                        sx={{ borderTop: "1px solid rgba(0, 0, 0, 0.08)", px: 2 }}
                      />
                    </>
                  )}
                </Card>
              </Box>

              {/* Tab 1: 출석 통계 대시보드 */}
              {adminTab === 1 && (
                <Box>
                  <AttendanceDashboard />
                </Box>
              )}
            </>
          )}
        </div>
      </div>

      {/* 정원지기 역할 모달 (선택 상태 격리) */}
      <GardenRoleModal
        open={Boolean(userForRoleModal)}
        user={userForRoleModal}
        availableGardens={availableGardens}
        updatingRole={updatingRole}
        onClose={() => !updatingRole && setUserForRoleModal(null)}
        onSave={handleSaveRoleAndGardens}
        onAddAvailableGarden={handleAddAvailableGarden}
      />

      {/* 계정 삭제 모달 */}
      <DeleteConfirmModal
        open={Boolean(userToDelete)}
        user={userToDelete}
        deleting={deleting}
        onClose={() => !deleting && setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default MemberManagement;
