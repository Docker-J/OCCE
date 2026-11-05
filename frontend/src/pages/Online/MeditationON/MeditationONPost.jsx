import { ViewTransition } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router";

import { Box, Typography } from "@mui/material";

import { formatInTimeZone } from "date-fns-tz";

import CustomCarousel from "../../../common/CustomCarousel";
import { BackToListFab } from "../../../components/News/common";

const titleBackground = {
  backgroundImage: 'url("/img/Online/MeditationON.webp")',
};

const MeditationONPost = () => {
  const navigate = useNavigate();
  const { postID } = useParams();
  const { Images, Timestamp } = useLoaderData();
  const timestamp = formatInTimeZone(
    Timestamp,
    "America/Edmonton",
    "yyyy-MM-dd"
  );

  return (
    <>
      <title>{`${timestamp} QT A/S - OCCE`}</title>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 830,
              color: "white"
            }}>
            {timestamp}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 830,
              letterSpacing: "0.4em",
              pl: "0.4em",
              color: "white"
            }}>
            QT A/S
          </Typography>
        </div>
      </div>
      <div className="container-wrapper">
        <Box
          className="container"
          sx={{
            p: { xs: "0 !important", md: "1.5em !important" },
          }}
        >
          <div
            className="carousel-container"
            style={{
              // display: "flex",
              // flexDirection: "row",
              // alignItems: "center",
              position: "relative",
              maxWidth: "75vh",
              width: "100%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <CustomCarousel loop={false}>
              {Object.values(Images).map((image, index) => {
                const imgEl = (
                  <img
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      objectFit: "contain",
                    }}
                    src={`https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${image}/MeditationON`}
                    alt={`묵상 ON ${index + 1}`}
                    loading="lazy"
                  />
                );

                return index === 0 && postID ? (
                  <ViewTransition
                    key={index}
                    name={`meditation-cover-${postID}`}
                    share="morph"
                    default="none"
                  >
                    {imgEl}
                  </ViewTransition>
                ) : (
                  <div key={index}>{imgEl}</div>
                );
              })}
            </CustomCarousel>
          </div>
        </Box>
        <BackToListFab
          themeColor="#2563eb"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1, { viewTransition: true });
            } else {
              navigate("/online/meditationON", { viewTransition: true });
            }
          }}
        />
      </div>
    </>
  );
};

export default MeditationONPost;
