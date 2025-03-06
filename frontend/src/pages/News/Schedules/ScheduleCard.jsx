import { Box, Stack, Typography } from "@mui/material";
import {
  addDays,
  differenceInDays,
  format,
  getDate,
  isSameDay,
  parseISO,
} from "date-fns";

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
  const startTime = format(start, "HH:mm a");
  const endDate = format(end, "dd");
  const endTime = format(end, "HH:mm a");

  const sameDay = isSameDayEvent(start, end, endTime);

  return (
    <>
      <Box
        sx={{
          border: "1px solid ",
          borderColor: allday ? "#f57c00" : "#afafaf",
          p: 1,
          borderRadius: 1,
          ...sx,
        }}
      >
        {allday ? (
          <Typography fontWeight={700} color="primary">
            {event.summary}
            {!sameDay &&
              ` (Day ${differenceInDays(date, start) + 1}/${
                event.alldaylength
              })`}
          </Typography>
        ) : (
          <Typography fontWeight={700}>{event.summary}</Typography>
        )}

        {!allday && !sameDay && (
          <Typography variant="h5">
            {`${startDate} - ${getDate(endDate)}`}
          </Typography>
        )}

        <Typography>{event.description}</Typography>

        {!allday && (
          <Typography>
            {startTime}
            {!allday &&
              (sameDay ? ` - ${endTime}` : ` - ${endDate} ${endTime} `)}
          </Typography>
        )}

        {event?.location && (
          <Stack direction="row" spacing={0.5}>
            <PlaceOutlinedIcon />
            <Typography
              component="a"
              target="_blank"
              href={`https://www.google.com/maps/search/?api=1&query=${event.location}`}
              variant="body2"
            >
              {event.location.split(",")[0]}
            </Typography>
          </Stack>
        )}
      </Box>
    </>
  );
};

export default ScheduleCard;
