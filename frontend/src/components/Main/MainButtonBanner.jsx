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
    link: "/aboutus#aboutus/offering",
  },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  height: 200,
  borderRadius: "16px",
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  [theme.breakpoints.down("md")]: {
    width: "48% !important",
    height: 170,
  },
  [theme.breakpoints.down("sm")]: {
    width: "100% !important",
    height: 120,
    borderRadius: "14px",
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 2,
    transform: "translateY(-4px)",
    boxShadow: "0 14px 32px rgba(0, 0, 0, 0.18)",
    "& .MuiImageSrc-root": {
      transform: "scale(1.08)",
    },
    "& .MuiImageBackdrop-root": {
      background:
        "linear-gradient(180deg, rgba(15, 23, 42, 0.15) 0%, rgba(255, 107, 0, 0.65) 100%)",
    },
    "& .MuiImageMarked-root": {
      width: 32,
      backgroundColor: "#ffffff",
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
  transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
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
  zIndex: 1,
}));

const ImageBackdrop = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  background:
    "linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.65) 100%)",
  transition: "background 0.35s ease, opacity 0.35s ease",
}));

const ImageMarked = styled("span")(({ theme }) => ({
  height: 3,
  width: 20,
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  borderRadius: 2,
  position: "absolute",
  bottom: -4,
  left: "50%",
  transform: "translateX(-50%)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
}));

export default function ButtonBases() {
  return (
    <Box
      sx={{
        maxWidth: "1536px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "100%",
        my: { xs: 1, sm: 1.5 },
        px: { xs: 1, sm: 2 },
        gap: { xs: 1.5, md: 2 },
      }}
    >
      {images.map((image) => (
        <ImageButton
          component={image.to ? Link : "a"}
          sx={{ width: { xs: "100%", sm: "48%", md: "31.5%" } }}
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
              sx={{
                color: "inherit",
                position: "relative",
                fontSize: { xs: "1.15rem", sm: "1.3rem", md: "1.4rem" },
                fontWeight: 800,
                letterSpacing: "-0.3px",
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.6)",
                px: 2,
                py: 1,
              }}
            >
              {image.title}
              <ImageMarked className="MuiImageMarked-root" />
            </Typography>
          </Image>
        </ImageButton>
      ))}
    </Box>
  );
}
