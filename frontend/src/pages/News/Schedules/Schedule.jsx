import {
  addDays,
  differenceInDays,
  format,
  isSunday,
  parse,
  parseISO,
} from "date-fns";

import { Box, Paper, Typography } from "@mui/material";
import ScheduleCard from "./ScheduleCard";

const Schedule = ({ events }) => {
  function getEventsByMonthAndDate(schedules) {
    const eventsByMonth = schedules.reduce((acc, event) => {
      const start = parseISO(event.start.dateTime || event.start.date);
      const month = format(start, "MMMM yyyy");
      const dateKey = format(start, "d");

      acc[month] = acc[month] || {}; // Initialize month as an object
      acc[month][dateKey] = acc[month][dateKey] || [];

      if (event.start.date) {
        event.allday = !!event.start.date;

        console.log(event);

        acc[month][dateKey].unshift(event);

        const end = parseISO(event.end.date);
        event.alldaylength = differenceInDays(end, start);

        for (let i = 1; i < event.alldaylength; i++) {
          const newStart = addDays(start, i);
          const newMonth = format(newStart, "MMMM yyyy");
          const newDateKey = format(newStart, "d");

          acc[newMonth] = acc[newMonth] || {};
          acc[newMonth][newDateKey] = acc[newMonth][newDateKey] || [];
          acc[newMonth][newDateKey].unshift(event);
        }
      } else {
        acc[month][dateKey].push(event);
      }

      return acc;
    }, {});

    return eventsByMonth;
  }

  return Object.entries(getEventsByMonthAndDate(events)).map(
    ([month, monthEvents]) => (
      <div key={month}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 900,
            mb: "12px",
          }}
        >
          {month}
        </Typography>

        {Object.entries(monthEvents).map(([date, dateEvents]) => {
          const eventDate = parse(
            `${month} ${date}`,
            "MMMM yyyy d",
            new Date(),
          );
          const sunday = isSunday(eventDate);

          return (
            <Paper
              key={date}
              elevation={3}
              sx={{
                mb: 2,
                display: "flex",
                overflow: "hidden",
                borderRadius: 4,
              }}
            >
              <Box
                sx={{
                  backgroundColor: sunday ? "#dc2626" : "primary.main",
                  p: 2.8,
                  mr: "18px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "80px",
                  borderRadius: "16px 0 0 16px",
                  borderBottom: `8px solid ${sunday ? "#991b1b" : "#e65100"}}`,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ color: "white", fontSize: "32px", fontWeight: 600 }}
                >
                  {date.toString().padStart(2, "0")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "white", textTransform: "uppercase" }}
                >
                  {format(eventDate, "eee")}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {dateEvents.map((event, index) => (
                  <ScheduleCard
                    key={index}
                    date={eventDate}
                    event={event}
                    sunday={sunday}
                  />
                ))}
              </Box>
            </Paper>
          );
        })}
        <br />
      </div>
    ),
  );
};

export default Schedule;
