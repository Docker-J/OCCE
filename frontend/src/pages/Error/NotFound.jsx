import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", minHeight: "80vh" }}>
      {/* Hero Section for Header Visibility */}
      <Box
        sx={{
          width: "100%",
          height: "35vh",
          bgcolor: "#2b2b2b",
          backgroundImage: "linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Typography 
          variant="h1" 
          sx={{ 
            fontWeight: 900, 
            color: "rgba(255,255,255,0.05)", 
            fontSize: { xs: "12rem", md: "20rem" },
            position: "absolute",
            userSelect: "none"
          }}
        >
          404
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, color: "primary.main", mb: 2 }}>
          Oops!
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          원하시는 페이지를 찾을 수 없습니다.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
          존재하지 않는 주소를 입력하셨거나, 요청하신 페이지의 주소가 변경 또는 삭제되었을 수 있습니다.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/", { replace: true })}
          sx={{ borderRadius: 2, px: 4, py: 1.5 }}
        >
          홈으로 돌아가기
        </Button>
      </Container>
    </Box>
  );
};

export default NotFound;
