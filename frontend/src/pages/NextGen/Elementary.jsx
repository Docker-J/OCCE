import { Typography, Box, Grid, Card, CardContent, Stack, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../common/slick/slick-default-dots.css";
import { v4 as uuidv4 } from "uuid";

import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ParkIcon from "@mui/icons-material/Park";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const titleBackground = {
  backgroundImage: 'url("/img/NextGen/KidsOntheTree.webp")',
};

const imgs = [
  { src: "/img/NextGen/Elementary/1.webp" },
  { src: "/img/NextGen/Elementary/2.webp" },
  { src: "/img/NextGen/Elementary/3.webp" },
  { src: "/img/NextGen/Elementary/4.webp" },
  { src: "/img/NextGen/Elementary/5.webp" },
  { src: "/img/NextGen/Elementary/6.webp" },
];

const ministries = [
  { title: "예배 (Worship)", content: "주일 예배 | 2:30 PM (본당)" },
  {
    title: "소그룹 부서 모임",
    content: "큐티 말씀 묵상 / 토론 / 크래프트 / 게임 / 찬양과 율동 | 주일 4:00 PM (Sunday School Room)",
  },
  {
    title: "성경 통독 및 매일 묵상",
    content: "저학년/고학년 매일성경, 공동체 성경읽기 | 월-토요일",
  },
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
        dots: true
      }
    }
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

