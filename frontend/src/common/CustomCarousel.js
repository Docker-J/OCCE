import { Avatar } from "@mui/material";
import { Carousel } from "react-responsive-carousel";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import styles from "react-responsive-carousel/lib/styles/carousel.min.css";

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

const CustomCarousel = (props) => {
  return (
    <Carousel
      renderArrowPrev={(clickHandler, hasPrev) =>
        hasPrev && (
          <Avatar
            sx={{
              position: "absolute",
              top: "50%",
              left: 10,
              opacity: 0.5,
              zIndex: 2,
              backgroundColor: "grey",
              color: "black",
            }}
            onClick={clickHandler}
            disabled={!hasPrev}
          >
            <NavigateBeforeIcon
              sx={{
                width: 32,
                height: 32,
              }}
            />
          </Avatar>
        )
      }
      renderArrowNext={(clickHandler, hasNext) =>
        hasNext && (
          <Avatar
            sx={{
              position: "absolute",
              top: "50%",
              right: 10,
              opacity: 0.5,
              zIndex: 2,
              backgroundColor: "grey",
              color: "black",
            }}
            onClick={clickHandler}
            disabled={!hasNext}
          >
            <NavigateNextIcon
              sx={{
                width: 32,
                height: 32,
              }}
            />
          </Avatar>
        )
      }
      renderIndicator={(clickHandler, isSelected, index) => {
        return (
          <Indicator isSelected={isSelected} clickHandler={clickHandler} />
        );
      }}
      styles={styles}
      showThumbs={false}
      showStatus={false}
      {...props}
    >
      {props.children}
    </Carousel>
  );
};

export default CustomCarousel;
