import { Typography } from "@mui/material";
import YoutubePlaylist from "../../components/Online/YoutubePlaylist";

const titleBackground = {
  backgroundImage: 'url("/img/Online/Sermon.webp")',
  backgroundPositionX: "52%",
};

const Sermon = () => {
  return (
    <>
      <title>말씀 - OCCE</title>

      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            말씀
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <YoutubePlaylist src="https://www.youtube.com/embed/videoseries?list=PL-MVshquUXWFkxA1rry9X2d4WAvR-kesH" />
        </div>
      </div>
    </>
  );
};

export default Sermon;
