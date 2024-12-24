import { Typography } from "@mui/material";
import { LeftButton, RightButton } from "./SliderButton";

const Section3 = ({ fullpageApi }) => (
  <div className="section3Body sectionBody">
    <Typography
      variant="h3"
      fontWeight="1000"
      sx={{
        textAlign: "left",
        color: "white",
        letterSpacing: "5px",
      }}
    >
      부르심에 따른
      <br />
      공동체의 발걸음
    </Typography>

    <LeftButton fullpageApi={fullpageApi} />
    <RightButton fullpageApi={fullpageApi} />

    <div className="slide" data-anchor="lovegod">
      <Typography
        style={{ textAlign: "left" }}
        variant="h4"
        fontWeight="800"
        sx={{ color: "white" }}
      >
        온 맘 다해 하나님 사랑
      </Typography>
      <div className="lovegod">
        <Typography
          style={{ textAlign: "left" }}
          variant="h6"
          fontWeight="500"
          sx={{ color: "white", ml: "15px" }}
        >
          내가 주인 된 시대 속에서, 예배와 말씀을 통해 우리 삶의 창조자이며 참
          주인 되시며 인도자이신 성부 성자 성령 하나님의 사랑을 맛보고 나누며,
          하나님을 향한 우리의 사랑을 온전히 올려드립니다. 온 교회는 교회 성전
          중심으로 모이는 것만 중요시하는 공동체가 아니라, 모일 때 힘써 모여
          예배드리고 기도하지만 일상의 자리에서 하나님을 높이며 그의 나라와 의를
          구하며 말씀대로 살아가는 삶의 예배를 중요시하는 공동체입니다.
        </Typography>
      </div>
    </div>

    <div className="slide" data-anchor="loveneighbor">
      <Typography
        style={{ textAlign: "left" }}
        variant="h4"
        fontWeight="800"
        sx={{ color: "white" }}
      >
        온 힘 다해 이웃 사랑
      </Typography>

      <Typography
        style={{ textAlign: "left" }}
        variant="h6"
        fontWeight="500"
        sx={{ color: "white", ml: "15px" }}
      >
        내가 중심된 세상에서 하나님께 받은 은혜와 부르신 사명에 따라 공동체와
        이웃을 말씀대로 사랑하고 섬기며 살아갑니다.
      </Typography>
    </div>
  </div>
);

export default Section3;
