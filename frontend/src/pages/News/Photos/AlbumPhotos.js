import { useLoaderData } from "react-router-dom";

import { ImageList, ImageListItem } from "@mui/material";

const AlbumPhotos = () => {
  const images = useLoaderData();

  console.log(images);

  return (
    <>
      <h1>{images.title}</h1>
      <div
        style={{
          position: "absolute",
          width: "100%",
          maxWidth: "1500px",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: "30px",
        }}
      >
        <ImageList variant="masonry" cols={3} gap={2.5}>
          {Object.values(images.photos).map((image, key) => (
            <ImageListItem key={image.uid}>
              <img
                // src={`${
                //   item.data().images[0]
                // }?w=164&h=164&fit=crop&auto=format`}
                src={image.url}
                // onClick={}
                // srcSet={`${
                //   item.data().images[0]
                // }?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt="test"
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </>
  );
};

export default AlbumPhotos;
