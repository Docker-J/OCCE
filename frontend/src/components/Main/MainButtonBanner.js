import { Link } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";

const images = [
  {
    url: "img/Main/location.webp",
    title: "주일예배 장소",
    width: "31%",
    link: "https://goo.gl/maps/gqpiA88gJSvbjfDD9",
    target: "_blank",
  },
  {
    url: "img/Main/time.webp",
    title: "예배 시간",
    width: "31%",
    to: "/aboutus#aboutus",
  },
  {
    url: "img/Main/news.webp",
    title: "최신 주보 보기",
    width: "31%",
    to: "/weeklyupdate",
  },
  {
    url: "img/Main/youtube.webp",
    title: "교회 유튜브 바로가기",
    width: "31%",
    link: "https://www.youtube.com/c/oncce",
    target: "_blank",
  },
  {
    url: "img/Main/join.webp",
    title: "교인 등록하기",
    width: "31%",
    link:
      "https://docs.google.com/forms/d/e/1FAIpQLSfYN9EECPuQ0e4TrPfok4UhMH3zKnvjUckKwGfe3SkQM-0O-A/viewform",
    target: "_blank",
  },
  {
    url: "img/Main/offering.webp",
    title: "헌금 안내",
    width: "31%",
    link: "aboutus#aboutus/offering",
  },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  height: 200,
  [theme.breakpoints.down("sm")]: {
    width: "100% !important", // Overrides inline-style
    height: 120,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.15,
    },
    "& .MuiImageMarked-root": {
      opacity: 0,
    },
    "& .MuiTypography-root": {
      border: "4px solid currentColor",
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
  opacity: 0.3,
  transition: theme.transitions.create("opacity"),
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
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: "1536px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "100%",
        minWidth: "550",
        mt: "1vmin",
        mb: "1vmin",
      }}
    >
      {images.map((image) => (
        <ImageButton
          component={image.to && Link}
          sx={{ margin: 1 }}
          key={image.title}
          style={{
            width: image.width,
            minWidth: 250,
          }}
          href={image.link}
          target={image.target}
          to={image.to}
        >
          <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
          <ImageBackdrop className="MuiImageBackdrop-root" />
          <Image>
            <Typography
              component="span"
              variant="h5"
              color="inherit"
              sx={{
                position: "relative",
                p: 4,
                pt: 2,
                pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
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
