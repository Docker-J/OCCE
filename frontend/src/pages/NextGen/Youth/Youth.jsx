import { Typography, Box, Grid, Card, CardContent, Stack, useMediaQuery, useTheme } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../common/slick/slick-default-dots.css";
import { v4 as uuidv4 } from "uuid";

import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import TerrainIcon from "@mui/icons-material/Terrain";
import HearingIcon from "@mui/icons-material/Hearing";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import YouthTimeline from "./YouthTimeline";

const titleBackground = {
  backgroundImage: 'url("/img/NextGen/KidsOntheRock.webp")',
  backgroundPositionY: "52%",
};

const imgs = [
  { src: "/img/NextGen/Youth/1.webp" },
  { src: "/img/NextGen/Youth/2.webp" },
  { src: "/img/NextGen/Youth/3.webp" },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  lazyLoad: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 3500,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
  ],
  dotsClass: "slick-dots slick-default-dots",
  customPaging: () => (
    <span
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "#bdbdbd",
        display: "inline-block",
        margin: "0 4px",
      }}
    />
  ),
};

const Youth = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <title>중고등부 - OCCE</title>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 830,
              textAlign: "center",
              letterSpacing: "0.4em",
              pl: "0.4em",
              color: "white",
            }}
          >
            중고등부
          </Typography>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", fontWeight: 700, color: "white", mt: 1 }}
          >
            YOUTH ON the Rock
          </Typography>
        </div>
      </div>

      <style>
        {`
          @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade {
            animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
          .slick-slide { padding: 0 12px; }
          .slick-list { margin: 0 -12px; }
          .slick-default-dots li.slick-active span { background-color: #455a64 !important; }
        `}
      </style>

      <div
        className="container-wrapper"
        style={{
          backgroundColor: "#fcfbf9",
          paddingBottom: "100px",
          paddingTop: "50px",
          overflowX: "hidden"
        }}
      >
        <div
          className="container"
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
        >
          {/* 1. Dashboard Ribbon (Rock Theme: Blue Grey / Slate) */}
          <Card
            className="animate-fade"
            sx={{
              borderRadius: "24px",
              mb: 10,
              border: "1px solid rgba(84, 110, 122, 0.3)", // Blue Grey tint
              boxShadow: "0 12px 32px rgba(84, 110, 122, 0.1)",
              backgroundColor: "#ffffff",
              overflow: "visible",
              position: "relative"
            }}
          >
            <Box sx={{ 
              position: "absolute", 
              top: "-16px", 
              left: { xs: "50%", md: "32px" }, 
              transform: { xs: "translateX(-50%)", md: "none" },
              backgroundColor: "#455a64", 
              color: "#ffffff", 
              px: 2.5, 
              py: 0.5, 
              borderRadius: "16px", 
              fontWeight: 800, 
              fontSize: "0.9rem", 
              letterSpacing: "1px",
              boxShadow: "0 4px 12px rgba(69, 90, 100, 0.3)"
            }}>
              모임 안내
            </Box>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                alignItems="center"
              >
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent={{ xs: "flex-start", md: "center" }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: "#eceff1",
                        color: "#455a64",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <GroupsIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#777",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        }}
                      >
                        대상
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 800, color: "#2b2b2b" }}
                      >
                        7~12학년
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent={{ xs: "flex-start", md: "center" }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: "#eceff1",
                        color: "#455a64",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <AccessTimeIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#777",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        }}
                      >
                        모임 시간
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 800, color: "#2b2b2b" }}
                      >
                        주일 오후 4시
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent={{ xs: "flex-start", md: "center" }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: "#eceff1",
                        color: "#455a64",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <PlaceIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#777",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        }}
                      >
                        장소
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 800, color: "#2b2b2b" }}
                      >
                        Fireside Room
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent={{ xs: "flex-start", md: "center" }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: "#eceff1",
                        color: "#455a64",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <PersonIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#777",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        }}
                      >
                        담당
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 800, color: "#2b2b2b" }}
                      >
                        김휘경 목사
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* 2. Main Bible Verse Quote */}
          <Box
            className="animate-fade"
            sx={{ textAlign: "center", mb: 10, animationDelay: "0.1s" }}
          >
            <FormatQuoteIcon
              sx={{
                fontSize: "4rem",
                color: "rgba(84, 110, 122, 0.2)",
                mb: -2,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#2b2b2b",
                lineHeight: 1.6,
                wordBreak: "keep-all",
                mb: 3,
              }}
            >
              그러므로 누구든지 나의 이 말을 듣고 행하는 자는 <br />그 집을 반석
              위에 지은 지혜로운 사람 같으리니
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#777",
                fontStyle: "italic",
                mb: 4,
                lineHeight: 1.8,
              }}
            >
              Therefore everyone who hears these words of mine and puts them
              into practice <br />
              is like a wise man who built his house on the rock.
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: "#455a64", letterSpacing: "2px" }}
            >
              - 마태복음 Matthew 7:24 -
            </Typography>
          </Box>

          {/* 3. Photo Gallery Carousel */}
          <Box className="animate-fade" sx={{ mb: 12, animationDelay: "0.2s" }}>
            <Box sx={{ mx: { xs: -2, md: 0 } }}>
              <Slider {...sliderSettings} slidesToShow={isMobile ? 1 : 2}>
                {imgs.map((img) => (
                  <Box
                    key={uuidv4()}
                    sx={{
                      position: "relative",
                      paddingTop: "65%",
                      borderRadius: "24px",
                      overflow: "hidden",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                    }}
                  >
                    <img loading="lazy" src={img.src}
                      alt="Youth Activity"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </Box>
                ))}
              </Slider>
            </Box>
          </Box>

          {/* 4. Vision & Activities Cards */}
          <Grid container spacing={4} sx={{ mb: 10 }}>
            {/* Vision Card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                className="animate-fade"
                sx={{
                  height: "100%",
                  borderRadius: "24px",
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.05)",
                  p: { xs: 2, md: 3 },
                  animationDelay: "0.3s",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "16px",
                        backgroundColor: "#eceff1",
                        color: "#455a64",
                        mr: 2,
                        display: "flex",
                      }}
                    >
                      <TerrainIcon />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 800, color: "#2b2b2b" }}
                    >
                      말씀의 반석 위에
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#555",
                      lineHeight: 1.8,
                      wordBreak: "keep-all",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 800,
                        color: "#455a64",
                        fontSize: "1.1em",
                      }}
                    >
                      온교회 중고등부
                    </span>
                    는 말씀이신 그리스도의 <strong>"반석 위에"</strong> 집을
                    짓고, <strong>"하나님 앞에서 지혜로운 사람"</strong>으로
                    함께 세워져 가기를 소망하는 청소년 그룹입니다. <br />
                    <br />
                    세상의 가치관과 기준이 아니라, 하나님의 말씀만이 영원한
                    생명의 반석임을 배우고 그 배운 것을 삶에서 살아내는 가장
                    복된 인생을 살아가도록 함께 반석 위에 집을 지어 갈 것입니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Activities Card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                className="animate-fade"
                sx={{
                  height: "100%",
                  borderRadius: "24px",
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.05)",
                  p: { xs: 2, md: 3 },
                  animationDelay: "0.4s",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "16px",
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        mr: 2,
                        display: "flex",
                      }}
                    >
                      <DirectionsRunIcon />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 800, color: "#2b2b2b" }}
                    >
                      들음과 행함
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#555",
                      lineHeight: 1.8,
                      wordBreak: "keep-all",
                      mb: 3,
                    }}
                  >
                    우리의 목표를 이루기 위해 신앙의{" "}
                    <strong>“들음”과 “행함”</strong>에 집중합니다.
                  </Typography>

                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <HearingIcon sx={{ color: "#1976d2", mr: 1.5, mt: 0.5 }} />
                    <Box>
                      <Typography
                        sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}
                      >
                        생명의 말씀을 듣다
                      </Typography>
                      <Typography sx={{ color: "#666", fontSize: "0.95rem" }}>
                        예배 / 성경읽기 / 묵상 / 교리문답을 통하여 생명이신 예수
                        그리스도의 말씀을 듣습니다.
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                    <DirectionsRunIcon
                      sx={{ color: "#1976d2", mr: 1.5, mt: 0.5 }}
                    />
                    <Box>
                      <Typography
                        sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}
                      >
                        들은 말씀을 행하다
                      </Typography>
                      <Typography sx={{ color: "#666", fontSize: "0.95rem" }}>
                        교제 / 수련회 / 선교활동을 통하여 들은 말씀을 실천하고
                        행합니다.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* 5. Closing Highlight Box & Timeline */}
          <Box
            className="animate-fade"
            sx={{
              backgroundColor: "#eceff1", // Blue Grey 50
              border: "1px solid rgba(84, 110, 122, 0.3)",
              borderRadius: "24px",
              p: { xs: 4, md: 5 },
              textAlign: "center",
              animationDelay: "0.5s",
              mb: 8,
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "#263238", lineHeight: 1.5, fontWeight: 800, mb: 1 }}
            >
              하나님 앞에서 지혜로운 사람
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#546e7a", fontWeight: 600, mb: 4 }}
            >
              A wise person before God
            </Typography>

            {/* 6. Timeline Component */}
            <Box sx={{ mt: 4 }}>
              <YouthTimeline />
            </Box>
          </Box>
        </div>
      </div>
    </>
  );
};

export default Youth;
