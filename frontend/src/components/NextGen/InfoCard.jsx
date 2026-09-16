import {
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
import Styles from "./InfoCard.module.css";

const InfoCard = ({ age, time, place, ask, imgs }) => {

  return (
    <Card
      elevation={5}
      sx={{
        width: "100%",
        maxWidth: { xs: "none", md: "820px" },
        borderRadius: "1em",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          p: "0 !important",
        }}
      >
        <Stack
          sx={{
            gap: 0.5,
            justifyContent: "space-between",
            ml: 2,
            mr: 1,
            mb: { xs: 1.5, md: 0 },
            mt: { xs: 2, md: 0 }
          }}>
          <Typography
            sx={{
              fontSize: "1.8em",
              fontWeight: 800
            }}>
            모임
          </Typography>
          <Stack direction="row" spacing={2}>
            <GroupsIcon />
            <Typography sx={{
              fontSize: "1.2em"
            }}>{age}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <AccessTimeIcon />
            <Typography sx={{
              fontSize: "1.2em"
            }}>{time}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <PlaceIcon />
            <Typography sx={{
              fontSize: "1.2em"
            }}>{place}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <ContactSupportIcon />
            <Typography sx={{
              fontSize: "1.2em"
            }}>{ask}</Typography>
          </Stack>
        </Stack>

        {imgs && (
          <Box
            component={Paper}
            sx={{ width: "100%", maxWidth: { xs: "none", md: "64%" } }}
          >
            <Box sx={{ pb: "75%", position: "relative", overflow: "hidden" }}>
              <CustomCarousel
                className={Styles.boxContent}
                fillHeight
                showArrows={false}
                showDots={imgs.length > 1}
                dotColor="#808080"
                autoPlay={imgs.length > 1}
                autoPlayInterval={3500}
                loop={imgs.length > 1}
              >
                {imgs.map((img) => (
                  <div className={Styles["img-container"]} key={img.src}>
                    <img loading="lazy" src={img.src} alt="" />
                  </div>
                ))}
              </CustomCarousel>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
