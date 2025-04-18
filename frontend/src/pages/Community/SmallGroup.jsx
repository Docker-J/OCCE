import { Typography } from "@mui/material";

const titleBackground = {
  backgroundImage: 'url("/img/Community/SmallGroup.webp")',
  backgroundPositionY: "58%",
};

const SmallGroup = () => {
  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            소그룹
          </Typography>
          <Typography
            textAlign="center"
            variant="h5"
            fontWeight={700}
            sx={{ color: "white" }}
          >
            정원
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <Typography className="explain" sx={{ fontSize: "1.1em" }}>
            <Typography component="span" fontWeight="bold" fontSize="2em">
              '정원'
            </Typography>
            은 하나님께서 태초에 사람에게 허락하신 에덴의 모형입니다. '정원'의
            주인은 하나님이시고, '정원사'는 예수 그리스도이십니다. '정원지기'는
            주께서 허락하신 공동체 내 영적 리더들로 주께서 기르시고 꽃피우시는
            정원을 살피고 진실하고 충성된 청지기로서 섬기게 됩니다.'정원
            가족'들은 태초에 에덴 동산에서 주님의 창조의 손길과 섭리를 누리며
            하나님과 동행하던 사람들과 피조물처럼 하나님의 은혜를 누리고 그
            말씀에 순종하며 복된 삶을 살아가는 공동체입니다. <br />
            <br />온 교회의 소그룹인 '정원'은, 그리스도 안에서 새로운 피조물로
            태어나 하나님의 가족 된 우리들이 말씀 안에 살아계신 하나님을 통해
            태초의 에덴을 경험하는 행복한 만남과 나눔과 성장 그리고 지상 최대
            명령인 복음 전파의 자리입니다.
          </Typography>
        </div>
      </div>
    </>
  );
};

export default SmallGroup;
