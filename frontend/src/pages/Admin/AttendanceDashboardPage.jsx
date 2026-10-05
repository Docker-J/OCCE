/**
 * @file AttendanceDashboardPage.jsx
 * @description 출석 통계 대시보드 독립 페이지
 * 스태프(Staff) 및 정원지기(GardenKeeper) 모두 접근 가능
 */

import { Link } from "react-router";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LoginIcon from "@mui/icons-material/Login";
import DashboardIcon from "@mui/icons-material/Dashboard";

import useAuthStore from "../../store/useAuthStore";
import useModals from "../../util/useModal";
import AttendanceDashboard from "./AttendanceDashboard";
import { TITLE_BG_STYLE } from "./utils/memberUtils";

const AttendanceDashboardPage = () => {
  const { openModal } = useModals();

  const authInitialized = useAuthStore((state) => state.authInitialized);
  const authenticated = useAuthStore((state) => state.authenticated);
  const isLeader = useAuthStore((state) => state.isLeader);
  const admin = useAuthStore((state) => state.admin);

  const handleLoginClick = async () => {
    const { default: SignInModal } = await import("../../components/User/SignInModal");
    openModal(SignInModal, {});
  };

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
                  출석 통계 대시보드는 온교회 스태프 및 정원지기 권한을 가진 계정만 접근하실 수 있습니다.
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
          ) : !isLeader ? (
            /* 3. 권한 없는 사용자 (일반 회원) */
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
                  본 페이지는 온교회 스태프(Staff) 및 정원지기(GardenKeeper) 권한 보유자 전용 대시보드입니다.
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
            /* 4. 인증된 스태프/정원지기 화면 */
            <AttendanceDashboard />
          )}
        </div>
      </div>
    </>
  );
};

export default AttendanceDashboardPage;
