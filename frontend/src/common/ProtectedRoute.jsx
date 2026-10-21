/**
 * @file ProtectedRoute.jsx
 * @description 공통 라우트/페이지 권한 보호 컴포넌트
 * - authInitialized, authenticated, role(admin/isLeader) 상태 기반 라우트 보호
 * - 인증 진행 중 로딩 스피너 및 비인증/권한 부족 안내 카드 렌더링
 */

import PropTypes from "prop-types";
import { Link } from "react-router";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useShallow } from "zustand/react/shallow";
import useAuthStore from "../store/useAuthStore";
import useModals from "../util/useModal";

const ProtectedRoute = ({
  children,
  requiredRole = "any",
  unauthenticatedMessage,
  accessDeniedMessage,
}) => {
  const { openModal } = useModals();

  const { authInitialized, authenticated, admin, isLeader } = useAuthStore(
    useShallow((state) => ({
      authInitialized: state.authInitialized,
      authenticated: state.authenticated,
      admin: state.admin,
      isLeader: state.isLeader,
    }))
  );

  const handleLoginClick = async () => {
    const { default: SignInModal } = await import("../components/User/SignInModal");
    openModal(SignInModal, {});
  };

  // 1. 인증 초기화 진행 중
  if (!authInitialized) {
    return (
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
    );
  }

  // 2. 비인증 사용자 (로그인 필요)
  if (!authenticated) {
    let defaultUnauthMessage = "로그인이 필요한 서비스입니다.";
    if (requiredRole === "staff" || requiredRole === "admin") {
      defaultUnauthMessage = "교인 관리 대시보드는 온교회 스태프(Staff) 권한을 가진 계정만 접근하실 수 있습니다.";
    } else if (requiredRole === "leader") {
      defaultUnauthMessage = "본 대시보드는 온교회 스태프(Staff) 및 정원지기(GardenKeeper) 권한 보유자 전용 포털입니다.";
    }

    return (
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
            {unauthenticatedMessage || defaultUnauthMessage}
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
    );
  }

  // 3. 권한 검증: staff / admin 권한 필요
  if (requiredRole === "staff" || requiredRole === "admin") {
    if (!admin) {
      return (
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
              {accessDeniedMessage || "접근 권한이 없습니다. 관리자(Staff) 계정으로 로그인해 주세요."}
            </Typography>
            <Button
              component={Link}
              to={isLeader ? "/admin" : "/"}
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
              {isLeader ? "대시보드로 이동" : "홈으로 이동"}
            </Button>
          </CardContent>
        </Card>
      );
    }
  }

  // 4. 권한 검증: leader 권한 필요 (admin 또는 isLeader)
  if (requiredRole === "leader") {
    if (!admin && !isLeader) {
      return (
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
              {accessDeniedMessage || "접근 권한이 없습니다. 정원지기 또는 스태프 계정으로 로그인해 주세요."}
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
      );
    }
  }

  // 5. 권한 충족 시 칠드런 렌더링
  return <>{children}</>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  requiredRole: PropTypes.oneOf(["any", "leader", "staff", "admin"]),
  unauthenticatedMessage: PropTypes.string,
  accessDeniedMessage: PropTypes.string,
};

export default ProtectedRoute;
