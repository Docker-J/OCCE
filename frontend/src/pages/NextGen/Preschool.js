import { Typography } from "@mui/material";
import "./NextGen.css";
import InfoCard from "../../components/NextGen/InfoCard";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/img/NextGen/KidsOnGoodSoil.webp")',
};

const imgs = [
  { src: "/img/NextGen/Preschool/1.jpg" },
  // { src: "/img/NextGen/Preschool/2.jpg" },
  // { src: "/img/NextGen/Preschool/3.jpg" },
  // { src: "/img/NextGen/Preschool/4.jpg" },
  { src: "/img/NextGen/Preschool/5.jpg" },
];

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
          <InfoCard
            age="만 5세(kindergarten)까지"
            time="주일 오후 4시"
            place="Preschool Room"
            ask="김유정 전도사"
            imgs={imgs}
          />

          <br />

          <Typography sx={{ fontSize: "1.1em", color: "black" }}>
            <Typography component="span" fontWeight="bold" fontSize="1.5em">
              온교회 유아유치부는
            </Typography>
            &nbsp;성령으로 인하여 부드러운 마음을 가진 우리 어린이들이 말씀을
            배우며 아브라함의 하나님, 이삭의 하나님, 야곱의 하나님을 넘어 "나의
            하나님"을 인정하고 순종함으로 나아갈 수 있는 기초를 다지는
            시기입니다. 성부 하나님, 성자 예수님, 성령님과 교회 및 기본 교리
            교육을 내용으로 합니다.
            <br />
            <br />
            매달 활동 내용으로는 찬양과 말씀, 만들기, 전체 활동, 소그룹 활동,
            야외 활동, 생일 잔치, 말씀 암송 등이 있고, 추가적으로 절기 단위
            달란트 잔치와 성경학교가 있습니다. 활동을 통해 누가복음 2장 52절
            말씀처럼 지혜와 그 키가 자라가며 하나님과 사람에게 더 사랑스러워
            가는 예수님을 닮은 어린이들이 되길 소망합니다.
            <br />
            <br />
            예수는 지혜와 키가 자라가며 하나님과 사람에게 더욱 사랑스러워
            가시더라
            <br />
            And Jesus grew in wisdom and stature, and in favor with God and man.
            <br />- 누가복음 Luke 2:52 -
          </Typography>
        </div>
      </div>
    </>
  );
};

export default Preschool;
