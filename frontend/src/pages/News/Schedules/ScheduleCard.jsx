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

const ScheduleCard = ({ date, event, sx }) => {
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
        // border: "1px solid ",
        backgroundColor: allday ? "#f57c00" : "#e8eaed",
        borderColor: allday ? "#f57c00" : "#afafaf",
        p: 1.5,
        borderRadius: 1,
        ...sx,
      }}
    >
      {allday ? (
        <Typography fontWeight={700} color="primary">
          {event.summary}
          {!sameDay &&
            ` (Day ${differenceInDays(date, start) + 1}/${event.alldaylength})`}
        </Typography>
      ) : (
        <Typography fontSize="1.1em" fontWeight={700}>
          {event.summary}
        </Typography>
      )}

      <Typography sx={{ mb: "0.2em" }}>{event.description}</Typography>

      {!allday && (
        <Stack direction="row" spacing={0.5} alignItems="flex-start">
          <ScheduleIcon fontSize="small" />
          <Typography variant="body2">
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
          spacing={0.5}
          alignItems="flex-start"
          marginTop="0.1em"
        >
          <PlaceOutlinedIcon color="orange" fontSize="small" />
          <Typography
            component="a"
            target="_blank"
            href={`https://www.google.com/maps/search/?api=1&query=${event.location}`}
            variant="body2"
            color="black"
            sx={{ textDecoration: "none" }}
          >
            {event.location.split(",")[0]}
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default ScheduleCard;
