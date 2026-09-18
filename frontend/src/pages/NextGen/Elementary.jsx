import { Typography, Grid, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import ParkIcon from "@mui/icons-material/Park";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  DepartmentRibbon,
  DepartmentQuote,
  DepartmentCarousel,
  DepartmentFeatureCard,
  DepartmentClosingCard,
} from "./components";

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

const ribbonItems = [
  {
    icon: GroupsIcon,
    label: "대상",
    value: "1~6학년",
  },
  {
    icon: AccessTimeIcon,
    label: "모임 시간",
    value: "주일 오후 4시",
  },
  {
    icon: PlaceIcon,
    label: "장소",
    value: "Sunday School Room",
    valueStyle: {
      whiteSpace: "nowrap",
      letterSpacing: "-0.5px",
      fontSize: { xs: "1.25rem", md: "1rem", lg: "1.15rem" },
    },
  },
  {
    icon: PersonIcon,
    label: "담당",
    value: "이수연 전도사",
  },
];

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
            themeColor="#5d4037"
            themeBgColor="#efebe9"
            borderColor="1px solid rgba(121, 85, 72, 0.3)"
            shadowColor="0 12px 32px rgba(121, 85, 72, 0.1)"
            items={ribbonItems}
          />

          {/* 2. Main Bible Verse Quote */}
          <DepartmentQuote
            quote={
              <>
                앞으로 달려가서 보기 위하여 돌무화과나무에 올라가니 <br />
                이는 예수께서 그리로 지나가시게 됨이러라
              </>
            }
            subQuote={
              <>
                So he ran ahead and climbed a sycamore-fig tree to see him, <br />
                since Jesus was coming that way.
              </>
            }
            reference="- 누가복음 Luke 19:4 -"
            themeColor="#5d4037"
            iconColor="rgba(121, 85, 72, 0.2)"
          />

          {/* 3. Photo Gallery Carousel */}
          <DepartmentCarousel
            images={imgs}
            dotColor="#5d4037"
            paddingTop="65%"
            alt="Elementary Activity"
          />

          {/* 4. Vision & Activities Cards */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <DepartmentFeatureCard
                icon={ParkIcon}
                iconBgColor="#efebe9"
                iconColor="#5d4037"
                title="나무 위의 삭개오처럼"
                headerMb={4}
                animationDelay="0.3s"
              >
                <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.8, wordBreak: "keep-all" }}>
                  <span style={{ fontWeight: 800, color: "#5d4037", fontSize: "1.1em" }}>온교회 유초등부</span>는 
                  예수님을 보기 위해 나무 위에 올랐던 삭개오처럼 예수님을 찾고 구하며, 죄를 회개하고 구원받는 예수님의 사람이 되길 
                  소원하여 지어진 이름입니다. <br /><br />
                  예수님을 기쁘게 영접하고 구원받아, 그 말씀대로 사는 자녀와 제자 삼는 것을 목적으로 합니다.
                  주일 예배 후속 부서활동 뿐 아니라 평소 가정 주도 신앙 교육이 가능하도록 각 가정의 신앙 교육을 지원합니다.
                </Typography>
              </DepartmentFeatureCard>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DepartmentFeatureCard
                icon={LocalLibraryIcon}
                iconBgColor="#e8f5e9"
                iconColor="#2e7d32"
                title="주요 사역 내용"
                headerMb={2}
                animationDelay="0.4s"
              >
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
              </DepartmentFeatureCard>
            </Grid>
          </Grid>

          {/* 5. Closing Verse Box */}
          <DepartmentClosingCard
            bgColor="#efebe9"
            borderColor="rgba(121, 85, 72, 0.3)"
          >
            <Typography variant="h6" sx={{ color: "#4e342e", lineHeight: 1.8, wordBreak: "keep-all", fontWeight: 600 }}>
              하나님 사랑과 이웃 사랑이라는 공동체를 향한 부르심 안에 자라가는 우리 다음 세대 어린이들이,{" "}
              <span style={{ color: "#5d4037", fontWeight: 800 }}>
                부르신 삶의 자리에서 예수 그리스도의 자녀로서 받은 사랑을 나누고 실천하도록
              </span>{" "}
              지도합니다.
            </Typography>
          </DepartmentClosingCard>
        </div>
      </div>
    </>
  );
};

export default Elementary;
