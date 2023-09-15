import { Typography } from "@mui/material";
import "./online.css";
import "../NextGen/NextGen.css";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/img/Online/MeditationON.jpg")',
};

const SundayService = () => {
  return (
    <>
      <div className="title" style={titleBackground}>
        <div className="titleContent">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            주일예배
          </Typography>
        </div>
      </div>
      {/* <Typography textAlign={"center"} sx={{ mt: "5px" }}>
        일상의 자리에서 매일 말씀을 묵상하고 그 말씀에 따라 살아갑니다. 정해진
        해설과 적용 대신 하나님과의 일 대일로 대면하며 말씀을 듣고 하나님과
        교제하는 시간을 통해 하나님과의 깊은 만남으로 나아가 언제 어디 서든 말씀
        중심의 삶을 살도록 합니다
      </Typography> */}
      <div className="main">
        <div className="video">
          <div className="video-container">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/videoseries?list=PL-MVshquUXWFGhRk0G7L_lrRsySmP3g4j"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default SundayService;
