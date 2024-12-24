import { Typography } from "@mui/material";
import { LeftButton, RightButton } from "./SliderButton";

const Section2 = ({ fullpageApi }) => (
  <div className="section2Body sectionBody">
    <Typography
      variant="h2"
      fontWeight="750"
      sx={{
        textAlign: "left",
        color: "white",
        letterSpacing: "3px",
      }}
    >
      이름,
      {/* <br />
    부르심과 사명 */}
    </Typography>

    <Typography
      variant="h3"
      fontWeight="750"
      sx={{
        textAlign: "left",
        color: "white",
        letterSpacing: "3px",
      }}
    >
      부르심과 사명
    </Typography>

    <LeftButton fullpageApi={fullpageApi} />
    <RightButton fullpageApi={fullpageApi} />

    <div className="slide" data-anchor="edmonton">
      <Typography
        variant="h4"
        fontWeight="800"
        sx={{ textAlign: "left", color: "white" }}
      >
        에드먼턴 Edmonton, Community
      </Typography>
      <Typography
        variant="h6"
        fontWeight="550"
        sx={{ textAlign: "left", color: "white" }}
      >
        의미) 우리의 삶의 자리
        <br />
        사명) 우리를 심으신 이 땅에 대한 사랑과 섬김, 기도와 복음 전파를 잊지
        말라는 하나님의 부르심
      </Typography>
    </div>

    <div className="slide" data-anchor="all">
      <Typography
        variant="h3"
        fontWeight="700"
        sx={{ textAlign: "left", color: "white" }}
      >
        온
      </Typography>
      <Typography
        variant="h6"
        fontWeight="550"
        sx={{ textAlign: "left", color: "white" }}
      >
        의미) 온 우리말의 ‘모든(All)’ 이라는 의미를 담고 있다. <br />
        사명) 온 마음을 다해 하나님을 사랑하고 온 힘을 다해 이웃을 사랑하라는
        부르심
      </Typography>
    </div>

    <div className="slide" data-anchor="on">
      <Typography
        variant="h3"
        fontWeight="600"
        sx={{ textAlign: "left", color: "white" }}
      >
        ON
      </Typography>
      <Typography
        variant="h6"
        fontWeight="550"
        sx={{ textAlign: "left", color: "white" }}
      >
        의미) Old & New 의 약자 <br />
        사명) 예부터 주신 진리의 말씀인 성경을 따라, 새로운 시대에 주어진 사명을
        삶의 자리에서 살아내고 그리스도의 복음을 증언하라는 부르심
      </Typography>
    </div>

    <div className="slide" data-anchor="building">
      <Typography
        variant="h3"
        fontWeight="700"
        sx={{ textAlign: "left", color: "white" }}
      >
        교회
      </Typography>
      <Typography
        variant="h6"
        fontWeight="550"
        sx={{ textAlign: "left", color: "white" }}
      >
        의미) 건물이 아니라 사람, 회중 <br />
        사명) 하나님이 택하고 부르신 사람들이 하나의 신앙 고백과 사명 가운데
        응답하며 합력하라는 부르심
      </Typography>
    </div>
  </div>
);

export default Section2;
