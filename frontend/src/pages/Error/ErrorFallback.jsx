import { Box, Typography, Button, Container } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          오류가 발생했습니다.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          알 수 없는 에러가 발생하여 페이지를 불러올 수 없습니다.<br />
          잠시 후 다시 시도해 주세요.
        </Typography>
        {error?.message && (
          <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 2, width: "100%", overflowX: "auto", mt: 2 }}>
            <Typography variant="body2" color="error" sx={{ textAlign: "left", fontFamily: "monospace" }}>
              {error.message}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
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
            onClick={resetErrorBoundary}
            sx={{ borderRadius: 2 }}
          >
            다시 시도하기
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ErrorFallback;
