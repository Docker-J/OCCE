import { Typography } from "@mui/material";
import "./NextGen.css";

const Preschool = () => {
  return (
    <>
      <h1>유아유치부</h1>

      <Typography
        sx={{ fontSize: "1.1em", color: "black" }}
        // style={{ textAlign: "center", maxWidth: "1536px" }}
      >
        나이: 만 5세(kindergarten)까지
        <br />
        시간: 주일 오후 4시 <br />
        장소: Preschool Room <br />※ 문의: 김유정 전도사 <br />
        KIDS ON Good Soil <br />
        더러는 좋은 땅에 떨어지매 자라 무성하여 결실하였으니 삼십 배나 육십 배나
        백 배가 되었느니라 하시고 Still other seed fell on good soil. It came
        up, grew and produced a crop, some multiplying thirty, some sixty, some
        a hundred times.
        <br />- 마가복음 Mark 4:8 -
      </Typography>
    </>
  );
};

export default Preschool;
