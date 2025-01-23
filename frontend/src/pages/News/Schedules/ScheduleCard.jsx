import { Box, Typography } from "@mui/material";
import { addDays, format, getDate, isSameDay, parseISO } from "date-fns";

function isSameDayEvent(start, end, endTime) {
  return (
    isSameDay(start, end) ||
    (getDate(addDays(start, 1)) === getDate(end) && endTime === "00:00 AM")
  );
}

const ScheduleCard = ({ dateEvents, event, index }) => {
  const allday = event.allday;

  const start = parseISO(allday ? event.start.date : event.start.dateTime);
  const end = parseISO(allday ? event.end.date : event.end.dateTime);
  dateEvents;
  const startDate = format(start, "dd");
  const startTime = format(start, "HH:mm a");
  const endDate = format(end, "dd");
  const endTime = format(end, "HH:mm a");

  const sameDay = isSameDayEvent(start, end, endTime);

  function incrEventDay(event) {
    event.day += 1;
    return event.day;
  }

  return (
    <Box
      key={index}
      style={{
        marginBottom: index !== dateEvents.length - 1 && "12px",
      }}
      sx={{
        border: "1px solid ",
        borderColor: allday ? "#f57c00" : "#afafaf",
        p: 1,
        borderRadius: 1,
      }}
    >
      {allday ? (
        <Typography fontWeight={700} color="primary">
          {event.summary}
          {!sameDay && ` (Day ${incrEventDay(event)}/${event.alldaylength})`}
        </Typography>
      ) : (
        <Typography fontWeight={700}>{event.summary}</Typography>
      )}

      <Typography variant="h5">
        {!allday && !sameDay && `${startDate} - ${getDate(endDate)}`}
      </Typography>
      <Typography>{event.description}</Typography>
      <Typography>
        {allday ? "" : startTime}
        {!allday && (sameDay ? ` - ${endTime}` : ` - ${endDate} ${endTime} `)}
      </Typography>
      <Typography>{event?.location}</Typography>
    </Box>
  );
};

export default ScheduleCard;
