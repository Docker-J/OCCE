import { Typography } from "@mui/material";

const Elementary = () => {
  return (
    <>
      <h1>초등부</h1>
      <Typography sx={{ fontSize: "1.1em", color: "black" }}>
        나이: 1~6학년
        <br />
        시간: 주일 오후 4시
        <br />
        장소: Sunday School Room
        <br />※ 문의: 이수연 전도사
        <br />
        KIDS ON the Tree
        <br />
        앞으로 달려가서 보기 위하여 돌무화과나무에 올라가니 이는 예수께서 그리로
        지나가시게 됨이러라 So he ran ahead and climbed a sycamore-fig tree to
        see him, since Jesus was coming that way.
        <br />- 누가복음 Luke 19:4 -
      </Typography>
    </>
  );
};

export default Elementary;
