import { useLoaderData } from "react-router-dom";

import { ImageList, ImageListItem, Typography } from "@mui/material";

import "../../NextGen/NextGen.css";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/img/Online/MeditationON.webp")',
};

const AlbumPhotos = () => {
  const { title, images } = useLoaderData();

  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            {title}
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <ImageList variant="masonry" cols={3} gap={8}>
            {Object.values(images).map((image, index) => (
              <ImageListItem key={image.uid}>
                <img
                  style={{ objectFit: "contain" }}
                  key={index}
                  src={`https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${image}/MeditationON`}
                  alt="test"
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </div>
    </>
  );
};

export default AlbumPhotos;
