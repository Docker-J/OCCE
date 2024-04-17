import {
  Avatar,
  Box,
  Card,
  CardContent,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import CustomCarousel from "../../common/CustomCarousel";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import "./InfoCard.css";
import { memo } from "react";
import Slider from "react-slick";

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

const InfoCard = ({ age, time, place, ask, imgs }) => {
  const settings = {
    customPaging: (i) => (
      <a>
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            // cursor: isSelected ? null : "pointer",
            background: "#808080",
            display: "inline-block",
          }}
        />
      </a>
    ),
    dotsClass: "slick-dots slick-default-dots",
    dots: true,
    infinite: true,
    lazyLoad: true,
    speed: 300,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    // nextArrow: <NextArrow />,
    // prevArrow: <PrevArrow />,
  };

  return (
    <Card
      elevation={5}
      sx={{
        width: "100%",
        maxWidth: { xs: "none", md: "800px" },
        borderRadius: "1em",
        overflow: "visible",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack
          sx={{
            justifyContent: "space-between",
            mb: { xs: 1.5, md: 0 },
          }}
          gap={0.5}
        >
          <Typography fontSize="1.8em" fontWeight={800}>
            모임
          </Typography>
          <Stack direction="row" spacing={2}>
            <GroupsIcon />
            <Typography fontSize="1.2em">{age}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <AccessTimeIcon />
            <Typography fontSize="1.2em">{time}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <PlaceIcon />
            <Typography fontSize="1.2em">{place}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <ContactSupportIcon />
            <Typography fontSize="1.2em">{ask}</Typography>
          </Stack>
        </Stack>

        {imgs && (
          <Box
            component={Paper}
            elevation={10}
            sx={{
              width: "100%",
              maxWidth: { xs: "none", md: "550px" },
              borderRadius: "1em",
              mr: { xs: 0, md: "-36px" },
            }}
          >
            <Box
              sx={{
                pb: "75%",
                position: "relative",
                overflow: "hidden",
                borderRadius: "1em",
              }}
            >
              <div className="box-content">
                <Slider {...settings}>
                  {imgs.map((img) => (
                    <div className="img-container">
                      <img src={img.src} />
                    </div>
                  ))}
                </Slider>
              </div>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
