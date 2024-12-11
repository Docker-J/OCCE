import { Typography } from "@mui/material";
import InfoCard from "../../components/NextGen/InfoCard";
import MinistriesCards from "../../components/NextGen/MinistriesCards";

const titleBackground = {
  backgroundImage: 'url("/img/NextGen/KidsOntheTree.webp")',
};

const imgs = [
  { src: "/img/NextGen/Elementary/1.jpg" },
  { src: "/img/NextGen/Elementary/2.jpg" },
  { src: "/img/NextGen/Elementary/3.jpg" },
  { src: "/img/NextGen/Elementary/4.jpg" },
  { src: "/img/NextGen/Elementary/5.jpg" },
  { src: "/img/NextGen/Elementary/6.jpg" },
];

const ministries = [
  { title: "예배(Worship)", content: "주일 예배 | 2:30 PM (본당)" },
  {
    title: "큐티 말씀 묵상/토론/크래프트/게임/찬양과 율동",
    content: "유초등부 모임 | 4 PM (Sunday School Room)",
  },
  {
    title: "매일 묵상 및 291일 성경통독 Bible Reading",
    content: "저학년 매일성경, 고학년 매일성경, 공동체 성경읽기 | 월-토요일",
  },
];

const Elementary = () => {
  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            textAlign="center"
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            유초등부
          </Typography>
          <Typography
            textAlign="center"
            variant="h5"
            fontWeight={700}
            sx={{ color: "white" }}
          >
            KIDS ON the Tree
          </Typography>

          <br />
          <Typography variant="body1" sx={{ color: "white" }}>
            앞으로 달려가서 보기 위하여 돌무화과나무에 올라가니 이는 예수께서
            그리로 지나가시게 됨이러라 <br />
            So he ran ahead and climbed a sycamore-fig tree to see him, since
            Jesus was coming that way.
            <br />- 누가복음 Luke 19:4 -
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <InfoCard
              age="1~6학년"
              time="주일 오후 4시"
              place="Sunday School Room"
              ask="이수연 전도사"
              imgs={imgs}
            />
          </div>

          <br />
          <Typography
            sx={{ fontSize: "1.1em", color: "black" }}
            // style={{ textAlign: "center", maxWidth: "1536px" }}
          >
            <Typography component="span" fontWeight="bold" fontSize="1.5em">
              온교회 유초등부
            </Typography>
            는 초등학교 1학년에서 6학년 연령의 다음 세대 자녀들이, 누가복음 19장
            2-10절에 나오는 말씀 속에서 예수님을 보기 위해 나무 위에 올랐던
            삭개오처럼 예수님을 찾고 구하며 죄를 회개하고 구원받는 예수님의
            사람이 되길 소원하여 지어진 이름입니다.
            <br />
            <br />
            유초등부(KIDS ON the Tree)는 예수님을 알고 싶어하고(눅 19:3),
            예수님을 기쁘게 영접하며(눅 19:6), 죄를 회개하고(눅 19:8), 예수님께
            구원받아(눅 19:9), 그 말씀대로 사는 자녀와 제자 삼는 것을 목적으로,
            온 가족 예배에 이어지는 연령별 부서 활동 시 주일 설교 말씀을
            중심으로 메시지 강화 교육과 적용 및 실천을 위한 토론 / 큐티 말씀
            묵상 / 크래프트 / 찬양과 율동 / 게임 등 다양한 활동을 가집니다.
            <br />
            <br />
            주일 예배 후속 부서활동 뿐 아니라 평소에 가정 주도 신앙 교육이
            가능하도록, 주 중에 학부모님들과의 소통을 통해, 절기 교육 및 매일
            큐티 안내와 도움이 될 만한 미디어 자료 안내 등으로 각 가정의 신앙
            교육을 지원합니다.
            <br />
            <br />
            하나님 사랑과 이웃 사랑이라는 온 교회 공동체를 향한 부르심 안에
            자라가는 우리 다음 세대 유초등부 어린이들이 매주일 예배와 부서활동,
            연중 달란트 잔치와 할렐루야 파티, 성경학교, 아우팅 등을 통해 부모,
            교사 스태프, 교회 가족들과 함께 어우러져 천국의 기쁨을 누릴 뿐
            아니라, 부르신 삶의 자리에서 하나님의 자녀요 예수 그리스도의
            자녀로서 받은 사랑을 나누고 실천하도록 지도합니다.
          </Typography>

          <MinistriesCards ministries={ministries} />
        </div>
      </div>
    </>
  );
};

export default Elementary;
