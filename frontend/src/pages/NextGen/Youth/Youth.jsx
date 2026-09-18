import { Typography, Box, Grid } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import TerrainIcon from "@mui/icons-material/Terrain";
import HearingIcon from "@mui/icons-material/Hearing";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import YouthTimeline from "./YouthTimeline";

import {
  DepartmentRibbon,
  DepartmentQuote,
  DepartmentCarousel,
  DepartmentFeatureCard,
  DepartmentClosingCard,
} from "../components";

const titleBackground = {
  backgroundImage: 'url("/img/NextGen/KidsOntheRock.webp")',
  backgroundPositionY: "52%",
};

const imgs = [
  { src: "/img/NextGen/Youth/1.webp" },
  { src: "/img/NextGen/Youth/2.webp" },
  { src: "/img/NextGen/Youth/3.webp" },
];

const ribbonItems = [
  {
    icon: GroupsIcon,
    label: "대상",
    value: "7~12학년",
  },
  {
    icon: AccessTimeIcon,
    label: "모임 시간",
    value: "주일 오후 4시",
  },
  {
    icon: PlaceIcon,
    label: "장소",
    value: "Fireside Room",
  },
  {
    icon: PersonIcon,
    label: "담당",
    value: "김휘경 목사",
  },
];

const Youth = () => {
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
            themeColor="#455a64"
            themeBgColor="#eceff1"
            borderColor="1px solid rgba(84, 110, 122, 0.3)"
            shadowColor="0 12px 32px rgba(84, 110, 122, 0.1)"
            items={ribbonItems}
          />

          {/* 2. Main Bible Verse Quote */}
          <DepartmentQuote
            quote={
              <>
                그러므로 누구든지 나의 이 말을 듣고 행하는 자는 <br />그 집을 반석 위에 지은 지혜로운 사람 같으리니
              </>
            }
            subQuote={
              <>
                Therefore everyone who hears these words of mine and puts them into practice <br />
                is like a wise man who built his house on the rock.
              </>
            }
            reference="- 마태복음 Matthew 7:24 -"
            themeColor="#455a64"
            iconColor="rgba(84, 110, 122, 0.2)"
          />

          {/* 3. Photo Gallery Carousel */}
          <DepartmentCarousel
            images={imgs}
            dotColor="#455a64"
            paddingTop="65%"
            alt="Youth Activity"
          />

          {/* 4. Vision & Activities Cards */}
          <Grid container spacing={4} sx={{ mb: 10 }}>
            {/* Vision Card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <DepartmentFeatureCard
                icon={TerrainIcon}
                iconBgColor="#eceff1"
                iconColor="#455a64"
                title="말씀의 반석 위에"
                headerMb={4}
                animationDelay="0.3s"
              >
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
                  는 말씀이신 그리스도의 <strong>"반석 위에"</strong> 집을 짓고, <strong>"하나님 앞에서 지혜로운 사람"</strong>으로 함께 세워져 가기를 소망하는 청소년 그룹입니다. <br />
                  <br />
                  세상의 가치관과 기준이 아니라, 하나님의 말씀만이 영원한 생명의 반석임을 배우고 그 배운 것을 삶에서 살아내는 가장 복된 인생을 살아가도록 함께 반석 위에 집을 지어 갈 것입니다.
                </Typography>
              </DepartmentFeatureCard>
            </Grid>

            {/* Activities Card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <DepartmentFeatureCard
                icon={DirectionsRunIcon}
                iconBgColor="#e3f2fd"
                iconColor="#1976d2"
                title="들음과 행함"
                headerMb={2}
                animationDelay="0.4s"
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#555",
                    lineHeight: 1.8,
                    wordBreak: "keep-all",
                    mb: 3,
                  }}
                >
                  우리의 목표를 이루기 위해 신앙의 <strong>“들음”과 “행함”</strong>에 집중합니다.
                </Typography>

                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <HearingIcon sx={{ color: "#1976d2", mr: 1.5, mt: 0.5 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}>
                      생명의 말씀을 듣다
                    </Typography>
                    <Typography sx={{ color: "#666", fontSize: "0.95rem" }}>
                      예배 / 성경읽기 / 묵상 / 교리문답을 통하여 생명이신 예수 그리스도의 말씀을 듣습니다.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <DirectionsRunIcon sx={{ color: "#1976d2", mr: 1.5, mt: 0.5 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}>
                      들은 말씀을 행하다
                    </Typography>
                    <Typography sx={{ color: "#666", fontSize: "0.95rem" }}>
                      교제 / 수련회 / 선교활동을 통하여 들은 말씀을 실천하고 행합니다.
                    </Typography>
                  </Box>
                </Box>
              </DepartmentFeatureCard>
            </Grid>
          </Grid>

          {/* 5. Closing Highlight Box & Timeline */}
          <DepartmentClosingCard
            bgColor="#eceff1"
            borderColor="rgba(84, 110, 122, 0.3)"
            title="하나님 앞에서 지혜로운 사람"
            titleColor="#263238"
            titleVariant="h5"
            subtitle="A wise person before God"
            subtitleColor="#546e7a"
            sx={{ mb: 8 }}
          >
            <Box sx={{ mt: 4 }}>
              <YouthTimeline />
            </Box>
          </DepartmentClosingCard>
        </div>
      </div>
    </>
  );
};

export default Youth;
