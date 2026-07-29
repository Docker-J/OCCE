import { Typography, Box, Grid, Card, CardContent, Stack, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../common/slick/slick-default-dots.css";
import { v4 as uuidv4 } from "uuid";

import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const titleBackground = {
  backgroundImage: 'url("/img/NextGen/KidsOnGoodSoil.webp")',
};

const imgs = [
  { src: "/img/NextGen/Preschool/1.jpg" },
  { src: "/img/NextGen/Preschool/2.jpg" },
  { src: "/img/NextGen/Preschool/3.jpg" },
  { src: "/img/NextGen/Preschool/4.jpg" },
  { src: "/img/NextGen/Preschool/5.jpg" },
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

const Preschool = () => {
  return (
    <>
      <title>유아유치부 - OCCE</title>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{ fontWeight: 830, letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            유아유치부
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "white", mt: 1 }}>
            KIDS ON Good Soil
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

      <div className="container-wrapper" style={{ backgroundColor: "#fcfbf9", paddingBottom: "100px", paddingTop: "50px" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          
          {/* 1. Dashboard Ribbon */}
          <Card 
            className="animate-fade"
            sx={{
              borderRadius: "24px",
              mb: 10,
              border: "1px solid rgba(139, 195, 74, 0.4)", // Green tint for good soil
              boxShadow: "0 12px 32px rgba(139, 195, 74, 0.12)",
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
              backgroundColor: "#558b2f", 
              color: "#ffffff", 
              px: 2.5, 
              py: 0.5, 
              borderRadius: "16px", 
              fontWeight: 800, 
              fontSize: "0.9rem", 
              letterSpacing: "1px",
              boxShadow: "0 4px 12px rgba(85, 139, 47, 0.3)"
            }}>
              모임 안내
            </Box>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" spacing={2.5} alignItems="center" justifyContent={{ xs: "flex-start", md: "center" }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#f1f8e9", color: "#558b2f", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <GroupsIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#777", fontWeight: 600, fontSize: "0.85rem" }}>대상</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#2b2b2b" }}>만 5세(K)까지</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" spacing={2.5} alignItems="center" justifyContent={{ xs: "flex-start", md: "center" }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#f1f8e9", color: "#558b2f", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <AccessTimeIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#777", fontWeight: 600, fontSize: "0.85rem" }}>모임 시간</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#2b2b2b" }}>주일 오후 4시</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" spacing={2.5} alignItems="center" justifyContent={{ xs: "flex-start", md: "center" }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#f1f8e9", color: "#558b2f", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <PlaceIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#777", fontWeight: 600, fontSize: "0.85rem" }}>장소</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#2b2b2b" }}>Preschool Room</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* 2. Main Bible Verse Quote */}
          <Box className="animate-fade" sx={{ textAlign: "center", mb: 10, animationDelay: "0.1s" }}>
            <FormatQuoteIcon sx={{ fontSize: "4rem", color: "rgba(139, 195, 74, 0.2)", mb: -2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#2b2b2b", lineHeight: 1.6, wordBreak: "keep-all", mb: 3 }}>
              더러는 좋은 땅에 떨어지매 자라 무성하여 결실하였으니 <br />
              삼십 배나 육십 배나 백 배가 되었느니라 하시고
            </Typography>
            <Typography variant="body1" sx={{ color: "#777", fontStyle: "italic", mb: 4, lineHeight: 1.8 }}>
              Still other seed fell on good soil. It came up, grew and produced a crop, <br />
              some multiplying thirty, some sixty, some a hundred times.
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#558b2f", letterSpacing: "2px" }}>
              - 마가복음 Mark 4:8 -
            </Typography>
          </Box>

          {/* 3. Photo Gallery Carousel */}
          <Box className="animate-fade" sx={{ mb: 12, animationDelay: "0.2s" }}>
            <Box sx={{ mx: { xs: -2, md: 0 } }}>
              <Slider {...sliderSettings}>
                {imgs.map((img) => (
                  <Box key={uuidv4()} sx={{ position: "relative", paddingTop: "70%", borderRadius: "24px", overflow: "hidden", boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}>
                    <img loading="lazy" src={img.src} 
                      alt="Preschool Activity" 
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
                    <Box sx={{ p: 1.5, borderRadius: "16px", backgroundColor: "#f1f8e9", color: "#558b2f", mr: 2, display: "flex" }}>
                      <FavoriteIcon />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#2b2b2b" }}>좋은 밭에 심겨지는 아이들</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.8, wordBreak: "keep-all" }}>
                    <span style={{ fontWeight: 800, color: "#558b2f", fontSize: "1.1em" }}>온교회 유아유치부</span>는 
                    성령으로 인하여 부드러운 마음을 가진 우리 어린이들이 말씀을 배우며 아브라함의 하나님, 이삭의 하나님, 
                    야곱의 하나님을 넘어 <strong>"나의 하나님"</strong>을 인정하고 순종함으로 나아갈 수 있는 기초를 다지는 시기입니다. 
                    성부 하나님, 성자 예수님, 성령님과 교회 및 기본 교리 교육을 내용으로 합니다.
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
                  <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                    <Box sx={{ p: 1.5, borderRadius: "16px", backgroundColor: "#fff8e1", color: "#fbc02d", mr: 2, display: "flex" }}>
                      <AutoStoriesIcon />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#2b2b2b" }}>주요 활동</Typography>
                  </Box>
                  <List sx={{ mt: 2, mb: 1 }}>
                    <ListItem sx={{ px: 0, py: 1.5, alignItems: "flex-start" }}>
                      <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                        <CheckCircleIcon sx={{ color: "#fbc02d" }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}>정기 활동</Typography>}
                        secondary={<Typography sx={{ color: "#666", lineHeight: 1.5 }}>찬양과 말씀, 만들기, 전체 활동, 소그룹 활동, 야외 활동, 생일 잔치, 말씀 암송 등</Typography>}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1.5, alignItems: "flex-start" }}>
                      <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                        <CheckCircleIcon sx={{ color: "#fbc02d" }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}>절기 행사</Typography>}
                        secondary={<Typography sx={{ color: "#666", lineHeight: 1.5 }}>달란트 잔치, 여름 성경학교</Typography>}
                      />
                    </ListItem>
                  </List>
                  <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.7, wordBreak: "keep-all", pt: 2, borderTop: "1px dashed rgba(0,0,0,0.1)", fontSize: "0.95rem" }}>
                    활동을 통해 지혜와 그 키가 자라가며 하나님과 사람에게 더 사랑스러워 가는 예수님을 닮은 어린이들이 되길 소망합니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* 5. Closing Verse Box */}
          <Box 
            className="animate-fade"
            sx={{ 
              backgroundColor: "#f1f8e9", // Very light green
              border: "1px solid rgba(139, 195, 74, 0.3)",
              borderRadius: "24px", 
              p: { xs: 4, md: 5 }, 
              textAlign: "center",
              animationDelay: "0.5s",
            }}
          >
            <Typography variant="h6" sx={{ color: "#33691e", lineHeight: 1.8, wordBreak: "keep-all", fontWeight: 700, mb: 1 }}>
              예수는 지혜와 키가 자라가며 하나님과 사람에게 더욱 사랑스러워 가시더라
            </Typography>
            <Typography variant="body2" sx={{ color: "#558b2f", fontStyle: "italic", mb: 2 }}>
              And Jesus grew in wisdom and stature, and in favor with God and man.
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#2e7d32", letterSpacing: "1px" }}>
              - 누가복음 Luke 2:52 -
            </Typography>
          </Box>

        </div>
      </div>
    </>
  );
};

export default Preschool;
