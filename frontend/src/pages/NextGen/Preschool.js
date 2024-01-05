import { Typography } from "@mui/material";
import "./NextGen.css";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/img/NextGen/KidsOnGoodSoil.webp")',
};

const Preschool = () => {
  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            유아유치부
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ color: "white" }}>
            KIDS ON Good Soil
          </Typography>

          <br />
          <Typography variant="body1" sx={{ color: "white" }}>
            더러는 좋은 땅에 떨어지매 자라 무성하여 결실하였으니 삼십 배나 육십
            배나 백 배가 되었느니라 하시고 <br />
            Still other seed fell on good soil. It came up, grew and produced a
            crop, some multiplying thirty, some sixty, some a hundred times.
            <br />- 마가복음 Mark 4:8 -
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <Typography variant="h5" fontWeight={800}>
            모임
          </Typography>
          <Typography className="subjectContent" sx={{ fontSize: "1.1em" }}>
            나이: 만 5세(kindergarten)까지
            <br />
            시간: 주일 오후 4시 <br />
            장소: Preschool Room <br />※ 문의: 김유정 전도사 <br />
          </Typography>
        </div>
      </div>
    </>
  );
};

export default Preschool;
