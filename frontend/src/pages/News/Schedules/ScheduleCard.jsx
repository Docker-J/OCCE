import { Box, Stack, Typography } from "@mui/material";
import {
  addDays,
  differenceInDays,
  format,
  getDate,
  isSameDay,
  parseISO,
} from "date-fns";

import ScheduleIcon from "@mui/icons-material/Schedule";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

function isSameDayEvent(start, end, endTime) {
  return (
    isSameDay(start, end) ||
    (getDate(addDays(start, 1)) === getDate(end) && endTime === "00:00 AM")
  );
}

const ScheduleCard = ({ date, event, sunday, isLast }) => {
  const allday = event.allday;

  const start = parseISO(allday ? event.start.date : event.start.dateTime);
  const end = parseISO(allday ? event.end.date : event.end.dateTime);
  const startDate = format(start, "dd");
  const startTime = format(start, "hh:mm a");
  const endDate = format(end, "dd");
  const endTime = format(end, "hh:mm a");

  const sameDay = isSameDayEvent(start, end, endTime);

  return (
    <Box
      sx={{
        py: 1.5,
        borderBottom: isLast ? "none" : "1px solid rgba(0, 0, 0, 0.05)",
        ...(allday && {
          borderLeft: `4px solid ${sunday ? "#dc2626" : "#888888"}`,
          pl: 2,
          my: 1,
          bgcolor: sunday ? "rgba(220, 38, 38, 0.02)" : "rgba(0, 0, 0, 0.015)",
          borderRadius: "0 8px 8px 0"
        }),
      }}
    >
      <Typography
        sx={{
          fontSize: "1.15em",
          fontWeight: 750,
          color: "#2b2b2b"
        }}
      >
        {event.summary}
        {allday &&
          !sameDay &&
          ` (Day ${differenceInDays(date, start) + 1}/${event.alldaylength})`}
      </Typography>

      {event.description && <Typography sx={{ mb: 0.5, color: "#666", fontSize: "0.95em" }}>{event.description}</Typography>}
      {!allday && (
        <Stack
          direction="row"
          spacing={0.8}
          sx={{
            alignItems: "center",
            mt: 0.5
          }}
        >
          <ScheduleIcon sx={{ fontSize: 18, color: "#888" }} />
          <Typography variant="body2" sx={{ color: "#555", fontWeight: 500 }}>
            {startTime}
            {!allday &&
              (sameDay
                ? ` - ${endTime}`
                : ` - ${format(end, "MM/dd hh:mm a")} `)}
          </Typography>
        </Stack>
      )}
      {event?.location && (
        <Stack
          direction="row"
          spacing={0.8}
          sx={{
            alignItems: "center",
            marginTop: "6px",
          }}
        >
          <PlaceOutlinedIcon sx={{ color: "#FF6B00", fontSize: 18 }} />
          <Typography
            component="a"
            target="_blank"
            href={`https://www.google.com/maps/search/?api=1&query=${event.location}`}
            variant="body2"
            sx={{ 
              color: "#555", 
              textDecoration: "none", 
              fontWeight: 500,
              transition: "color 0.2s",
              "&:hover": { color: "#FF6B00" } 
            }}
          >
            {event.location.split(",")[0]}
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default ScheduleCard;
