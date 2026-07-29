import { Typography, Button, Box, Card, CardContent, Grid, Divider } from "@mui/material";
import { Link } from "react-router";
import useAuthStore from "../../store/useAuthStore";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import NatureIcon from "@mui/icons-material/Nature";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

const titleBackground = {
  backgroundImage: 'url("/img/Community/SmallGroup.webp")',
  backgroundPositionY: "58%",
};

const SmallGroup = () => {
  const isLeader = useAuthStore((state) => state.isLeader);

  return (
    <>
      <title>소그룹 - OCCE</title>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 830,
              letterSpacing: "0.4em",
              pl: "0.4em",
              color: "white",
            }}
          >
            소그룹
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              color: "white",
            }}
          >
            정원
          </Typography>
        </div>
      </div>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes slideUpFade {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade {
            animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
        `}
      </style>

      <div className="container-wrapper" style={{ backgroundColor: "#fcfbf9", paddingBottom: "80px", paddingTop: "60px" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          
          {/* 1. Main Pull Quote */}
          <Box className="animate-fade" sx={{ textAlign: "center", mb: 8, position: "relative" }}>
            <FormatQuoteIcon sx={{ fontSize: "4rem", color: "rgba(255, 107, 0, 0.2)", mb: -2 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#2b2b2b",
                lineHeight: 1.5,
                wordBreak: "keep-all",
                mb: 2,
                px: { xs: 2, md: 10 }
              }}
            >
              '정원'은 하나님께서 태초에 사람에게 허락하신 <span style={{ color: "#FF6B00" }}>에덴의 모형</span>입니다.
            </Typography>
            <Divider sx={{ width: "60px", mx: "auto", borderBottomWidth: 3, borderColor: "#FF6B00", borderRadius: 2 }} />
          </Box>

          {/* 2. Concept Cards Grid */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            
            {/* Card 1: Garden & Gardener */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                className="animate-fade"
                sx={{
                  height: "100%",
                  borderRadius: "24px",
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.12)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)",
                  p: 2,
                  animationDelay: "0.1s",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }
                }}
              >
                <CardContent sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Box sx={{ p: 2, borderRadius: "50%", backgroundColor: "#e8f5e9", color: "#2e7d32", mb: 3 }}>
                    <NatureIcon sx={{ fontSize: "2.5rem" }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#2b2b2b", mb: 2 }}>
                    정원과 정원사
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.7, wordBreak: "keep-all" }}>
                    '정원'의 주인은 <strong>하나님</strong>이시고, '정원사'는 <strong>예수 그리스도</strong>이십니다. 주께서 우리를 은혜 가운데 기르시고 아름답게 꽃피우십니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 2: Keeper */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                className="animate-fade"
                sx={{
                  height: "100%",
                  borderRadius: "24px",
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.12)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)",
                  p: 2,
                  animationDelay: "0.2s",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }
                }}
              >
                <CardContent sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Box sx={{ p: 2, borderRadius: "50%", backgroundColor: "#fff3e0", color: "#f57c00", mb: 3 }}>
                    <VpnKeyIcon sx={{ fontSize: "2.5rem" }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#2b2b2b", mb: 2 }}>
                    정원지기
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.7, wordBreak: "keep-all" }}>
                    주께서 허락하신 공동체 내 <strong>영적 리더</strong>들입니다. 진실하고 충성된 청지기로서 주께서 맡기신 정원 가족들을 헌신적으로 살피고 섬깁니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 3: Family */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                className="animate-fade"
                sx={{
                  height: "100%",
                  borderRadius: "24px",
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.12)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)",
                  p: 2,
                  animationDelay: "0.3s",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }
                }}
              >
                <CardContent sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Box sx={{ p: 2, borderRadius: "50%", backgroundColor: "#e3f2fd", color: "#1565c0", mb: 3 }}>
                    <Diversity1Icon sx={{ fontSize: "2.5rem" }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#2b2b2b", mb: 2 }}>
                    정원 가족
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.7, wordBreak: "keep-all" }}>
                    태초 에덴의 피조물들처럼 주님의 창조의 섭리를 누리며, 하나님의 은혜 안에서 말씀에 순종하며 동행하는 <strong>복된 공동체</strong>입니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

          </Grid>

          {/* 3. Conclusion Box */}
          <Box 
            className="animate-fade"
            sx={{ 
              backgroundColor: "#fff0e6",
              border: "1px solid rgba(255, 107, 0, 0.2)",
              borderRadius: "24px", 
              p: { xs: 4, md: 6 }, 
              textAlign: "center",
              animationDelay: "0.4s",
              mb: 8
            }}
          >
            <Typography variant="h6" sx={{ color: "#444", lineHeight: 1.8, wordBreak: "keep-all", fontWeight: 500 }}>
              온 교회의 소그룹인 '정원'은, 그리스도 안에서 새로운 피조물로 태어나 하나님의 가족 된 우리들이 
              말씀 안에 살아계신 하나님을 통해 <span style={{ color: "#FF6B00", fontWeight: 800 }}>태초의 에덴을 경험하는 행복한 만남과 나눔과 성장, 그리고 지상 최대 명령인 복음 전파의 자리</span>입니다.
            </Typography>
          </Box>

          {/* 4. Leader Control Panel */}
          {isLeader && (
            <Card 
              className="animate-fade" 
              sx={{ 
                borderRadius: "24px", 
                border: "2px solid #FF6B00", 
                boxShadow: "0 12px 40px rgba(255, 107, 0, 0.15)",
                backgroundColor: "#fff",
                animationDelay: "0.5s",
                overflow: "visible",
                position: "relative"
              }}
            >
              <Box 
                sx={{ 
                  position: "absolute", 
                  top: -20, 
                  left: "50%", 
                  transform: "translateX(-50%)", 
                  backgroundColor: "#FF6B00", 
                  color: "#fff", 
                  px: 3, 
                  py: 1, 
                  borderRadius: "30px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 800,
                  boxShadow: "0 4px 12px rgba(255, 107, 0, 0.3)"
                }}
              >
                <SupervisorAccountIcon /> 정원지기 전용 메뉴
              </Box>
              
              <CardContent sx={{ p: { xs: 4, md: 6 }, pt: { xs: 6, md: 8 }, textAlign: "center" }}>
                <Typography variant="body1" sx={{ color: "#666", mb: 4, fontWeight: 600 }}>
                  정원 모임과 주일 출석 현황을 각 보고서 양식에 맞추어 제출해 주세요.
                </Typography>
                
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    component={Link}
                    to="/community/smallgroup/report?type=sunday"
                    variant="contained"
                    size="large"
                    startIcon={<AssignmentTurnedInIcon />}
                    sx={{
                      backgroundColor: "#dc2626",
                      "&:hover": { backgroundColor: "#b91c1c", transform: "translateY(-3px)", boxShadow: "0 8px 16px rgba(220, 38, 38, 0.3)" },
                      borderRadius: "16px",
                      px: { xs: 3, md: 5 },
                      py: 1.8,
                      fontWeight: 800,
                      fontSize: "1.05em",
                      boxShadow: "0 4px 12px 0 rgba(220, 38, 38, 0.2)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    주일 출석 보고하기
                  </Button>
                  <Button
                    component={Link}
                    to="/community/smallgroup/report?type=gathering"
                    variant="contained"
                    size="large"
                    startIcon={<AssignmentTurnedInIcon />}
                    sx={{
                      backgroundColor: "#ea580c",
                      "&:hover": { backgroundColor: "#c2410c", transform: "translateY(-3px)", boxShadow: "0 8px 16px rgba(234, 88, 12, 0.3)" },
                      borderRadius: "16px",
                      px: { xs: 3, md: 5 },
                      py: 1.8,
                      fontWeight: 800,
                      fontSize: "1.05em",
                      boxShadow: "0 4px 12px 0 rgba(234, 88, 12, 0.2)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    정원 모임 보고하기
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </>
  );
};

export default SmallGroup;
