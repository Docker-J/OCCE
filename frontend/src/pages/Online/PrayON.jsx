import { Typography } from "@mui/material";
import YoutubePlaylist from "../../components/Online/YoutubePlaylist";

const titleBackground = {
  backgroundImage: 'url("/img/Online/PrayON.webp")',
  // backgroundPositionX: "55%",
  backgroundPositionY: "26%",
};

const PrayON = () => {
  return (
    <>
      <title>기도 ON - OCCE</title>

      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            기도 ON
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <YoutubePlaylist src="https://www.youtube.com/embed/videoseries?si=oPDDWtdDPCFP9eGr&amp;list=PL-MVshquUXWHa_XYfdow82_H1cXKjhnbq" />
        </div>
      </div>
    </>
  );
};

export default PrayON;
