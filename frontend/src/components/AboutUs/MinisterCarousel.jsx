import { useMediaQuery, useTheme } from "@mui/material";
import CustomCarousel from "../../common/CustomCarousel";
import { MinistersList } from "./MinistersList";
import MinisterCard from "./MinisterCard";
import "./MinisterCarousel.css";

const MinisterCarousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        maxWidth: "1000px",
        margin: "auto",
        position: "relative",
      }}
    >
      <CustomCarousel
        fillHeight
        showArrows={true}
        showDots={true}
        loop={false}
        clickableSlides={true}
        slideBasis={isMobile ? "85%" : "62%"}
        options={{ align: "center", containScroll: false }}
      >
        {MinistersList.map((minister) => (
          <div
            key={minister.title}
            className="cardContainer"
          >
            <MinisterCard
              title={minister.title}
              position={minister.position}
              image={minister.image}
              details={minister.details}
            />
          </div>
        ))}
      </CustomCarousel>
    </div>
  );
};

export default MinisterCarousel;
