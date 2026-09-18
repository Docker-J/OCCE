import { Typography, Grid, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  DepartmentRibbon,
  DepartmentQuote,
  DepartmentCarousel,
  DepartmentFeatureCard,
  DepartmentClosingCard,
} from "./components";

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
  },
  {
    title: "교육",
    subtitle: "Teaching",
    content: ["입교/세례 교육", "성경공부, 제자훈련", "기도회, 수련회"],
  },
  {
    title: "교제",
    subtitle: "Fellowship",
    content: ["정원모임", "친교(식사, 활동)", "지역 청년들과의 교류/연합"],
  },
  {
    title: "봉사",
    subtitle: "Serving",
    content: ["교회사역", "봉사", "지역사회 봉사/구제"],
  },
  {
    title: "전도",
    subtitle: "Preaching",
    content: ["선교지 후원", "단기선교 참여"],
  },
];

const ribbonItems = [
  {
    icon: GroupsIcon,
    label: "대상",
    value: "청년(대학생/직장인)",
    valueStyle: {
      whiteSpace: "nowrap",
      letterSpacing: "-0.5px",
      fontSize: { xs: "1.25rem", md: "1.05rem", lg: "1.15rem" },
    },
  },
  {
    icon: AccessTimeIcon,
    label: "모임 시간",
    value: "주일 오후 4시",
  },
  {
    icon: PlaceIcon,
    label: "장소",
    value: "Youth Room",
  },
  {
    icon: PersonIcon,
    label: "담당",
    value: "김휘경 목사",
  },
];

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
          <Typography
            variant="h5"
            sx={{ textAlign: "center", fontWeight: 700, color: "white", mt: 1, letterSpacing: "-1px" }}
          >
            Hearts ON God YOUNG ADULTS
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
            themeColor="#c62828"
            themeBgColor="#ffebee"
            borderColor="1px solid rgba(211, 47, 47, 0.2)"
            shadowColor="0 12px 32px rgba(211, 47, 47, 0.08)"
            items={ribbonItems}
          />

          {/* 2. Main Bible Verse Quote */}
          <DepartmentQuote
            variant="h4"
            quote="하늘에 있는 것에 마음을 두십시오."
            subQuote="Set your hearts on things above."
            reference="- 골로새서 Colossians 3:1b -"
            themeColor="#c62828"
            iconColor="rgba(211, 47, 47, 0.15)"
          />

          {/* 3. Photo Gallery Carousel */}
          <DepartmentCarousel
            images={imgs}
            dotColor="#c62828"
            alt="Young Adult Activity"
          />

          {/* 4. Vision & Activities Cards */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <DepartmentFeatureCard
                icon={FavoriteIcon}
                iconBgColor="#ffebee"
                iconColor="#c62828"
                title="하늘에 마음을 두는 청년 공동체"
                headerMb={4}
                animationDelay="0.3s"
              >
                <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.8, wordBreak: "keep-all" }}>
                  <span style={{ fontWeight: 800, color: "#c62828", fontSize: "1.1em" }}>온교회 청년부</span>는 
                  예수 그리스도의 이름으로 모여, 하나님의 성령으로 한 마음을 품고, 하나님과 이웃에 대한 사랑이 점점 커져가며, 
                  그 사랑으로 세상에서 하나님 나라의 공의와 정의를 이뤄가는 청년 공동체를 세워갑니다.
                </Typography>
              </DepartmentFeatureCard>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DepartmentFeatureCard
                icon={VolunteerActivismIcon}
                iconBgColor="#ffebee"
                iconColor="#c62828"
                title="모임 및 사역 내용"
                headerMb={2}
                animationDelay="0.4s"
              >
                <List sx={{ mt: 2 }}>
                  {ministries.map((ministry, idx) => (
                    <ListItem key={idx} sx={{ px: 0, py: 1.5, alignItems: "flex-start" }}>
                      <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                        <CheckCircleIcon sx={{ color: "#e53935" }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}>
                            {ministry.title}{" "}
                            <span style={{ color: "#888", fontSize: "0.85em", fontWeight: 500 }}>
                              {ministry.subtitle}
                            </span>
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ color: "#666", lineHeight: 1.5 }}>
                            {ministry.content.join(", ")}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </DepartmentFeatureCard>
            </Grid>
          </Grid>

          {/* 5. Closing Verse Box */}
          <DepartmentClosingCard
            bgColor="#ffebee"
            borderColor="rgba(211, 47, 47, 0.3)"
            title="내가 그들에게 한 마음을 주고 그 속에 새 영을 주며 그 몸에서 돌 같은 마음을 제거하고 살처럼 부드러운 마음을 주어 내 율례를 따르며 내 규례를 지켜 행하게 하리니 그들은 내 백성이 되고 나는 그들의 하나님이 되리라"
            titleColor="#b71c1c"
            subtitle="I will give them an undivided heart and put a new spirit in them; I will remove from them their heart of stone and give them a heart of flesh. Then they will follow my decrees and be careful to keep my laws. They will be my people, and I will be their God."
            subtitleColor="#c62828"
            reference="- 에스겔 Ezekiel 11:19-20 -"
            referenceColor="#d32f2f"
          />
        </div>
      </div>
    </>
  );
};

export default YoungAdult;
