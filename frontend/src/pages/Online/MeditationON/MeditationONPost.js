import { useLoaderData } from "react-router";

import { Box, Typography } from "@mui/material";

import CustomCarousel from "../../../common/CustomCarousel";

const titleBackground = {
  backgroundImage: 'url("/img/Online/MeditationON.webp")',
};

const MeditationONPost = () => {
  const images = useLoaderData();

  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            묵상 ON
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
            <CustomCarousel>
              {Object.values(images).map((image, index) => {
                // if (
                //   index === selectedItem ||
                //   index === selectedItem + 1 ||
                //   index === selectedItem - 1
                // ) {
                return (
                  <img
                    style={{ objectFit: "contain" }}
                    key={index}
                    src={`https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${image}/MeditationON`}
                    alt="test"
                    loading="lazy"
                  />
                );
                // } else return <></>;
              })}
            </CustomCarousel>
          </div>
        </Box>
      </div>
    </>
  );
};

export default MeditationONPost;
