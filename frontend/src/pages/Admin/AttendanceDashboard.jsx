/**
 * @file AttendanceDashboard.jsx
 * @description 구글 드라이브 주간 출석부 실시간 출석 현황 및 통계 대시보드
 * React 19 Context Provider (AttendanceDashboardProvider) 합성 구조 적용
 */

import { Box, Typography, CircularProgress, Alert, Button } from "@mui/material";
import GardenAttendanceDetailModal from "./GardenAttendanceDetailModal";

// Context Provider
import {
  AttendanceDashboardProvider,
  useAttendanceDashboardContext,
} from "./AdminDashboardContexts";

// 분리된 하위 컴포넌트들
import AttendanceWeekNavigator from "./components/AttendanceWeekNavigator";
import AttendanceSummaryCards from "./components/AttendanceSummaryCards";
import AttendanceTrendChart from "./components/AttendanceTrendChart";
import GardenAttendanceTable from "./components/GardenAttendanceTable";
import OCCEErrorBoundary from "../../common/OCCEErrorBoundary";

const AttendanceDashboardContent = () => {
  const { state, actions } = useAttendanceDashboardContext();

  const {
    loading,
    data,
    selectedDate,
    errorMsg,
    detailModalOpen,
    selectedGardenForDetail,
    sortedGardenStats,
    trend,
  } = state;

  const { fetchData, handleCloseDetailModal } = actions;

  // 1. 초기 데이터 로딩 중
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

  // 2. 초기 데이터 로드 에러
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

  return (
    <Box sx={{ pb: 4 }}>
      {/* 1. 주차 선택 및 새로고침 툴바 */}
      <AttendanceWeekNavigator />

      {/* 2. 상단 4대 요약 카드 */}
      <AttendanceSummaryCards />

      {/* 3. 최근 주차별 출석 추이 막대 차트 */}
      <OCCEErrorBoundary
        title="출석 통계 차트를 불러오는 중 오류가 발생했습니다"
        resetKeys={[trend, selectedDate]}
        onReset={() => fetchData(true)}
      >
        <AttendanceTrendChart />
      </OCCEErrorBoundary>

      {/* 4. 정원별 출석 현황 테이블 */}
      <OCCEErrorBoundary
        title="정원별 출석 현황 테이블을 불러오는 중 오류가 발생했습니다"
        resetKeys={[sortedGardenStats, selectedDate]}
        onReset={() => fetchData(true)}
      >
        <GardenAttendanceTable />
      </OCCEErrorBoundary>

      {/* 5. 정원별 상세 출석 팝업 모달 */}
      <GardenAttendanceDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        gardenName={selectedGardenForDetail}
        date={selectedDate}
      />
    </Box>
  );
};

const AttendanceDashboard = () => (
  <AttendanceDashboardProvider>
    <AttendanceDashboardContent />
  </AttendanceDashboardProvider>
);

export default AttendanceDashboard;
