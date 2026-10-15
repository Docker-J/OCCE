/**
 * @file AttendanceDashboardPage.jsx
 * @description 출석 통계 대시보드 독립 페이지
 * 스태프(Staff) 및 정원지기(GardenKeeper) 모두 접근 가능
 */

import { Link } from "react-router";
import { Typography, Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import useAuthStore from "../../store/useAuthStore";
import ProtectedRoute from "../../common/ProtectedRoute";
import AttendanceDashboard from "./AttendanceDashboard";
import { TITLE_BG_STYLE } from "./utils/memberUtils";

const AttendanceDashboardPage = () => {
  const admin = useAuthStore((state) => state.admin);

  return (
    <>
      <title>출석 통계 대시보드 - OCCE</title>

      {/* 상단 타이틀 배너 */}
      <div className="title-wrapper" style={TITLE_BG_STYLE}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{ fontWeight: 830, letterSpacing: "0.2em", pl: "0.2em", color: "white" }}
          >
            출석 통계 대시보드
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
            구글 드라이브 주간 출석부의 실시간 출석 현황과 통계를 분석합니다.
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
              {admin ? "관리자 대시보드 홈" : "정원지기 대시보드 홈"}
            </Button>
          </Box>

          <ProtectedRoute requiredRole="leader">
            <AttendanceDashboard />
          </ProtectedRoute>
        </div>
      </div>
    </>
  );
};

export default AttendanceDashboardPage;
