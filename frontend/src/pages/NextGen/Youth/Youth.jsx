import { Typography } from "@mui/material";
import YouthTimeline from "./YouthTimeline";

import InfoCard from "../../../components/NextGen/InfoCard";

const titleBackground = {
  backgroundImage: 'url("/img/NextGen/KidsOntheRock.webp")',
  backgroundPositionY: "52%",
};

const imgs = [
  { src: "/img/NextGen/Youth/1.webp" },
  { src: "/img/NextGen/Youth/2.webp" },
  { src: "/img/NextGen/Youth/3.webp" },
];

const Youth = () => {
  return (
    <>
      <title>중고등부 - OCCE</title>

      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            textAlign="center"
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            중고등부
          </Typography>
          <Typography
            textAlign="center"
            variant="h5"
            fontWeight={700}
            sx={{ color: "white" }}
          >
            YOUTH ON the Rock
          </Typography>

          <br />
          <Typography variant="body1" sx={{ color: "white" }}>
            그러므로 누구든지 나의 이 말을 듣고 행하는 자는 그 집을 반석 위에
            지은 지혜로운 사람 같으리니
            <br />
            Therefore everyone who hears these words of mine and puts them into
            practice is like a wise man who built his house on the rock.
            <br />- 마태복음 Matthew 7:24 -
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <InfoCard
              age="7~12학년"
              time="주일 오후 4시"
              place="Fireside Room"
              ask="김휘경 전도사"
              imgs={imgs}
            />
          </div>

          <br />

          <Typography sx={{ fontSize: "1.1em", color: "black" }}>
            <Typography component="span" fontWeight="bold" fontSize="1.5em">
              온교회 중고등부
            </Typography>
            는 마태복음 7장 24절을 주제 말씀으로 하여, 말씀이신 그리스도의 "반석
            위에" 집을 짓고, "하나님 앞에서 지혜로운 사람"으로 함께 세워져
            가기를 소망하는, 7학년부터 12학년까지의 중고등부 그룹입니다. 이
            목표를 이루기 위해서 “들음”과 “행함”에 집중합니다. 예배 / 성경읽기 /
            묵상 / 교리문답을 통하여 생명이신 예수 그리스도의 말씀을 듣고, 교제
            / 수련회 / 선교활동을 통하여 들은 말씀을 행합니다. 이러한 소망과
            실천을 바탕으로, 세상의 가치관과 기준이 아니라 하나님의 말씀만이
            영원한 생명의 반석임을 배우고, 배운 것을 삶에서 살아내는 가장 복된
            인생을 살아가도록, 함께 반석 위에 집을 지어 갈 것입니다.
          </Typography>
          <Typography
            sx={{
              fontSize: "1.3em",
              color: "black",
              textAlign: "center",
              mt: "2em",
              fontWeight: "bold",
            }}
          >
            하나님 앞에서 지혜로운 사람
            <br />A wise person before God
          </Typography>
          <YouthTimeline />
        </div>
      </div>
    </>
  );
};

export default Youth;
