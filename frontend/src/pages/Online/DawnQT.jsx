import { Typography } from "@mui/material";
import YoutubePlaylist from "../../components/Online/YoutubePlaylist";

const titleBackground = {
  backgroundImage: 'url("/img/Online/DawnQT.webp")',
  // backgroundPositionX: "55%",
  backgroundPositionY: "15%",
};

const DawnQT = () => {
  return (
    <>
      <title>새벽 QT - OCCE</title>

      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            새벽 QT
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <YoutubePlaylist src="https://www.youtube.com/embed/videoseries?list=PL-MVshquUXWGPQZ17w6vqSLGE4yJtYQ9H" />
        </div>
      </div>
    </>
  );
};

export default DawnQT;
