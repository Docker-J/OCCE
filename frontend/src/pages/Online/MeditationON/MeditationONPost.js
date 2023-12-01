import { useLoaderData } from "react-router-dom";

import { Typography } from "@mui/material";

import "../../NextGen/NextGen.css";
import CustomCarousel from "../../../common/CustomCarousel";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/img/Online/MeditationON.webp")',
};

const MeditationONPost = () => {
  const images = useLoaderData();

  return (
    <>
      <div className="title" style={titleBackground}>
        <div className="titleContent">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            묵상 ON
          </Typography>
        </div>
      </div>
      <div
        className="carousel-container"
        style={{
          // display: "flex",
          // flexDirection: "row",
          // alignItems: "center",
          position: "relative",
          width: "95%",
          maxWidth: "800px",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: "30px",
          marginBottom: "30px",
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
    </>
  );
};

export default MeditationONPost;
