import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Carousel from "react-spring-3d-carousel";
import Card from "./MinsterCard";

const slides = [
  {
    key: uuidv4(),
    content: (
      <Card
        imagen="img/About/ChinSeongIn.webp"
        imageOffset={{ left: "-53%" }}
        title="진성인 목사"
        position="담임 목사"
      />
    ),
  },
  {
    key: uuidv4(),
    content: (
      <Card
        imagen="img/About/KimTaeyoung.webp"
        imageOffset={{ left: "-53%" }}
        title="김태영 목사"
        position="행정"
      />
    ),
  },
  {
    key: uuidv4(),
    content: (
      <Card
        imagen="img/About/KimYoojeong.webp"
        imageOffset={{ left: "-52%" }}
        title="김유정 전도사"
        position="유아유치부"
      />
    ),
  },
  {
    key: uuidv4(),
    content: (
      <Card
        imagen="img/About/LeeSooyeon.webp"
        imageOffset={{ left: "-52%" }}
        title="이수연 전도사"
        position="유초등부"
      />
    ),
  },
  {
    key: uuidv4(),
    content: (
      <Card
        imagen="img/About/KimHwikyung.jpg"
        imageOffset={{ left: "-55%" }}
        title="김휘경 전도사"
        position="중고등부/청년부/찬양"
      />
    ),
  },
];

const MinisterCarousel = () => {
  const table = slides.map((element, index) => {
    return { ...element, onClick: () => setGoToSlide(index) };
  });

  const [goToSlide, setGoToSlide] = useState(null);
  const [cards] = useState(table);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        maxWidth: "max(450px, 40vw)",
        margin: "auto",
      }}
    >
      <Carousel
        slides={cards}
        goToSlide={goToSlide}
        offsetRadius={1}
        showNavigation={false}
      />
    </div>
  );
};

export default MinisterCarousel;
