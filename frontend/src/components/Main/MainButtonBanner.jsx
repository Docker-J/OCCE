import { Link } from "react-router";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";

const images = [
  {
    url: "img/Main/location.webp",
    title: "주일예배 장소",
    link: "https://goo.gl/maps/gqpiA88gJSvbjfDD9",
    target: "_blank",
  },
  {
    url: "img/Main/time.webp",
    title: "예배 시간",
    to: "/aboutus#aboutus",
  },
  {
    url: "img/Main/news.webp",
    title: "최신 주보 보기",
    to: "/weeklyupdate",
  },
  {
    url: "img/Main/youtube.webp",
    title: "교회 유튜브 바로가기",
    link: "https://www.youtube.com/c/oncce",
    target: "_blank",
  },
  {
    url: "img/Main/join.webp",
    title: "교인 등록하기",
    link:
      "https://docs.google.com/forms/d/e/1FAIpQLSfYN9EECPuQ0e4TrPfok4UhMH3zKnvjUckKwGfe3SkQM-0O-A/viewform",
    target: "_blank",
  },
  {
    url: "img/Main/offering.webp",
    title: "헌금 안내",
    to: "/aboutus#aboutus/offering",
  },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  height: 200,
  borderRadius: 18,
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 4px 18px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  [theme.breakpoints.down("md")]: {
    width: "calc(50% - 12px) !important",
    height: 160,
    borderRadius: 16,
  },
  [theme.breakpoints.down("sm")]: {
    width: "100% !important",
    height: 120,
    borderRadius: 14,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 2,
    transform: "translateY(-4px)",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.16), 0 4px 14px rgba(255, 107, 0, 0.18)",
    "& .MuiImageBackdrop-root": {
      opacity: 0.18,
    },
    "& .MuiImageSrc-root": {
      transform: "scale(1.05)",
    },
    "& .MuiImageMarked-root": {
      opacity: 0,
    },
    "& .MuiTypography-root": {
      border: "2px solid rgba(255, 255, 255, 0.9)",
      borderRadius: "10px",
      backgroundColor: "rgba(0, 0, 0, 0.22)",
      backdropFilter: "blur(4px)",
    },
  },
}));

const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
  transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
});

const Image = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.32,
  transition: theme.transitions.create("opacity", { duration: 300 }),
}));

const ImageMarked = styled("span")(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: "absolute",
  bottom: -3,
  left: "calc(50% - 9px)",
  transition: theme.transitions.create("opacity"),
}));

const ImageMarkedUpper = styled("span")(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: "absolute",
  top: -3,
  left: "calc(50% - 9px)",
  transition: theme.transitions.create("opacity"),
}));

export default function ButtonBases() {
  return (
    <Box
      sx={{
        maxWidth: "1400px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2.5, sm: 3, md: 4 },
        gap: { xs: 1.5, sm: 2, md: 2.5 },
      }}
    >
      {images.map((image) => (
        <ImageButton
          component={image.to ? Link : "a"}
          sx={{ width: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(33.333% - 18px)" } }}
          key={image.title}
          href={image.link}
          target={image.target}
          to={image.to}
        >
          <ImageSrc
            className="MuiImageSrc-root"
            style={{ backgroundImage: `url(${image.url})` }}
          />
          <ImageBackdrop className="MuiImageBackdrop-root" />
          <Image>
            <Typography
              component="span"
              variant="h5"
              sx={{
                color: "inherit",
                position: "relative",
                p: { xs: 2, sm: 3, md: 4 },
                pt: { xs: 1.5, md: 2 },
                pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.35rem" },
                fontWeight: 700,
                letterSpacing: "0.5px",
                transition: "all 0.25s ease-in-out",
              }}
            >
              <ImageMarkedUpper className="MuiImageMarked-root" />
              {image.title}
              <ImageMarked className="MuiImageMarked-root" />
            </Typography>
          </Image>
        </ImageButton>
      ))}
    </Box>
  );
}
