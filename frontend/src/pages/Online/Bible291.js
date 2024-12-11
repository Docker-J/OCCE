import { Typography } from "@mui/material";
import YoutubePlaylist from "./../../components/Online/YoutubePlaylist";
import { useLoaderData } from "react-router-dom";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/img/Online/Sermon.webp")',
  backgroundPositionX: "52%",
};

const Bible291 = () => {
  const { today, match } = useLoaderData();

  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.3em", pl: "0.4em", color: "white" }}
          >
            291일 성경 1독
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <Typography variant="h5" fontWeight={830}>
            {today}
          </Typography>

          {match ? (
            <>
              <Typography variant="h5" fontWeight={830}>
                오늘의 1독 말씀은 "{`${match.read}`}" 입니다.
              </Typography>
              <br />
              <YoutubePlaylist
                src={`https://www.youtube.com/embed/videoseries?list=PL-${
                  match.link.split("PL-")[1]
                }`}
              />
            </>
          ) : (
            <Typography variant="h5" fontWeight={830}>
              오늘은 성경 1독을 쉬어가는 날입니다
            </Typography>
          )}

          <br />

          <img style={{ maxWidth: "100%" }} src="/img/Online/291Bible/1.webp" />
          <img style={{ maxWidth: "100%" }} src="/img/Online/291Bible/2.webp" />
          <img style={{ maxWidth: "100%" }} src="/img/Online/291Bible/3.webp" />
          <img style={{ maxWidth: "100%" }} src="/img/Online/291Bible/4.webp" />
        </div>
      </div>
    </>
  );
};

export default Bible291;
