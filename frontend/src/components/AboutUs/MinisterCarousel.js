import { memo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Card from "./MinisterCard";

import "./MinisterCarousel.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Avatar, Paper } from "@mui/material";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const slides = [
  {
    key: uuidv4(),
    content: (
      <Card
        imagen="img/About/ChinSeongIn.webp"
        // imageOffset={{ left: "2%" }}
        title="진성인 목사"
        position="담임 목사"
        details={{
          "현)": { "에드먼턴 온 교회 담임": "" },
          "전)": {
            "에드몬톤 한인장로교회 담임": "(캐나다장로교 한카서부노회)",
            "나나이모 한인장로교회 담임": "(캐나다장로교 한카서부노회)",
            "칠레 영락교회 부목사": "(해외한인장로회 중남미노회)",
            "제주 중문교회 부목사": "(대한예수교장로회 통합 제주노회)",
            "괌 동서장로교회 부목사": "(대한예수교장로회 통합 단기 선교사)",
          },
          "학력)": {
            "장로회신학대학원 목회학석사 졸업": "(대한예수교장로회 통합)",
            "장로회신학대학교 기독교교육과 졸업": "(대한예수교장로회 통합)",
          },
        }}
      />
    ),
  },
  {
    key: uuidv4(),
    content: (
      <Card
        imagen="img/About/KimTaeyoung.webp"
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
        title="이수연 전도사"
        position="유초등부"
      />
    ),
  },
  {
    key: uuidv4(),
    content: (
      <Card
        imagen="img/About/KimHwikyung.webp"
        title="김휘경 전도사"
        position="중고등부/청년부/찬양"
      />
    ),
  },
];

const PrevArrow = memo(({ onClick }) => {
  return (
    <Avatar
      component={Paper}
      elevation={5}
      sx={{
        position: "absolute",
        top: "50%",
        left: 10,
        opacity: 0.7,
        zIndex: 2,
        backgroundColor: "white",
        color: "black",
      }}
      onClick={onClick}
    >
      <NavigateBeforeIcon
        sx={{
          width: 32,
          height: 32,
        }}
      />
    </Avatar>
  );
});

const NextArrow = memo(({ onClick }) => {
  return (
    <Avatar
      component={Paper}
      elevation={5}
      sx={{
        position: "absolute",
        top: "50%",
        right: 10,
        opacity: 0.7,
        zIndex: 2,
        backgroundColor: "white",
        color: "black",
      }}
      onClick={onClick}
    >
      <NavigateNextIcon
        sx={{
          width: 32,
          height: 32,
        }}
      />
    </Avatar>
  );
});

const MinisterCarousel = () => {
  const table = slides.map((element) => {
    return { ...element };
  });

  const [cards] = useState(table);

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
        {cards.map((card, index) => (
          <div
            className="cardContainer"
            onClick={() => sliderRef.current.slickGoTo(index)}
          >
            {card.content}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MinisterCarousel;
