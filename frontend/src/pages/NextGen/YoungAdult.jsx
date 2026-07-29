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
import FavoriteIcon from "@mui/icons-material/Favorite";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const titleBackground = {
  backgroundImage: 'url("/img/NextGen/YoungAdults/YoungAdults.webp")',
  backgroundPositionY: "60%",
};

const imgs = [{ src: "/img/NextGen/YoungAdults/1.webp" }];

const ministries = [
  {
    title: "예배",
    subtitle: "Worship",
    content: ["주일예배", "주중예배"],
    img: "/img/Online/Worship.webp",
  },
  {
    title: "교육",
    subtitle: "Teaching",
    content: ["입교/세례 교육", "성경공부, 제자훈련", "기도회, 수련회"],
    img: "/img/NextGen/YoungAdults/Ministries/Teaching.webp",
  },
  {
    title: "교제",
    subtitle: "Fellowship",
    content: ["정원모임", "친교(식사, 활동)", "지역 청년들과의 교류/연합"],
    img: "/img/NextGen/YoungAdults/Ministries/Fellowship.jpg",
  },
  {
    title: "봉사",
    subtitle: "Serving",
    content: ["교회사역", "봉사", "지역사회 봉사/구제"],
    img: "/img/Online/Worship.webp", // Reusing placeholder from original
  },
  {
    title: "전도",
    subtitle: "Preaching",
    content: ["선교지 후원", "단기선교 참여"],
    img: "/img/Online/Worship.webp", // Reusing placeholder from original
  },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  lazyLoad: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 3500,
  slidesToShow: 1, // Only 1 image provided, so show 1
  slidesToScroll: 1,
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

const YoungAdult = () => {
  return (
    <>
      <title>청년부 - OCCE</title>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{ fontWeight: 830, textAlign: "center", letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            온마음 청년부
          </Typography>
          <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 700, color: "white", mt: 1, letterSpacing: "-1px" }}>
            Hearts ON God YOUNG ADULTS
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
        `}
      </style>

      <div className="container-wrapper" style={{ backgroundColor: "#fcfbf9", paddingBottom: "100px", paddingTop: "50px" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          
          {/* 1. Dashboard Ribbon (Heart Theme: Deep Red / Coral) */}
          <Card 
            className="animate-fade"
            sx={{
              borderRadius: "24px",
              mb: 10,
              border: "1px solid rgba(211, 47, 47, 0.2)",
              boxShadow: "0 12px 32px rgba(211, 47, 47, 0.08)",
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
              backgroundColor: "#c62828", 
              color: "#ffffff", 
              px: 2.5, 
              py: 0.5, 
              borderRadius: "16px", 
              fontWeight: 800, 
              fontSize: "0.9rem", 
              letterSpacing: "1px",
              boxShadow: "0 4px 12px rgba(198, 40, 40, 0.3)"
            }}>
              모임 안내
            </Box>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: "flex-start", md: "center" }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#ffebee", color: "#c62828", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <GroupsIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#777", fontWeight: 600, fontSize: "0.85rem" }}>대상</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#2b2b2b", whiteSpace: "nowrap", letterSpacing: "-0.5px", fontSize: { xs: "1.25rem", md: "1.05rem", lg: "1.15rem" } }}>청년(대학생/직장인)</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: "flex-start", md: "center" }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#ffebee", color: "#c62828", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
                    <Box sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#ffebee", color: "#c62828", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <PlaceIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#777", fontWeight: 600, fontSize: "0.85rem" }}>장소</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#2b2b2b" }}>Youth Room</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: "flex-start", md: "center" }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#ffebee", color: "#c62828", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <PersonIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#777", fontWeight: 600, fontSize: "0.85rem" }}>담당</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#2b2b2b" }}>김휘경 목사</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* 2. Main Bible Verse Quote */}
          <Box className="animate-fade" sx={{ textAlign: "center", mb: 10, animationDelay: "0.1s" }}>
            <FormatQuoteIcon sx={{ fontSize: "4rem", color: "rgba(211, 47, 47, 0.15)", mb: -2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#2b2b2b", lineHeight: 1.6, wordBreak: "keep-all", mb: 3 }}>
              하늘에 있는 것에 마음을 두십시오.
            </Typography>
            <Typography variant="body1" sx={{ color: "#777", fontStyle: "italic", mb: 4, lineHeight: 1.8 }}>
              Set your hearts on things above.
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#c62828", letterSpacing: "2px" }}>
              - 골로새서 Colossians 3:1b -
            </Typography>
          </Box>

          {/* 3. Photo Gallery Carousel (1 Image) */}
          <Box className="animate-fade" sx={{ mb: 12, animationDelay: "0.2s" }}>
            <Box sx={{ maxWidth: "800px", mx: "auto" }}>
              <Slider {...sliderSettings}>
                {imgs.map((img) => (
                  <Box key={uuidv4()} sx={{ position: "relative", paddingTop: "56.25%", borderRadius: "24px", overflow: "hidden", boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}>
                    <img loading="lazy" src={img.src} 
                      alt="Young Adult Activity" 
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
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
                    <Box sx={{ p: 1.5, borderRadius: "16px", backgroundColor: "#ffebee", color: "#c62828", mr: 2, display: "flex" }}>
                      <FavoriteIcon />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#2b2b2b" }}>하늘에 마음을 두는 청년 공동체</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.8, wordBreak: "keep-all" }}>
                    <span style={{ fontWeight: 800, color: "#c62828", fontSize: "1.1em" }}>온교회 청년부</span>는 
                    예수 그리스도의 이름으로 모여, 하나님의 성령으로 한 마음을 품고, 하나님과 이웃에 대한 사랑이 점점 커져가며, 
                    그 사랑으로 세상에서 하나님 나라의 공의와 정의를 이뤄가는 청년 공동체를 세워갑니다.
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
                    <Box sx={{ p: 1.5, borderRadius: "16px", backgroundColor: "#ffebee", color: "#c62828", mr: 2, display: "flex" }}>
                      <VolunteerActivismIcon />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#2b2b2b" }}>모임 및 사역 내용</Typography>
                  </Box>
                  
                  <List sx={{ mt: 2 }}>
                    {ministries.map((ministry, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 1.5, alignItems: "flex-start" }}>
                        <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                          <CheckCircleIcon sx={{ color: "#e53935" }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={<Typography sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}>{ministry.title} <span style={{ color: "#888", fontSize: "0.85em", fontWeight: 500 }}>{ministry.subtitle}</span></Typography>}
                          secondary={<Typography sx={{ color: "#666", lineHeight: 1.5 }}>{ministry.content.join(", ")}</Typography>}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* 6. Closing Verse Box */}
          <Box 
            className="animate-fade"
            sx={{ 
              backgroundColor: "#ffebee", // Very light red/coral
              border: "1px solid rgba(211, 47, 47, 0.3)",
              borderRadius: "24px", 
              p: { xs: 4, md: 5 }, 
              textAlign: "center",
              animationDelay: "0.5s",
            }}
          >
            <Typography variant="h6" sx={{ color: "#b71c1c", lineHeight: 1.8, wordBreak: "keep-all", fontWeight: 700, mb: 1 }}>
              내가 그들에게 한 마음을 주고 그 속에 새 영을 주며 그 몸에서 돌 같은 마음을 제거하고 살처럼 부드러운 마음을 주어 
              내 율례를 따르며 내 규례를 지켜 행하게 하리니 그들은 내 백성이 되고 나는 그들의 하나님이 되리라
            </Typography>
            <Typography variant="body2" sx={{ color: "#c62828", fontStyle: "italic", mb: 2 }}>
              I will give them an undivided heart and put a new spirit in them; I will remove from them their heart of stone 
              and give them a heart of flesh. Then they will follow my decrees and be careful to keep my laws. 
              They will be my people, and I will be their God.
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#d32f2f", letterSpacing: "1px" }}>
              - 에스겔 Ezekiel 11:19-20 -
            </Typography>
          </Box>

        </div>
      </div>
    </>
  );
};

export default YoungAdult;
