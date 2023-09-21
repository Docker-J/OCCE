import { Typography } from "@mui/material";
import "./online.css";
import "../NextGen/NextGen.css";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/img/Online/PrayON.jpg")',
  // backgroundPositionX: "55%",
  backgroundPositionY: "26%",
};

const PrayON = () => {
  return (
    <>
      <div className="title" style={titleBackground}>
        <div className="titleContent">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            기도 ON
          </Typography>
        </div>
      </div>

      <div className="main">
        <div className="video">
          <div className="video-container">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/videoseries?list=PL-MVshquUXWGPQZ17w6vqSLGE4yJtYQ9H"
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

export default PrayON;
