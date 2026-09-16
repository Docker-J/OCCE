import { Box, Typography, Button, Container } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { useEffect } from "react";

import { useRouteError } from "react-router";
import { isChunkLoadError, handleChunkReload } from "../../util/lazyRetry";

const ErrorFallback = ({ error: propError, resetErrorBoundary }) => {
  const routeError = useRouteError();
  const error = propError || routeError;
  const isChunkError = isChunkLoadError(error);

  useEffect(() => {
    if (isChunkError) {
      handleChunkReload();
    }
  }, [isChunkError]);

  const handleReset = () => {
    try {
      sessionStorage.removeItem("occe_chunk_reload_timestamp");
    } catch {}
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Hero Section for Header Visibility */}
      <Box
        sx={{
          width: "100%",
          height: "35vh",
          bgcolor: "#2b2b2b",
          backgroundImage: isChunkError
            ? "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)"
            : "linear-gradient(135deg, #4a0000 0%, #1a1a1a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {isChunkError ? (
          <SystemUpdateAltIcon sx={{ fontSize: { xs: "15rem", md: "25rem" }, color: "rgba(255,255,255,0.05)", position: "absolute" }} />
        ) : (
          <ErrorOutlineIcon sx={{ fontSize: { xs: "15rem", md: "25rem" }, color: "rgba(255,255,255,0.05)", position: "absolute" }} />
        )}
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8 }}>
        {isChunkError ? (
          <>
            <SystemUpdateAltIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              새로운 버전이 배포되었습니다
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
              웹사이트가 최신 버전으로 업데이트되었습니다.<br />
              아래 버튼을 눌러 새로고침하시면 최신 화면으로 즉시 연결됩니다.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleReset}
              sx={{ borderRadius: 2, px: 4, py: 1.2, fontWeight: 700 }}
            >
              최신 버전 적용하기 (새로고침)
            </Button>
          </>
        ) : (
          <>
            <ErrorOutlineIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              오류가 발생했습니다.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
              알 수 없는 에러가 발생하여 페이지를 불러올 수 없습니다.<br />
              잠시 후 다시 시도해 주세요.
            </Typography>
            {error?.message && (
              <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 2, width: "100%", overflowX: "auto", mb: 4 }}>
                <Typography variant="body2" color="error" sx={{ textAlign: "left", fontFamily: "monospace" }}>
                  {error.message}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => window.location.assign("/")}
                sx={{ borderRadius: 2 }}
              >
                홈으로 돌아가기
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleReset}
                sx={{ borderRadius: 2 }}
              >
                다시 시도하기
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ErrorFallback;