const Elementary = () => {
  return (
    <>
      <title>유초등부 - OCCE</title>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{ fontWeight: 830, textAlign: "center", letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            유초등부
          </Typography>
          <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 700, color: "white", mt: 1 }}>
            KIDS ON the Tree
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
        `}
      </style>

      <div className="container-wrapper" style={{ backgroundColor: "#fcfbf9", paddingBottom: "100px", paddingTop: "50px" , overflowX: "hidden" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          
          {/* 1. Dashboard Ribbon (Tree Theme: Brown & Forest Green) */}
          <Card 
            className="animate-fade"
            sx={{
              borderRadius: "24px",
              mb: 10,
              border: "1px solid rgba(121, 85, 72, 0.3)", // Brown tint
              boxShadow: "0 12px 32px rgba(121, 85, 72, 0.1)",
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
              backgroundColor: "#5d4037", 
              color: "#ffffff", 
              px: 2.5, 
              py: 0.5, 
              borderRadius: "16px", 
              fontWeight: 800, 
              fontSize: "0.9rem", 
              letterSpacing: "1px",
              boxShadow: "0 4px 12px rgba(93, 64, 55, 0.3)"
            }}>
              모임 안내
            </Box>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: "flex-start", md: "center" }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#efebe9", color: "#5d4037", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <GroupsIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#777", fontWeight: 600, fontSize: "0.85rem" }}>대상</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#2b2b2b" }}>1~6학년</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: "flex-start", md: "center" }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#efebe9", color: "#5d4037", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <AccessTimeIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#777", fontWeight: 600, fontSize: "0.85rem" }}>모임 시간</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#2b2b2b" }}>주일 오후 4시</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: "flex-start", md: "center" }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#efebe9", color: "#5d4037", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <PlaceIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#777", fontWeight: 600, fontSize: "0.85rem" }}>장소</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#2b2b2b", whiteSpace: "nowrap", letterSpacing: "-0.5px", fontSize: { xs: "1.25rem", md: "1rem", lg: "1.15rem" } }}>Sunday School Room</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: "flex-start", md: "center" }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#efebe9", color: "#5d4037", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <PersonIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#777", fontWeight: 600, fontSize: "0.85rem" }}>담당</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#2b2b2b" }}>이수연 전도사</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* 2. Main Bible Verse Quote */}
          <Box className="animate-fade" sx={{ textAlign: "center", mb: 10, animationDelay: "0.1s" }}>
            <FormatQuoteIcon sx={{ fontSize: "4rem", color: "rgba(121, 85, 72, 0.2)", mb: -2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#2b2b2b", lineHeight: 1.6, wordBreak: "keep-all", mb: 3 }}>
              앞으로 달려가서 보기 위하여 돌무화과나무에 올라가니 <br />
              이는 예수께서 그리로 지나가시게 됨이러라
            </Typography>
            <Typography variant="body1" sx={{ color: "#777", fontStyle: "italic", mb: 4, lineHeight: 1.8 }}>
              So he ran ahead and climbed a sycamore-fig tree to see him, <br />
              since Jesus was coming that way.
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#5d4037", letterSpacing: "2px" }}>
              - 누가복음 Luke 19:4 -
            </Typography>
          </Box>

          {/* 3. Photo Gallery Carousel */}
          <Box className="animate-fade" sx={{ mb: 12, animationDelay: "0.2s" }}>
            <Box sx={{ mx: { xs: -2, md: 0 } }}>
              <Slider {...sliderSettings}>
                {imgs.map((img) => (
                  <Box key={uuidv4()} sx={{ position: "relative", paddingTop: "65%", borderRadius: "24px", overflow: "hidden", boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}>
                    <img loading="lazy" src={img.src} 
                      alt="Elementary Activity" 
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                  </Box>
                ))}
              </Slider>
            </Box>
          </Box>

          {/* 4. Vision & Activities Cards */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
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
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                    <Box sx={{ p: 1.5, borderRadius: "16px", backgroundColor: "#efebe9", color: "#5d4037", mr: 2, display: "flex" }}>
                      <ParkIcon />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#2b2b2b" }}>나무 위의 삭개오처럼</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.8, wordBreak: "keep-all" }}>
                    <span style={{ fontWeight: 800, color: "#5d4037", fontSize: "1.1em" }}>온교회 유초등부</span>는 
                    예수님을 보기 위해 나무 위에 올랐던 삭개오처럼 예수님을 찾고 구하며, 죄를 회개하고 구원받는 예수님의 사람이 되길 
                    소원하여 지어진 이름입니다. <br /><br />
                    예수님을 기쁘게 영접하고 구원받아, 그 말씀대로 사는 자녀와 제자 삼는 것을 목적으로 합니다.
                    주일 예배 후속 부서활동 뿐 아니라 평소 가정 주도 신앙 교육이 가능하도록 각 가정의 신앙 교육을 지원합니다.
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
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: "16px", backgroundColor: "#e8f5e9", color: "#2e7d32", mr: 2, display: "flex" }}>
                      <LocalLibraryIcon />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#2b2b2b" }}>주요 사역 내용</Typography>
                  </Box>
                  
                  <List sx={{ mt: 2 }}>
                    {ministries.map((ministry, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 1.5, alignItems: "flex-start" }}>
                        <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                          <CheckCircleIcon sx={{ color: "#388e3c" }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={<Typography sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}>{ministry.title}</Typography>}
                          secondary={<Typography sx={{ color: "#666", lineHeight: 1.5 }}>{ministry.content}</Typography>}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* 5. Closing Verse/Vision Box */}
          <Box 
            className="animate-fade"
            sx={{ 
              backgroundColor: "#efebe9", // Very light brown/wood tone
              border: "1px solid rgba(121, 85, 72, 0.3)",
              borderRadius: "24px", 
              p: { xs: 4, md: 5 }, 
              textAlign: "center",
              animationDelay: "0.5s",
            }}
          >
            <Typography variant="h6" sx={{ color: "#4e342e", lineHeight: 1.8, wordBreak: "keep-all", fontWeight: 600 }}>
              하나님 사랑과 이웃 사랑이라는 공동체를 향한 부르심 안에 자라가는 우리 다음 세대 어린이들이, 
              <span style={{ color: "#5d4037", fontWeight: 800 }}> 부르신 삶의 자리에서 예수 그리스도의 자녀로서 받은 사랑을 나누고 실천하도록</span> 지도합니다.
            </Typography>
          </Box>

        </div>
      </div>
    </>
  );
};

export default Elementary;
