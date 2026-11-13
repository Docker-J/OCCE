import { Typography, Grid, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  DepartmentRibbon,
  DepartmentQuote,
  DepartmentCarousel,
  DepartmentFeatureCard,
  DepartmentClosingCard,
} from "./components";

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

const ribbonItems = [
  {
    icon: GroupsIcon,
    label: "대상",
    value: "만 5세(K)까지",
  },
  {
    icon: AccessTimeIcon,
    label: "모임 시간",
    value: "주일 오후 4시",
  },
  {
    icon: PlaceIcon,
    label: "장소",
    value: "Preschool Room",
  },
];

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

      <div
        className="container-wrapper"
        style={{
          backgroundColor: "#fcfbf9",
          paddingBottom: "100px",
          paddingTop: "50px",
          overflowX: "hidden",
        }}
      >
        <div
          className="container"
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
        >
          {/* 1. Dashboard Ribbon */}
          <DepartmentRibbon
            themeColor="#558b2f"
            themeBgColor="#f1f8e9"
            borderColor="1px solid rgba(139, 195, 74, 0.4)"
            shadowColor="0 12px 32px rgba(139, 195, 74, 0.12)"
            items={ribbonItems}
          />

          {/* 2. Main Bible Verse Quote */}
          <DepartmentQuote
            quote={
              <>
                더러는 좋은 땅에 떨어지매 자라 무성하여 결실하였으니 <br />
                삼십 배나 육십 배나 백 배가 되었느니라 하시고
              </>
            }
            subQuote={
              <>
                Still other seed fell on good soil. It came up, grew and produced a crop, <br />
                some multiplying thirty, some sixty, some a hundred times.
              </>
            }
            reference="- 마가복음 Mark 4:8 -"
            themeColor="#558b2f"
            iconColor="rgba(139, 195, 74, 0.2)"
          />

          {/* 3. Photo Gallery Carousel */}
          <DepartmentCarousel
            images={imgs}
            dotColor="#558b2f"
            paddingTop="70%"
            alt="Preschool Activity"
          />

          {/* 4. Vision & Activities Cards */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <DepartmentFeatureCard
                icon={FavoriteIcon}
                iconBgColor="#f1f8e9"
                iconColor="#558b2f"
                title="좋은 밭에 심겨지는 아이들"
                headerMb={4}
                animationDelay="0.3s"
              >
                <Typography
                  variant="body1"
                  sx={{ color: "#555", lineHeight: 1.8, wordBreak: "keep-all" }}
                >
                  <span style={{ fontWeight: 800, color: "#558b2f", fontSize: "1.1em" }}>
                    온교회 유아유치부
                  </span>
                  는 성령으로 인하여 부드러운 마음을 가진 우리 어린이들이 말씀을 배우며 아브라함의 하나님, 이삭의 하나님, 야곱의 하나님을 넘어 <strong>"나의 하나님"</strong>을 인정하고 순종함으로 나아갈 수 있는 기초를 다지는 시기입니다. 성부 하나님, 성자 예수님, 성령님과 교회 및 기본 교리 교육을 내용으로 합니다.
                </Typography>
              </DepartmentFeatureCard>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DepartmentFeatureCard
                icon={AutoStoriesIcon}
                iconBgColor="#fff8e1"
                iconColor="#fbc02d"
                title="주요 활동"
                headerMb={4}
                animationDelay="0.4s"
              >
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
                <Typography
                  variant="body1"
                  sx={{
                    color: "#555",
                    lineHeight: 1.7,
                    wordBreak: "keep-all",
                    pt: 2,
                    borderTop: "1px dashed rgba(0,0,0,0.1)",
                    fontSize: "0.95rem",
                  }}
                >
                  활동을 통해 지혜와 그 키가 자라가며 하나님과 사람에게 더 사랑스러워 가는 예수님을 닮은 어린이들이 되길 소망합니다.
                </Typography>
              </DepartmentFeatureCard>
            </Grid>
          </Grid>

          {/* 5. Closing Verse Box */}
          <DepartmentClosingCard
            bgColor="#f1f8e9"
            borderColor="rgba(139, 195, 74, 0.3)"
            title="예수는 지혜와 키가 자라가며 하나님과 사람에게 더욱 사랑스러워 가시더라"
            titleColor="#33691e"
            subtitle="And Jesus grew in wisdom and stature, and in favor with God and man."
            subtitleColor="#558b2f"
            reference="- 누가복음 Luke 2:52 -"
            referenceColor="#2e7d32"
          />
        </div>
      </div>
    </>
  );
};

export default Preschool;
