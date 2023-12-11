import { Typography } from "@mui/material";
import "./online.css";
import "../NextGen/NextGen.css";
import YoutubePlaylist from "../../components/Online/YoutubePlaylist";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/img/Online/Worship.webp")',
  backgroundPositionX: "55%",
  backgroundPositionY: "38%",
};

const Worship = () => {
  return (
    <>
      <div className="title" style={titleBackground}>
        <div className="titleContent">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            찬양
          </Typography>
        </div>
      </div>

      <div className="main">
        <YoutubePlaylist src="https://www.youtube.com/embed/videoseries?list=PL-MVshquUXWHGJNBM8QtFDNqMpCwOKs6e" />
      </div>
    </>
  );
};

export default Worship;
