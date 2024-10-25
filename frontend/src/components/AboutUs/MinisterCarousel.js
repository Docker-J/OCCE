import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import "./MinisterCarousel.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { NextArrow, PrevArrow } from "../../common/Arrows";

import { MinistersList } from "./MinistersList";
import MinisterCard from "./MinisterCard";

const MinisterCarousel = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    dotsClass: "slick-dots",
    className: "center",
    centerMode: true,
    infinite: false,
    centerPadding: "19.5%",
    slidesToShow: 1,
    slidesToScroll: 1,
    // speed: 500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <Slider ref={sliderRef} {...settings}>
        {MinistersList.map((minister, index) => (
          <div
            key={uuidv4()}
            className="cardContainer"
            onClick={() => sliderRef.current.slickGoTo(index)}
          >
            <MinisterCard
              title={minister.title}
              position={minister.position}
              image={minister.image}
              details={minister.details}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MinisterCarousel;
