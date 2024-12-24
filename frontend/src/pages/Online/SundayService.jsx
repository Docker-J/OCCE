import { Typography } from "@mui/material";
import YoutubePlaylist from "../../components/Online/YoutubePlaylist";

const titleBackground = {
  backgroundImage: ' url("/img/Online/SundayService.webp")',
  backgroundPositionX: "50%",
  backgroundPositionY: "70%",
};

const SundayService = () => {
  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            주일예배
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <YoutubePlaylist src="https://www.youtube.com/embed/videoseries?list=PL-MVshquUXWFGhRk0G7L_lrRsySmP3g4j" />
        </div>
      </div>
    </>
  );
};

export default SundayService;
