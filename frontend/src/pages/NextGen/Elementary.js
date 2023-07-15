import { Typography } from "@mui/material";
import "./NextGen.css";

const Elementary = () => {
  return (
    <>
      <h1>유초등부</h1>

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
        <br />
        <Typography variant="h5" fontWeight={800}>
          KIDS ON the Tree
        </Typography>
        <Typography sx={{ fontSize: "1.1em" }}>
          앞으로 달려가서 보기 위하여 돌무화과나무에 올라가니 이는 예수께서
          그리로 지나가시게 됨이러라 <br />
          So he ran ahead and climbed a sycamore-fig tree to see him, since
          Jesus was coming that way. - 누가복음 Luke 19:4 -
        </Typography>
      </div>
    </>
  );
};

export default Elementary;
