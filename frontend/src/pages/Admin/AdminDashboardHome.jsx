/**
 * @file AdminDashboardHome.jsx
 * @description 온교회 통합 행정 & 정원지기 대시보드 홈 (포털 허브)
 * - 상단 히어로 배너 (title-wrapper) 적용으로 통일된 OCCE 레이아웃 유지
 * - 스태프(Staff) 및 정원지기(GardenKeeper) 역할별 맞춤형 바로가기 카드 제공
 * - 모바일 친화적 반응형 그리드 및 부드러운 호버 모션
 */

import { Link, useNavigate } from "react-router";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";

// Icons
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginIcon from "@mui/icons-material/Login";

import useAuthStore from "../../store/useAuthStore";
import useModals from "../../util/useModal";
import { TITLE_BG_STYLE } from "./utils/memberUtils";

export default function AdminDashboardHome() {
  const navigate = useNavigate();
  const { openModal } = useModals();

  const authenticated = useAuthStore((state) => state.authenticated);
  const authInitialized = useAuthStore((state) => state.authInitialized);
  const admin = useAuthStore((state) => state.admin);
  const isLeader = useAuthStore((state) => state.isLeader);

  const handleLoginClick = async () => {
    const { default: SignInModal } = await import("../../components/User/SignInModal");
    openModal(SignInModal, {});
  };

  // 관리자(Staff) 전용 카드 목록
  const adminCards = [
    {
      id: "members",
      title: "교인 계정 관리",
      engTitle: "Member Account Management",
      description: "온교회 웹 등록 교인 계정 목록, 정원지기 역할 및 관리자 권한을 설정합니다.",
      path: "/admin/members",
      icon: <PeopleAltOutlinedIcon sx={{ fontSize: "1.8rem" }} />,
      tag: "스태프 전용",
      themeColor: "#2563eb",
      bgColor: "#eff6ff",
      borderColor: "#bfdbfe",
      actionText: "계정 관리하기",
    },
    {
      id: "attendance",
      title: "출석 통계 대시보드",
      engTitle: "Weekly Attendance Analytics",
      description: "구글 드라이브 주간 출석부의 실시간 출석 현황, 주차별 출석률 및 정원별 상세 내역을 분석합니다.",
      path: "/admin/attendance",
      icon: <BarChartOutlinedIcon sx={{ fontSize: "1.8rem" }} />,
      tag: "스태프 & 정원지기",
      themeColor: "#FF6B00",
      bgColor: "#fff7ed",
      borderColor: "#fed7aa",
      actionText: "대시보드 보기",
    },
    {
      id: "sunday-report",
      title: "주일 출석 보고하기",
      engTitle: "Sunday Attendance Report",
      description: "주일 예배 후 각 정원별 주일 출석 현황을 보고서 양식에 맞추어 제출합니다.",
      path: "/community/smallgroup/report?type=sunday",
      icon: <AssignmentTurnedInIcon sx={{ fontSize: "1.8rem" }} />,
      tag: "출석 보고",
      themeColor: "#dc2626",
      bgColor: "#fef2f2",
      borderColor: "#fecaca",
      actionText: "보고서 작성하기",
    },
    {
      id: "gathering-report",
      title: "정원 모임 보고하기",
      engTitle: "Garden Gathering Report",
      description: "정원 모임(나눔) 진행 후 모임 일시, 장소, 참석자 및 나눔 내용을 보고합니다.",
      path: "/community/smallgroup/report?type=gathering",
      icon: <AssignmentTurnedInIcon sx={{ fontSize: "1.8rem" }} />,
      tag: "정원 모임",
      themeColor: "#ea580c",
      bgColor: "#fff7ed",
      borderColor: "#fed7aa",
      actionText: "보고서 작성하기",
    },
  ];

  // 정원지기(GardenKeeper) 전용 카드 목록
  const leaderCards = [
    {
      id: "attendance",
      title: "출석 통계 대시보드",
      engTitle: "Weekly Attendance Analytics",
      description: "구글 드라이브 주간 출석부의 실시간 출석 현황, 주차별 출석률 및 정원별 상세 출석 현황을 확인합니다.",
      path: "/admin/attendance",
      icon: <BarChartOutlinedIcon sx={{ fontSize: "1.8rem" }} />,
      tag: "출석 분석",
      themeColor: "#FF6B00",
      bgColor: "#fff7ed",
      borderColor: "#fed7aa",
      actionText: "대시보드 보기",
    },
    {
      id: "sunday-report",
      title: "주일 출석 보고하기",
      engTitle: "Sunday Attendance Report",
      description: "주일 예배 후 담당 정원의 주일 출석 현황을 간편하게 제출합니다.",
      path: "/community/smallgroup/report?type=sunday",
      icon: <AssignmentTurnedInIcon sx={{ fontSize: "1.8rem" }} />,
      tag: "주일 보고",
      themeColor: "#dc2626",
      bgColor: "#fef2f2",
      borderColor: "#fecaca",
      actionText: "보고서 작성하기",
    },
    {
      id: "gathering-report",
      title: "정원 모임 보고하기",
      engTitle: "Garden Gathering Report",
      description: "주중 또는 주일 정원 모임(나눔) 후 출석 및 나눔 내용을 제출합니다.",
      path: "/community/smallgroup/report?type=gathering",
      icon: <AssignmentTurnedInIcon sx={{ fontSize: "1.8rem" }} />,
      tag: "모임 보고",
      themeColor: "#ea580c",
      bgColor: "#fff7ed",
      borderColor: "#fed7aa",
      actionText: "보고서 작성하기",
    },
  ];

  const cards = admin ? adminCards : leaderCards;

  return (
    <>
      <title>{admin ? "관리자 대시보드 - OCCE" : "정원지기 대시보드 - OCCE"}</title>

      {/* 상단 타이틀 배너 */}
      <div className="title-wrapper" style={TITLE_BG_STYLE}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{ fontWeight: 830, letterSpacing: "0.2em", pl: "0.2em", color: "white" }}
          >
            {admin ? "온교회 행정 관리자 대시보드" : "정원지기 대시보드"}
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
            {admin
              ? "온교회 교인 계정 및 정원 행정을 통합 관리하는 관리자 포털입니다."
              : "정원 출석 보고 및 실시간 통계를 확인하고 관리하는 허브입니다."}
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
                  본 대시보드는 온교회 스태프(Staff) 및 정원지기(GardenKeeper) 권한 보유자 전용 포털입니다.
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
                  본 페이지는 온교회 스태프(Staff) 및 정원지기(GardenKeeper) 전용 대시보드입니다.
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
            <Box sx={{ pb: 4 }}>
              {/* 환영 안내 박스 */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
                  {admin ? "온교회 행정 관리 포털" : "정원지기 대시보드"}
                </Typography>
                <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500 }}>
                  원하시는 메뉴를 선택하여 이동해 주세요.
                </Typography>
              </Box>

              {/* 주요 서비스 바로가기 카드 Grid */}
              <Grid container spacing={3}>
                {cards.map((m) => (
                  <Grid size={{ xs: 12, sm: admin ? 6 : 12, md: admin ? 6 : 4 }} key={m.id}>
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: "20px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                          borderColor: m.borderColor,
                        },
                      }}
                    >
                      <CardActionArea
                        onClick={() => navigate(m.path)}
                        sx={{
                          p: 3.5,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: "16px",
                              backgroundColor: m.bgColor,
                              color: m.themeColor,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {m.icon}
                          </Box>
                          <Chip
                            label={m.tag}
                            size="small"
                            sx={{
                              backgroundColor: m.bgColor,
                              color: m.themeColor,
                              fontWeight: 800,
                              fontSize: "0.75rem",
                              borderRadius: "8px",
                            }}
                          />
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 0.4 }}>
                          {m.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#94a3b8", display: "block", mb: 1.5, fontWeight: 600 }}
                        >
                          {m.engTitle}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "#475569", lineHeight: 1.5, minHeight: 42, mb: 2 }}
                        >
                          {m.description}
                        </Typography>

                        <Divider sx={{ my: 1.5, borderColor: "#f1f5f9" }} />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              color: m.themeColor,
                              fontWeight: 800,
                              fontSize: "0.85rem",
                            }}
                          >
                            {m.actionText} <ArrowForwardIcon sx={{ fontSize: "1rem" }} />
                          </Box>
                        </Box>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </div>
      </div>
    </>
  );
}
