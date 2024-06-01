import {
  Box,
  Card,
  CardContent,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../../common/slick/slick-default-dots.css";
import Styles from "./InfoCard.module.css";

const InfoCard = ({ age, time, place, ask, imgs }) => {
  const settings = {
    customPaging: (i) => (
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
    ),
    className: Styles["slick-slide"],
    dotsClass: "slick-dots slick-default-dots",
    dots: true,
    infinite: true,
    lazyLoad: true,
    speed: 300,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
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
              maxWidth: { xs: "none", md: "520px" },
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
              <div className={Styles.boxContent}>
                <Slider {...settings}>
                  {imgs.map((img) => (
                    <div className={Styles["img-container"]} key={uuidv4}>
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
