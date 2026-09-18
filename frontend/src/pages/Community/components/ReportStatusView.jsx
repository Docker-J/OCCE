/**
 * @file ReportStatusView.jsx
 * @description 보고서 권한 검증, 로딩, 에러 및 제출 중 화면 컴포넌트
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

const ReportStatusView = ({
  authInitialized,
  authenticated,
  isLeader,
  loading,
  error,
  submitting,
  reportType,
  onLoginClick,
  onRetry,
}) => {
  // 1. 인증 초기화 대기
  if (!authInitialized) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#dc2626", mb: 2 }} />
        <Typography variant="body1" sx={{ color: "#666" }}>
          정원 및 멤버 정보를 불러오는 중입니다...
        </Typography>
      </Box>
    );
  }

  // 2. 비로그인 사용자
  if (!authenticated) {
    return (
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.08)",
          textAlign: "center",
          p: 4,
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#dc2626" }}>
            로그인이 필요한 서비스입니다
          </Typography>
          <Typography variant="body1" sx={{ color: "#555", mb: 4, lineHeight: 1.6 }}>
            정원 보고서는 온교회 정원지기 및 목회자만 작성하실 수 있습니다.
            <br />
            가입은 교인 등록 명부에 등록된 성명과 전화번호 정보가 일치해야 가능합니다.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onLoginClick}
            startIcon={<LoginIcon />}
            sx={{
              backgroundColor: "#dc2626",
              "&:hover": { backgroundColor: "#b91c1c" },
              borderRadius: "24px",
              px: 4,
              py: 1.5,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            로그인하기
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 3. 리더 권한 없음
  if (!isLeader) {
    return (
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.08)",
          textAlign: "center",
          p: 4,
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#dc2626" }}>
            접근 권한이 없습니다
          </Typography>
          <Typography variant="body1" sx={{ color: "#555", mb: 4, lineHeight: 1.6 }}>
            정원 보고서는 온교회 정원지기 및 목회자만 작성하실 수 있습니다.
          </Typography>
          <Button
            component={Link}
            to="/community/smallgroup"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#dc2626",
              "&:hover": { backgroundColor: "#b91c1c" },
              borderRadius: "24px",
              px: 4,
              py: 1.5,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            소그룹 페이지로 돌아가기
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 4. 데이터 로딩 중
  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#dc2626", mb: 2 }} />
        <Typography variant="body1" sx={{ color: "#666" }}>
          정원 및 멤버 정보를 불러오는 중입니다...
        </Typography>
      </Box>
    );
  }

  // 5. 로딩 에러
  if (error) {
    return (
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          border: "1px solid rgba(239, 83, 80, 0.3)",
          p: 4,
          textAlign: "center",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ color: "#d32f2f", fontWeight: 700, mb: 2 }}>
            오류가 발생했습니다
          </Typography>
          <Typography variant="body1" sx={{ color: "#555", mb: 3 }}>
            {error}
          </Typography>
          <Button
            variant="outlined"
            onClick={onRetry}
            sx={{
              color: "#dc2626",
              borderColor: "#dc2626",
              "&:hover": { borderColor: "#b91c1c", backgroundColor: "rgba(220, 38, 38, 0.04)" },
              borderRadius: "20px",
            }}
          >
            다시 시도
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 6. 보고서 제출 중
  if (submitting) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 12,
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          textAlign: "center",
        }}
      >
        <CircularProgress
          sx={{ color: reportType === "sunday" ? "#dc2626" : "#ea580c", mb: 3 }}
          size={50}
        />
        <Typography variant="h6" sx={{ color: "#333", fontWeight: 700, mb: 1 }}>
          보고서를 제출하는 중입니다...
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          잠시만 기다려 주세요. 구글 드라이브에 저장 중입니다.
        </Typography>
      </Box>
    );
  }

  return null;
};

ReportStatusView.propTypes = {
  authInitialized: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  isLeader: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
  reportType: PropTypes.oneOf(["sunday", "gathering"]).isRequired,
  onLoginClick: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default ReportStatusView;
