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
            청년부
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
            장소: Youth Room/Small Group Rooms <br />※ 문의: 김휘경 전도사
            <br />
          </Typography>
          {/* <br />
          <Typography variant="h5" fontWeight={800}>
            Brunch Club
          </Typography>
          <Typography className="subjectContent" sx={{ fontSize: "1.1em" }}>
            - 브런치 클럽은 주님의 가르침과 초대 교회의 본을 따라 매 주일
            정기적인 식탁의 교제를 나눕니다.
            <br />- 브런치 클럽은 경청의 예배를 드리는 시간입니다.
            <br />- 함께 식사하며 삶을 나누는 나눔의 시간은 하나님이 내 삶에
            주신 은혜를 나누는 시간이 아니라 다른 이의 시시콜콜한 삶의 이야기
            속에서 하나님의 은혜를 찾기 위해 경청하는 시간입니다.
            <br />- 이를 통해 사랑과 감사를 나누고 그리스도의 몸 된 공동체로
            세워져 가는 청년 공동체가 됩니다.
          </Typography> */}
        </div>
      </div>
    </>
  );
};

export default YoungAdult;
