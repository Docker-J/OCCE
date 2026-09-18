import { Box, useMediaQuery, useTheme } from "@mui/material";
import CustomCarousel from "../../../common/CustomCarousel";

const DepartmentCarousel = ({
  images = [],
  dotColor = "#2b2b2b",
  paddingTop = "65%",
  aspectRatioContainerStyle,
  alt = "Department Activity",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSingleImage = images.length === 1;

  return (
    <Box className="animate-fade" sx={{ mb: 12, animationDelay: "0.2s" }}>
      <Box
        sx={{
          mx: isSingleImage ? "auto" : { xs: -2, md: 0 },
          maxWidth: isSingleImage ? "800px" : "100%",
          ...aspectRatioContainerStyle,
        }}
      >
        <CustomCarousel
          autoPlay={true}
          autoPlayInterval={3500}
          dotColor={dotColor}
          showArrows={false}
          slideBasis={
            isSingleImage
              ? "100%"
              : isMobile
              ? "100%"
              : "calc(50% - 12px)"
          }
          slideGap="24px"
          options={
            isSingleImage
              ? undefined
              : { align: "start", containScroll: "trimSnaps" }
          }
          loop={true}
        >
          {images.map((img, index) => (
            <Box
              key={img.src || index}
              sx={{
                position: "relative",
                paddingTop: isSingleImage ? "56.25%" : paddingTop,
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
              }}
            >
              <img
                loading="lazy"
                src={img.src}
                alt={alt}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = isSingleImage
                    ? "scale(1.03)"
                    : "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </Box>
          ))}
        </CustomCarousel>
      </Box>
    </Box>
  );
};

export default DepartmentCarousel;
