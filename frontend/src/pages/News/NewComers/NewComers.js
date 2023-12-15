import { Box, Typography } from "@mui/material";

import NewComersTimeline from "./NewComersTimeline";
import "../../NextGen/NextGen.css";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0.20)), url("/img/NewComers/NewComers.webp")',
};

const NewComers = () => {
  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            textAlign="center"
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            새가족
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <Typography sx={{ fontSize: "1.1em", color: "black" }}>
            <Box component="span" fontWeight="bold" fontSize="2em">
              온 교회
            </Box>
            에 오신 여러분을 환영합니다. 교회에 처음 오신 분들과 개인 사정으로
            이주해 오신 분들, 신앙의 회복을 위해 새로이 나아 오신 분들 모두를
            환영합니다. 새 공동체의 울타리 안에서 새로운 시작을 하시는 모든
            분들을 새가족으로 지칭하며 환영합니다.온 맘을 다해 하나님을 사랑하고
            온 힘을 다해 이웃을 사랑하는 공동체의 구성원으로 함께 세워져 가길
            소원합니다.
            <br /> <br />
            에드먼턴 온 공동체의 가족이 되심을 기쁨으로 환영합니다. 아래와 같은
            과정을 통해 온 공동체의 가족으로 함께 하게 됩니다.
          </Typography>

          <NewComersTimeline />
        </div>
      </div>
    </>
  );
};

export default NewComers;
