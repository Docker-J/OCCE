import { Typography } from "@mui/material";
import "./online.css";

const Sermon = () => {
  return (
    <div className="main">
      <h1>말씀</h1>
      {/* <Typography textAlign={"center"} sx={{ mt: "5px" }}>
        일상의 자리에서 매일 말씀을 묵상하고 그 말씀에 따라 살아갑니다. 정해진
        해설과 적용 대신 하나님과의 일 대일로 대면하며 말씀을 듣고 하나님과
        교제하는 시간을 통해 하나님과의 깊은 만남으로 나아가 언제 어디 서든 말씀
        중심의 삶을 살도록 합니다
      </Typography> */}

      <div className="video">
        <div className="video-container">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/videoseries?list=PL-MVshquUXWFkxA1rry9X2d4WAvR-kesH"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Sermon;
