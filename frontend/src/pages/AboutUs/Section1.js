import { Typography } from "@mui/material";
import { LeftButton, RightButton } from "./SliderButton";

const Section1 = ({ fullpageApi }) => (
  <div className="section1Body sectionBody">
    <Typography
      style={{ textAlign: "left" }}
      variant="h1"
      fontWeight="800"
      sx={{ color: "white", mb: "30px", letterSpacing: "5px" }}
    >
      첫걸음
    </Typography>

    <LeftButton fullpageApi={fullpageApi} />
    <RightButton fullpageApi={fullpageApi} />

    <div className="slide" data-anchor="start">
      <Typography
        variant="h5"
        fontWeight="550"
        fontSize="1.3rem"
        sx={{ textAlign: "left", color: "white" }}
      >
        에드먼턴 온 교회는 2022년 4월 3일,
        <br />
        교회의 세속화에 따른 위기와 포스트 코로나라는 시대의 도전 가운데
        <br />
        하나님이 디자인하고 부르신 뜻대로 새롭게 태어난 교회 공동체입니다
      </Typography>
    </div>

    <div className="slide" data-anchor="story">
      <Typography
        className="lovegod"
        variant="h6"
        fontWeight="500"
        sx={{ textAlign: "left", color: "white" }}
      >
        Presbyterian Church in Canada 캐나다 장로교(이하 PCC)에 속했던
        공동체였으나, 2021년, 교단이 결혼의 정의에 대하여 "두 사람 간의 결합(즉,
        동성 간의 결혼)"을 인정하고 "성소수자"의 목사(teaching elders) 및
        장로(ruling elders) 안수를 허용하는 것으로 PCC 교단의 헌법과 교리를
        수정함에 따라, 세상의 가치와 타협하여 세속화 되어가는 교회에 대한
        애통함과, 진리의 말씀으로 그리스도의 몸 된 공동체를 지키고 세워가고자
        하는 소망함으로, PCC 교단을 떠나 새롭게 시작한 공동체입니다. 에드먼턴 온
        교회는 현재 소속된 교단은 없지만, 성령의 인도하심 가운데, 향후 공동체가
        바로 서며, 예수 그리스도의 복음으로 영혼을 구원하고, 하나님 나라의
        사랑과 공의를 함께 이뤄갈 수 있는 건강한 교단으로의 가입을 위해 준비
        중에 있습니다.
      </Typography>
    </div>
  </div>
);

export default Section1;
