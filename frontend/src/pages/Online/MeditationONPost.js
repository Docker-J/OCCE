import { useLoaderData } from "react-router-dom";

import { Carousel } from "react-responsive-carousel";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css";

const MeditationONPost = () => {
  const images = useLoaderData();

  console.log(images);

  return (
    <>
      <h1>묵상 ON</h1>
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
