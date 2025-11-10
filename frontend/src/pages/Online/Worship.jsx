import { Typography } from "@mui/material";
import YoutubePlaylist from "../../components/Online/YoutubePlaylist";

const titleBackground = {
  backgroundImage: 'url("/img/Online/Worship.webp")',
  backgroundPositionX: "55%",
  backgroundPositionY: "38%",
};

const Worship = () => {
  return (
    <>
      <title>찬양 - OCCE</title>

      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            찬양
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <YoutubePlaylist src="https://www.youtube.com/embed/videoseries?list=PL-MVshquUXWHGJNBM8QtFDNqMpCwOKs6e" />
        </div>
      </div>
    </>
  );
};

export default Worship;
