import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: 800, color: "primary.main", fontSize: { xs: "6rem", md: "8rem" } }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          원하시는 페이지를 찾을 수 없습니다.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          존재하지 않는 주소를 입력하셨거나, 요청하신 페이지의 주소가 변경 또는 삭제되었을 수 있습니다.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/", { replace: true })}
          sx={{ mt: 2, borderRadius: 2, px: 4, py: 1.5 }}
        >
          홈으로 돌아가기
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
