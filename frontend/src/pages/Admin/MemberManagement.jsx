/**
 * @file MemberManagement.jsx
 * @description 온교회 교인 계정 및 정원지기 역할 관리 대시보드
 * 개별 컴포넌트, 커스텀 훅, 유틸리티 분리 구조 적용
 */

import { useState } from "react";
import { Link } from "react-router";

// 커스텀 훅 & 유틸
import { useMemberManagement } from "./hooks/useMemberManagement";
import { TITLE_BG_STYLE } from "./utils/memberUtils";
import ProtectedRoute from "../../common/ProtectedRoute";

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
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const MemberManagement = () => {
  // 커스텀 훅에서 상태와 액션 추출
  const { state, actions } = useMemberManagement();
  const {
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

  // 커스텀 정원 추가
  const handleAddAvailableGarden = (newGarden) => {
    setAvailableGardens((prev) => (prev.includes(newGarden) ? prev : [...prev, newGarden].sort()));
  };

  return (
    <>
      <title>교인 계정 관리 - OCCE</title>

      {/* 상단 타이틀 배너 */}
      <div className="title-wrapper" style={TITLE_BG_STYLE}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{ fontWeight: 830, letterSpacing: "0.2em", pl: "0.2em", color: "white" }}
          >
            교인 계정 관리
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
          style={{ maxWidth: "1100px", width: "100%", margin: "0 auto", padding: "32px 16px" }}
        >
          {/* 상단 네비게이션: 대시보드 홈으로 이동 */}
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Button
              component={Link}
              to="/admin"
              startIcon={<ArrowBackIcon />}
              sx={{
                color: "#64748b",
                fontWeight: 700,
                fontSize: "0.9rem",
                "&:hover": { color: "#FF6B00", backgroundColor: "rgba(255, 107, 0, 0.05)" },
              }}
            >
              관리자 대시보드 홈
            </Button>
          </Box>
          <ProtectedRoute requiredRole="admin">
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
          </ProtectedRoute>
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
