import { Typography } from "@mui/material";
import "./NextGen.css";

const Elementary = () => {
  return (
    <>
      <div className="title">
        <div className="titleContent">
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

      <div className="container">
        <Typography variant="h5" fontWeight={800}>
          모임
        </Typography>
        <Typography sx={{ fontSize: "1.1em" }}>
          나이: 1~6학년
          <br />
          시간: 주일 오후 4시
          <br />
          장소: Sunday School Room
          <br />※ 문의: 이수연 전도사
        </Typography>
        {/* <br />
        <Typography variant="h5" fontWeight={800}>
          KIDS ON the Tree
        </Typography> */}
      </div>
    </>
  );
};

export default Elementary;
