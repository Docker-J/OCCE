/**
 * @file MemberManagement.jsx
 * @description 온교회 디지털 교적부 및 정원지기 역할 관리 대시보드
 * 개별 컴포넌트, 커스텀 훅, 풀 CRUD 및 Google Autocomplete 지원
 */

import { useState, useMemo } from "react";
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
import MemberFormModal from "./components/MemberFormModal";
import GardenRoleModal from "./components/GardenRoleModal";
import GardenManagementModal from "./components/GardenManagementModal";
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
  TableSortLabel,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";

import LoginIcon from "@mui/icons-material/Login";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import CourseManagementDashboard from "./components/CourseManagementDashboard";

const MemberManagement = () => {
  const { openModal } = useModals();
  const [adminTab, setAdminTab] = useState(0);
  const [gardenManagementOpen, setGardenManagementOpen] = useState(false);

  // 커스텀 훅에서 상태와 액션 추출
  const { state, actions } = useMemberManagement();
  const {
    authInitialized,
    authenticated,
    admin,
    loading,
    refreshing,
    importing,
    submittingMember,
    searchTerm,
    isSearchPending,
    registrationFilter,
    roleFilter,
    gardenFilter,
    statusFilter,
    notificationFilter,
    page,
    rowsPerPage,
    sortDirection,
    availableGardens,
    availableHouseholds,
    actionLoadingUser,
    users,
    filteredUsers,
    paginatedUsers,
    totalHouseholds,
    metrics,
    memberFormOpen,
    memberForEdit,
    userForRoleModal,
    updatingRole,
    userToDelete,
    deleting,
  } = state;

  const {
    setSearchTerm,
    setRegistrationFilter,
    setRoleFilter,
    setGardenFilter,
    setStatusFilter,
    setNotificationFilter,
    setPage,
    setRowsPerPage,
    setSortDirection,
    handleRequestSort,
    fetchUsers,
    handleOpenCreateModal,
    handleOpenEditModal,
    setMemberFormOpen,
    handleSubmitMemberForm,
    handleSeparateMember,
    setUserForRoleModal,
    handleSaveRoleAndGardens,
    setUserToDelete,
    handleConfirmRemoveStatus,
    handleConfirmPermanentDelete,
    handleImportFromDrive,
    setAvailableGardens,
    refreshGardens,
  } = actions;

  // 수정 대상 교인의 세대 전체 구성원 목록 산출 (세대주 우선 정렬)
  const householdMembersForEdit = useMemo(() => {
    if (!memberForEdit) return [];
    if (!memberForEdit.householdId) return [memberForEdit];
    const list = (users || []).filter(
      (u) =>
        u.householdId === memberForEdit.householdId &&
        (u.status !== "REMOVED" || u.id === memberForEdit.id)
    );
    const order = { HEAD: 1, SPOUSE: 2, CHILD: 3, PARENT: 4, OTHER: 5 };
    list.sort((a, b) => {
      if (a.isHead) return -1;
      if (b.isHead) return 1;
      return (order[a.relationship] || 99) - (order[b.relationship] || 99);
    });
    return list.length > 0 ? list : [memberForEdit];
  }, [memberForEdit, users]);

  // 로그인 모달 동적 로드
  const handleLoginClick = async () => {
    const { default: SignInModal } = await import("../../components/User/SignInModal");
    openModal(SignInModal, {});
  };

  // 커스텀 정원 추가
  const handleAddAvailableGarden = (newGarden) => {
    setAvailableGardens((prev) => {
      const exists = prev.some((g) => g.name === newGarden);
      return exists ? prev : [...prev, { id: newGarden, name: newGarden }];
    });
  };

  return (
    <>
      <title>
        {adminTab === 0
          ? "교적 및 교인 관리 - OCCE"
          : adminTab === 1
          ? "출석 통계 대시보드 - OCCE"
          : "양육 및 교육과정 관리 - OCCE"}
      </title>

      {/* 상단 타이틀 배너 */}
      <div className="title-wrapper" style={TITLE_BG_STYLE}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{ fontWeight: 830, letterSpacing: "0.2em", pl: "0.2em", color: "white" }}
          >
            {adminTab === 0
              ? "통합 교적 및 교인 관리"
              : adminTab === 1
              ? "출석 통계 대시보드"
              : "양육 및 교육과정 관리"}
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
              ? "온교회 세대별 교적부, 웹 가입 상태, 소속 정원 및 알림을 통합 관리합니다."
              : adminTab === 1
              ? "구글 드라이브 주간 출석부의 실시간 출석 현황과 통계를 분석합니다."
              : "교육과정 및 개설 기수별 수강생 등록과 수료 상태를 체계적으로 관리합니다."}
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div
          className="container"
          style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "32px 16px" }}
        >
          {/* 1. 인증 초기화 중 */}
          {!authInitialized ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
              <CircularProgress sx={{ color: "#FF6B00" }} />
            </Box>
          ) : !authenticated ? (
            /* 2. 미로그인 상태 안내 */
            <Card
              sx={{
                maxWidth: 520,
                mx: "auto",
                mt: 4,
                borderRadius: "20px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
                textAlign: "center",
                p: 5,
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#111" }}>
                  로그인이 필요합니다
                </Typography>
                <Typography variant="body1" sx={{ color: "#666", mb: 4, lineHeight: 1.6 }}>
                  교인 관리 대시보드는 온교회 관리자(스태프) 전용 공간입니다.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LoginIcon />}
                  onClick={handleLoginClick}
                  sx={{
                    backgroundColor: "#FF6B00",
                    "&:hover": { backgroundColor: "#e65100" },
                    borderRadius: "24px",
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                  }}
                >
                  스태프 로그인
                </Button>
              </CardContent>
            </Card>
          ) : !admin ? (
            /* 3. 권한 부족 안내 */
            <Card
              sx={{
                maxWidth: 520,
                mx: "auto",
                mt: 4,
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
                  label="통합 교적부 관리"
                  icon={<PeopleIcon sx={{ fontSize: "1.2rem" }} />}
                  iconPosition="start"
                />
                <Tab
                  label="출석 통계 대시보드"
                  icon={<BarChartIcon sx={{ fontSize: "1.2rem" }} />}
                  iconPosition="start"
                />
                <Tab
                  label="양육·훈련 과정 관리"
                  icon={<SchoolIcon sx={{ fontSize: "1.2rem" }} />}
                  iconPosition="start"
                />
              </Tabs>

              {/* Tab 0: 통합 교적부 관리 */}
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
                    registrationFilter={registrationFilter}
                    onRegistrationFilterChange={setRegistrationFilter}
                    roleFilter={roleFilter}
                    onRoleFilterChange={setRoleFilter}
                    gardenFilter={gardenFilter}
                    onGardenFilterChange={setGardenFilter}
                    availableGardens={availableGardens}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    notificationFilter={notificationFilter}
                    onNotificationFilterChange={setNotificationFilter}
                    sortDirection={sortDirection}
                    onSortDirectionChange={setSortDirection}
                    onRefresh={() => fetchUsers(true)}
                    loading={loading}
                    refreshing={refreshing}
                    onOpenCreateModal={handleOpenCreateModal}
                    onOpenGardenManagement={() => setGardenManagementOpen(true)}
                    onImportFromDrive={handleImportFromDrive}
                    importing={importing}
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
                        교적 목록을 불러오고 있습니다...
                      </Typography>
                    </Box>
                  ) : filteredUsers.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography variant="body1" sx={{ color: "#888", fontWeight: 500 }}>
                        {searchTerm ||
                        registrationFilter !== "all" ||
                        roleFilter !== "all" ||
                        gardenFilter !== "all" ||
                        statusFilter !== "active" ||
                        notificationFilter !== "all"
                          ? "검색 조건에 일치하는 교인이 없습니다."
                          : "등록된 교인이 없습니다. [+ 새 교인 등록] 버튼으로 첫 교인을 등록해 보세요."}
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <TableContainer
                        component={Box}
                        sx={{
                          opacity: isSearchPending ? 0.6 : 1,
                          transition: "opacity 0.15s ease",
                          maxHeight: "calc(100vh - 280px)",
                          minHeight: 420,
                          overflow: "auto",
                        }}
                      >
                        <Table stickyHeader sx={{ minWidth: 850 }} aria-label="교적부 목록 테이블">
                          <TableHead
                            sx={{
                              "& th": {
                                backgroundColor: "#f8fafc !important",
                                zIndex: 2,
                                borderBottom: "2px solid #e2e8f0",
                              },
                            }}
                          >
                            <TableRow>
                              <TableCell sx={{ fontWeight: 700, color: "#555", py: 1.8 }}>
                                <Tooltip title="세대주 이름을 기준으로 가정을 묶어 정렬합니다.">
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
                                    세대주 및 교인 (가정별)
                                  </TableSortLabel>
                                </Tooltip>
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
                                직분 / 세례
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
                                웹 가입
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
                                알림
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {paginatedUsers.map((user) => (
                              <MemberTableRow
                                key={user.id ? `member_${user.id}` : user.username}
                                user={user}
                                isProcessing={actionLoadingUser === user.username}
                                onOpenRoleModal={(u) => setUserForRoleModal(u)}
                                onOpenEditModal={(u) => handleOpenEditModal(u)}
                              />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {/* 테이블 하단 요약 정보 바 */}
                      <Box
                        sx={{
                          py: 1.5,
                          px: 2.5,
                          backgroundColor: "#f8fafc",
                          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#475569", fontWeight: 600, fontSize: "0.85rem" }}>
                          총 <strong>{totalHouseholds}</strong>세대{" "}
                          <span style={{ color: "#94a3b8", fontWeight: 500, marginLeft: 4 }}>
                            (교인 {paginatedUsers.length}명 표시 중)
                          </span>
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                          목록을 스크롤하여 전체 교적을 연속으로 탐색할 수 있습니다
                        </Typography>
                      </Box>
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

              {/* Tab 2: 양육·훈련 과정 및 기수 관리 */}
              {adminTab === 2 && (
                <Box>
                  <CourseManagementDashboard users={users} />
                </Box>
              )}
            </>
          )}
        </div>
      </div>

      {/* 새 교인 등록 및 정보 수정 통합 모달 */}
      <MemberFormModal
        open={memberFormOpen}
        onClose={() => !submittingMember && setMemberFormOpen(false)}
        onSubmit={handleSubmitMemberForm}
        initialData={memberForEdit}
        householdMembers={householdMembersForEdit}
        availableGardens={availableGardens}
        availableHouseholds={availableHouseholds}
        isSubmitting={submittingMember}
        onOpenDeleteDialog={(u) => {
          setMemberFormOpen(false);
          setUserToDelete(u);
        }}
        onSeparateMember={handleSeparateMember}
      />

      {/* 정원지기 역할 모달 */}
      <GardenRoleModal
        open={Boolean(userForRoleModal)}
        user={userForRoleModal}
        availableGardens={availableGardens.map((g) => g.name || g)}
        updatingRole={updatingRole}
        onClose={() => !updatingRole && setUserForRoleModal(null)}
        onSave={handleSaveRoleAndGardens}
        onAddAvailableGarden={handleAddAvailableGarden}
      />

      {/* 정원(목장) 목록 관리 모달 */}
      <GardenManagementModal
        open={gardenManagementOpen}
        onClose={() => setGardenManagementOpen(false)}
        members={users}
        onGardensUpdated={() => {
          refreshGardens();
          fetchUsers();
        }}
      />

      {/* 제적 및 계정 삭제 모달 */}
      <DeleteConfirmModal
        open={Boolean(userToDelete)}
        user={userToDelete}
        familyMembers={
          userToDelete?.householdId
            ? (users || []).filter(
                (u) =>
                  u.householdId === userToDelete.householdId &&
                  u.id !== userToDelete.id &&
                  u.status !== "REMOVED"
              )
            : []
        }
        deleting={deleting}
        onClose={() => !deleting && setUserToDelete(null)}
        onConfirmRemoveStatus={handleConfirmRemoveStatus}
        onConfirmPermanentDelete={handleConfirmPermanentDelete}
      />
    </>
  );
};

export default MemberManagement;
