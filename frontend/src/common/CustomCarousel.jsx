import { Avatar, Paper } from "@mui/material";
import { Carousel } from "react-responsive-carousel";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./CustomCarousel.css";
import { memo } from "react";

const Indicator = ({ isSelected, clickHandler }) => {
  return (
    <span
      onClick={isSelected ? null : clickHandler}
      style={{
        width: "8px",
        height: "8px",
        margin: "0 7px",
        borderRadius: "50%",
        cursor: isSelected ? null : "pointer",
        background: isSelected ? "#f57c00" : "#808080",
        display: "inline-block",
      }}
    />
  );
};

const PrevArrow = memo(({ clickHandler, hasPrev }) => {
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
      onClick={clickHandler}
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

const NextArrow = memo(({ clickHandler, hasNext }) => {
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
      onClick={clickHandler}
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

const CustomCarousel = (props) => {
  return (
    <Carousel
      renderArrowPrev={(clickHandler, hasPrev) =>
        hasPrev && <PrevArrow clickHandler={clickHandler} />
      }
      renderArrowNext={(clickHandler, hasNext) =>
        hasNext && <NextArrow clickHandler={clickHandler} />
      }
      renderIndicator={(clickHandler, isSelected, index) => {
        return (
          <Indicator isSelected={isSelected} clickHandler={clickHandler} />
        );
      }}
      // styles={styles.carousel}
      showThumbs={false}
      showStatus={false}
      {...props}
    >
      {props.children}
    </Carousel>
  );
};

export default CustomCarousel;
