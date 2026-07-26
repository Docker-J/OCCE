import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import { MinistryList } from "./MinistryList";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

const titleBackground = {
  backgroundImage: 'url("/img/Community/Ministry.webp")',
  backgroundPositionX: "58%",
  backgroundPositionY: "56%",
};

const Ministry = () => {
  return (
    <>
      <title>사역 - OCCE</title>
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
            사역
          </Typography>
        </div>
      </div>
      
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
          .animate-card {
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
        `}
      </style>

      <div className="container-wrapper" style={{ backgroundColor: "#fcfbf9", paddingBottom: "80px", paddingTop: "40px" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          
          <Box sx={{ mb: 8, textAlign: "center", animation: "slideUpFade 0.6s ease-out" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#2b2b2b", mb: 2 }}>
              정원 순환 사역
            </Typography>
            <Typography sx={{ fontSize: "1.1em", color: "#555", maxWidth: "800px", mx: "auto", lineHeight: 1.7, wordBreak: "keep-all" }}>
              주일 안내팀과 교제팀은 각 팀 staff의 안내에 따라 매달 순서를 맡은 소그룹{" "}
              <Link to="/community/smallgroup" style={{ color: "#FF6B00", fontWeight: 700, textDecoration: "none" }}>
                '정원'
              </Link>
              이 순환하여 섬깁니다.
            </Typography>
          </Box>

          <Box sx={{ mb: 10, textAlign: "center", animation: "slideUpFade 0.6s ease-out 0.1s both" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#2b2b2b", mb: 2 }}>
              온 교회 사역 지원
            </Typography>
            <Typography sx={{ fontSize: "1.1em", color: "#555", maxWidth: "800px", mx: "auto", lineHeight: 1.7, mb: 5, wordBreak: "keep-all" }}>
              교회에 필요한 사역 지원을 수시로 받고 있습니다. 허락하신 달란트대로 주의 몸 된 교회를 함께 세우고, 
              온 맘과 온 힘을 다해 하나님과 이웃을 사랑하는 공동체가 되길 소망합니다. 아래의 사역 분야를 참고해 주시고, 
              온라인 링크를 통하여 지원해 주시면 감사하겠습니다.
            </Typography>

            <Button
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://forms.gle/5kGFLfA5fhfotVTW6"
              variant="contained"
              size="large"
              endIcon={<OpenInNewIcon />}
              startIcon={<VolunteerActivismIcon />}
              sx={{
                backgroundColor: "#FF6B00",
                color: "white",
                borderRadius: "30px",
                px: 5,
                py: 1.8,
                fontSize: "1.15rem",
                fontWeight: 800,
                boxShadow: "0 8px 20px rgba(255, 107, 0, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#e65100",
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 25px rgba(255, 107, 0, 0.4)",
                },
              }}
            >
              사역 지원하기
            </Button>
          </Box>

          <Grid container spacing={3}>
            {MinistryList.map((ministry, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  className="animate-card"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "24px",
                    border: "1px solid rgba(0,0,0,0.12)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    animationDelay: `${0.15 + index * 0.05}s`,
                    backgroundColor: "#ffffff",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 20px 40px rgba(255, 107, 0, 0.12)",
                      borderColor: "rgba(255, 107, 0, 0.2)",
                      "& .ministry-icon-wrapper": {
                        backgroundColor: "#FF6B00",
                        color: "white",
                        transform: "scale(1.1)",
                      }
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box
                        className="ministry-icon-wrapper"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 56,
                          height: 56,
                          borderRadius: "16px",
                          backgroundColor: "#fff3e0",
                          color: "#FF6B00",
                          transition: "all 0.3s ease",
                          mr: 2.5,
                          flexShrink: 0,
                          "& svg": { fontSize: "2rem" }
                        }}
                      >
                        {ministry.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#2b2b2b", wordBreak: "keep-all" }}>
                        {ministry.title}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {ministry.types.map((type) => (
                        <Chip
                          key={type}
                          label={type}
                          size="small"
                          sx={{
                            backgroundColor: "#f5f5f5",
                            color: "#555",
                            fontWeight: 600,
                            borderRadius: "8px",
                            "&:hover": {
                              backgroundColor: "#e0e0e0"
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

        </div>
      </div>
    </>
  );
};

export default Ministry;
