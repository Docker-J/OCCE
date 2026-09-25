/**
 * @file AdminDashboardHome.jsx
 * @description 온교회 통합 행정 관리자 대시보드 홈 (포털 허브)
 * - 4대 행정 영역(교적부, 출석 통계, 정원 관리, 양육·훈련) 바로가기 카드
 * - 실시간 핵심 지표 퀵 브리핑 (전체 교인, 가구수, 정원수, 양육 현황)
 * - 모바일 친화적 반응형 레이아웃 및 원클릭 네비게이션
 */

import { useState, useEffect } from "react";
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
import ForestOutlinedIcon from "@mui/icons-material/ForestOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import LoginIcon from "@mui/icons-material/Login";

import useAuthStore from "../../store/useAuthStore";
import useModals from "../../util/useModal";
import { getAdminUsers, getAdminGardens, getCourses } from "../../api/admin";

export default function AdminDashboardHome() {
  const navigate = useNavigate();
  const { openModal } = useModals();
  const authenticated = useAuthStore((state) => state.authenticated);
  const authInitialized = useAuthStore((state) => state.authInitialized);
  const admin = useAuthStore((state) => state.admin);

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalMembers: 0,
    registeredMembers: 0,
    totalHouseholds: 0,
    totalGardens: 0,
    totalCourses: 0,
  });

  const fetchOverviewData = async () => {
    if (!authenticated || !admin) return;
    setLoading(true);
    try {
      const [usersData, gardensData, coursesData] = await Promise.all([
        getAdminUsers().catch(() => ({})),
        getAdminGardens().catch(() => ({ gardens: [] })),
        getCourses().catch(() => ({ courses: [] })),
      ]);

      const members = usersData?.members || usersData?.users || [];
      const activeMembers = members.filter((m) => m.status !== "REMOVED");
      const householdsSet = new Set(activeMembers.map((m) => m.householdId).filter(Boolean));

      setMetrics({
        totalMembers: activeMembers.length || usersData?.total || 0,
        registeredMembers: activeMembers.filter((m) => m.isRegistered).length || usersData?.registeredCount || 0,
        totalHouseholds: householdsSet.size || usersData?.householdCount || 0,
        totalGardens: gardensData?.gardens?.filter((g) => g.id !== 1)?.length || 0,
        totalCourses: coursesData?.courses?.length || 0,
      });
    } catch (err) {
      console.error("fetchOverviewData error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authInitialized && authenticated && admin) {
      fetchOverviewData();
    } else if (authInitialized) {
      setLoading(false);
    }
  }, [authInitialized, authenticated, admin]);

  // 1. 인증 초기화 중
  if (!authInitialized) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress sx={{ color: "#FF6B00" }} />
      </Box>
    );
  }

  // 2. 비로그인 상태
  if (!authenticated) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", my: 10, px: 3, textAlign: "center" }}>
        <Card sx={{ borderRadius: "24px", p: 5, boxShadow: "0 10px 40px rgba(0,0,0,0.06)" }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: "#1e293b" }}>
            관리자 인증 필요
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mb: 4, lineHeight: 1.6 }}>
            온교회 행정 대시보드에 접근하려면 스태프 계정으로 로그인이 필요합니다.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            onClick={async () => {
              const { default: SignInModal } = await import("../../components/User/SignInModal");
              openModal(SignInModal, {});
            }}
            sx={{
              backgroundColor: "#FF6B00",
              "&:hover": { backgroundColor: "#e65100" },
              borderRadius: "14px",
              px: 4,
              py: 1.4,
              fontWeight: 800,
            }}
          >
            로그인하기
          </Button>
        </Card>
      </Box>
    );
  }

  // 3. 비관리자 권한
  if (!admin) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", my: 10, px: 3, textAlign: "center" }}>
        <Card sx={{ borderRadius: "24px", p: 5, boxShadow: "0 10px 40px rgba(0,0,0,0.06)" }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: "#dc2626" }}>
            접근 권한이 없습니다
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mb: 4, lineHeight: 1.6 }}>
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
              borderRadius: "14px",
              px: 4,
              py: 1.4,
              fontWeight: 800,
            }}
          >
            홈으로 이동
          </Button>
        </Card>
      </Box>
    );
  }

  // 4대 서비스 카드 메타데이터
  const MODULE_CARDS = [
    {
      id: "members",
      title: "교인 및 교적부 관리",
      engTitle: "Member & Household Directory",
      description: "전체 등록 교인 명부 조회, 세대 분가 및 합가, 신규 교인 등록, 엑셀 연동",
      icon: <PeopleAltOutlinedIcon sx={{ fontSize: "2.2rem" }} />,
      themeColor: "#2563eb",
      bgColor: "#eff6ff",
      borderColor: "#bfdbfe",
      path: "/admin/members",
      tag: "교적부",
      statsText: `등록 교인 ${metrics.totalMembers}명 · ${metrics.totalHouseholds}가구`,
    },
    {
      id: "attendance",
      title: "출석 통계 및 보고서",
      engTitle: "Attendance & Ministry Stats",
      description: "주일 예배 및 정원(목장)별 주차별 출석 추이 그래프, 정원 보고 현황 점검",
      icon: <BarChartOutlinedIcon sx={{ fontSize: "2.2rem" }} />,
      themeColor: "#059669",
      bgColor: "#ecfdf5",
      borderColor: "#a7f3d0",
      path: "/admin/attendance",
      tag: "출석 관리",
      statsText: "주차별 출석 통계 & 미보고 정원 확인",
    },
    {
      id: "gardens",
      title: "정원(소그룹) 관리",
      engTitle: "Garden (Small Group) Management",
      description: "18개 정원 마스터 목록 관리, 정원지기 및 부정원지기 배정, 소속 가구 명부",
      icon: <ForestOutlinedIcon sx={{ fontSize: "2.2rem" }} />,
      themeColor: "#0284c7",
      bgColor: "#f0f9ff",
      borderColor: "#bae6fd",
      path: "/admin/gardens",
      tag: "소그룹",
      statsText: `운영 정원 ${metrics.totalGardens}개 (장년/청년)`,
    },
    {
      id: "courses",
      title: "양육 및 훈련 과정 관리",
      engTitle: "Discipleship & Training Courses",
      description: "새가족·세례·제자훈련 과정 개설, 기수별 수강생 등록 및 수료 이력 관리",
      icon: <SchoolOutlinedIcon sx={{ fontSize: "2.2rem" }} />,
      themeColor: "#d97706",
      bgColor: "#fffbeb",
      borderColor: "#fde68a",
      path: "/admin/courses",
      tag: "양육·훈련",
      statsText: `개설 과정 ${metrics.totalCourses}개 과목`,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* 상단 헤더 & 브리핑 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-0.5px",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                fontSize: { xs: "1.7rem", sm: "2.2rem" },
              }}
            >
              <AssessmentOutlinedIcon sx={{ fontSize: { xs: "1.8rem", sm: "2.3rem" }, color: "#FF6B00" }} />
              교회 행정 대시보드
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.8, fontWeight: 500 }}>
              온교회 교적, 출석 통계, 소그룹 정원, 양육 과정을 한곳에서 통합 관리합니다.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={fetchOverviewData}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              borderColor: "#cbd5e1",
              color: "#475569",
              fontWeight: 700,
              backgroundColor: "#fff",
              "&:hover": { backgroundColor: "#f1f5f9", borderColor: "#94a3b8" },
            }}
          >
            {loading ? "조회 중..." : "현황 새로고침"}
          </Button>
        </Box>

        {/* 퀵 요약 스탯 바 (Summary Bar) */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card
              sx={{
                p: 2.2,
                borderRadius: "18px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                border: "1px solid #e2e8f0",
                backgroundColor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "rgba(37, 99, 235, 0.1)",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PeopleAltOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                    총 등록 교인
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: "#0f172a", lineHeight: 1.2 }}>
                    {loading ? "..." : `${metrics.totalMembers}명`}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Card
              sx={{
                p: 2.2,
                borderRadius: "18px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                border: "1px solid #e2e8f0",
                backgroundColor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    color: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HomeOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                    등록 세대 (가구)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: "#0f172a", lineHeight: 1.2 }}>
                    {loading ? "..." : `${metrics.totalHouseholds}가구`}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Card
              sx={{
                p: 2.2,
                borderRadius: "18px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                border: "1px solid #e2e8f0",
                backgroundColor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "rgba(2, 132, 199, 0.1)",
                    color: "#0284c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ForestOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                    운영 정원 수
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: "#0f172a", lineHeight: 1.2 }}>
                    {loading ? "..." : `${metrics.totalGardens}개`}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Card
              sx={{
                p: 2.2,
                borderRadius: "18px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                border: "1px solid #e2e8f0",
                backgroundColor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    color: "#d97706",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HowToRegOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                    웹 가입 교인
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: "#0f172a", lineHeight: 1.2 }}>
                    {loading ? "..." : `${metrics.registeredMembers}명`}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* 4대 서비스 바로가기 카드 섹션 */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 800,
            color: "#334155",
            mb: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          행정 관리 서비스 바로가기
        </Typography>

        <Grid container spacing={3}>
          {MODULE_CARDS.map((m) => (
            <Grid key={m.id} size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  borderRadius: "22px",
                  border: `1px solid ${m.borderColor}`,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  backgroundColor: "#fff",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)",
                    borderColor: m.themeColor,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(m.path)}
                  sx={{ p: { xs: 3, sm: 3.5 }, height: "100%" }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box
                      sx={{
                        width: 58,
                        height: 58,
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
                      size="small"
                      label={m.tag}
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
                  <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mb: 1.5, fontWeight: 600 }}>
                    {m.engTitle}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.5, minHeight: 42, mb: 2 }}>
                    {m.description}
                  </Typography>

                  <Divider sx={{ my: 1.5, borderColor: "#f1f5f9" }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                      {m.statsText}
                    </Typography>
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
                      관리하기 <ArrowForwardIcon sx={{ fontSize: "1rem" }} />
                    </Box>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
