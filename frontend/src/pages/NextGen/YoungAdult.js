import { Typography } from "@mui/material";
import "./NextGen.css";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/img/NextGen/4.jpg")',
};

const YoungAdult = () => {
  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            온마음 청년부
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ color: "white" }}>
            Heart ON God YOUNG ADULTS
          </Typography>

          <br />
          <Typography variant="body1" sx={{ color: "white" }}>
            하늘에 있는 것에 마음을 두십시오.
            <br />
            Set your hearts on things above.
            <br />- 골로새서 Colossians 3:1b -
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <Typography variant="h5" fontWeight={800}>
            모임
          </Typography>
          <Typography className="subjectContent" sx={{ fontSize: "1.1em" }}>
            시간: 주일 오후 4시 <br />
            장소: Youth Room, Small Group Rooms <br />※ 문의: 김휘경 전도사
            <br />
          </Typography>
          <br />
          <Typography sx={{ fontSize: "1.1em", color: "black" }}>
            목적 예수 그리스도의 이름으로 모여, 하나님의 성령으로 한 마음을
            품고, 하나님과 이웃에 대한 사랑이 점점 커져가며, 그 사랑으로
            세상에서 하나님 나라의 공의와 정의를 이뤄가는 청년 공동체를
            세워갑니다.
            <br />
            <br />
            주제 말씀: 에스겔 Ezekiel 11:19-20 내가 그들에게 한 마음을 주고 그
            속에 새 영을 주며 그 몸에서 돌 같은 마음을 제거하고 살처럼 부드러운
            마음을 주어 내 율례를 따르며 내 규례를 지켜 행하게 하리니 그들은 내
            백성이 되고 나는 그들의 하나님이 되리라 I will give them an
            undivided heart and put a new spirit in them; I will remove from
            them their heart of stone and give them a heart of flesh. Then they
            will follow my decrees and be careful to keep my laws. They will be
            my people, and I will be their God.
            <br />
            <br />
            모임 및 사역 안내 예배(worship): 주일예배, 주중예배 교육(teaching):
            입교/세례 교육, 성경공부, 제자훈련, 기도회, 수련회 교제(fellowship):
            정원모임, 친교(식사, 활동), 지역 청년들과의 교류/연합 봉사(serving):
            교회사역 봉사, 지역사회 봉사/구제 전도(preaching): 선교지 후원,
            단기선교 참여
          </Typography>
        </div>
      </div>
    </>
  );
};

export default YoungAdult;
