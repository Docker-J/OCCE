import { useLoaderData } from "react-router-dom";

import { Carousel } from "react-responsive-carousel";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css";

import "../../NextGen/NextGen.css";
import { Typography } from "@mui/material";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/img/Online/MeditationON.jpg")',
};

const MeditationONPost = () => {
  const images = useLoaderData();

  console.log(images);

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
        style={{
          position: "absolute",
          width: "90%",
          maxWidth: "900px",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: "30px",
        }}
      >
        <Carousel styles={styles}>
          {Object.values(images).map((image, key) => (
            <img key={key} src={image} alt="test" />
          ))}
        </Carousel>
      </div>
    </>
  );
};

export default MeditationONPost;
