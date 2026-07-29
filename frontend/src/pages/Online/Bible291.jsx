import { Typography } from "@mui/material";
import YoutubePlaylist from "./../../components/Online/YoutubePlaylist";
import { useLoaderData } from "react-router";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../common/slick/slick-default-dots.css";

const titleBackground = {
  backgroundImage: 'url("/img/Online/Sermon.webp")',
  backgroundPositionX: "52%",
};

const Bible291 = () => {
  const { today, match } = useLoaderData();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dotsClass: "slick-dots slick-default-dots",
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <>
      <title>291일 성경 1독 - OCCE</title>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 830,
              letterSpacing: "0.3em",
              pl: "0.4em",
              color: "white"
            }}>
            291일 성경 1독
          </Typography>
        </div>
      </div>
      <div className="container-wrapper">
        <div className="container">
          <Typography variant="h5" sx={{
            fontWeight: 830
          }}>
            {today}
          </Typography>

          {match ? (
            <div style={{ marginTop: "24px", padding: "24px", backgroundColor: "#f9f9f9", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
              <Typography variant="h5" sx={{
                fontWeight: 830, mb: 3, color: "primary.main"
              }}>
                오늘의 1독 말씀은 "{`${match.read}`}" 입니다.
              </Typography>
              <YoutubePlaylist
                src={`https://www.youtube.com/embed/videoseries?list=PL-${
                  match.link.split("PL-")[1]
                }`}
              />
            </div>
          ) : (
            <Typography variant="h5" sx={{
              fontWeight: 830
            }}>
              오늘은 성경 1독을 쉬어가는 날입니다
            </Typography>
          )}

          <div style={{ marginTop: "40px", paddingBottom: "40px", width: "100%", overflow: "hidden" }}>
            <Slider {...sliderSettings}>
              <div><img style={{ width: "100%", display: "block", borderRadius: "12px" }} src="/img/Online/291Bible/1.webp" alt="안내 1" /></div>
              <div><img style={{ width: "100%", display: "block", borderRadius: "12px" }} src="/img/Online/291Bible/2.webp" alt="안내 2" /></div>
              <div><img style={{ width: "100%", display: "block", borderRadius: "12px" }} src="/img/Online/291Bible/3.webp" alt="안내 3" /></div>
              <div><img style={{ width: "100%", display: "block", borderRadius: "12px" }} src="/img/Online/291Bible/4.webp" alt="안내 4" /></div>
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bible291;
