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
            YOUNG ADULTS ON Maeum
          </Typography>

          <br />
          <Typography variant="body1" sx={{ color: "white" }}>
            대답하여 이르되 네 마음을 다하며 목숨을 다하며 힘을 다하며 뜻을
            다하여 주 너의 하나님을 사랑하고 또한 네 이웃을 네 자신 같이
            사랑하라 하였나이다
            <br />
            He answered, "'Love the Lord your God with all your heart and with
            all your soul and with all your strength and with all your mind';
            and,'Love your neighbor as yourself.'""
            <br />- 누가복음 Luke 10:27 -
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <Typography variant="h5" fontWeight={800}>
            모임
          </Typography>
          <Typography className="subjectContent" sx={{ fontSize: "1.1em" }}>
            Brunch Club: 주일 오전 11시 30분 <br />
            성경 공부: 주일 오후 4시 <br />※ 문의: 안주영 목사 <br />
          </Typography>
          <br />
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
          </Typography>
        </div>
      </div>
    </>
  );
};

export default YoungAdult;
