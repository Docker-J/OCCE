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

import "./InfoCard.css";

const InfoCard = ({ age, time, place, ask, imgs }) => {
  return (
    <Card
      elevation={5}
      sx={{
        width: "100%",
        maxWidth: { xs: "none", md: "750px" },
        // ml: { xs: "none", md: "-15%" },

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
              maxWidth: { xs: "none", md: "600px" },
              borderRadius: "1em",
              mr: { xs: 0, md: "-25%" },
              //   mb: { xs: "-35%", md: "0%" },
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
                <CustomCarousel
                  autoPlay
                  infiniteLoop
                  showArrows={false}
                  showIndicators={true}
                  swipeable={false}
                >
                  {imgs.map((img) => (
                    <img src={img.src} />
                  ))}
                </CustomCarousel>
              </div>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
