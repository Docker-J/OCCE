import { Avatar } from "@mui/material";
import { Carousel } from "react-responsive-carousel";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import styles from "react-responsive-carousel/lib/styles/carousel.min.css";

const indicatorStyles = {
  background: "#808080",
  width: 8,
  height: 8,
  display: "inline-block",
  margin: "0 8px",
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
        if (isSelected) {
          return <li style={{ ...indicatorStyles, background: "#f57c00" }} />;
        }
        return (
          <li
            style={indicatorStyles}
            onClick={clickHandler}
            value={index}
            key={index}
            // role="button"
            tabIndex={0}
          />
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
