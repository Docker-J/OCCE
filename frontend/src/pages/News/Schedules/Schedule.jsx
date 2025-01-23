import {
  addDays,
  differenceInDays,
  format,
  isSunday,
  parseISO,
} from "date-fns";

import { Box, Paper, Typography } from "@mui/material";
import ScheduleCard from "./ScheduleCard";

const Schedule = ({ events }) => {
  function getEventsByMonthAndDate(schedules) {
    const eventsByMonth = schedules.reduce((acc, event) => {
      const start = parseISO(event.start.dateTime || event.start.date);
      const month = format(start, "MMMM yyyy");
      const dateKey = format(start, "dd");

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
          const newDateKey = format(newStart, "dd");

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
        <Typography variant="h5" fontWeight={500} sx={{ mb: "12px" }}>
          {month}
        </Typography>

        {Object.entries(monthEvents).map(([date, dateEvents]) => {
          const eventDate = new Date(`${month} ${date}`);
          const sunday = isSunday(eventDate);

          return (
            <Paper
              key={date}
              elevation={4}
              sx={{ p: 2, mb: 2, display: "flex", justifyContent: "center" }}
            >
              <div
                style={{
                  borderLeft: sunday ? "3px solid red" : "3px solid #f57c00",
                  height: "32px",
                  marginRight: "6px",
                }}
              />
              <Box
                sx={{
                  mr: "18px",
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" color={sunday ? "red" : "primary"}>
                  {date}
                </Typography>
                <Typography
                  variant="caption"
                  color={sunday ? "red" : "primary"}
                >
                  {format(eventDate, "eee")}
                </Typography>
              </Box>

              <Box
                width="100%"
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                {dateEvents.map((event, index) => (
                  <ScheduleCard
                    key={index}
                    date={eventDate}
                    event={event}
                    sx={{
                      marginBottom: index !== dateEvents.length - 1 && "12px",
                    }}
                  />
                ))}
              </Box>
            </Paper>
          );
        })}
        <br />
      </div>
    )
  );
};

export default Schedule;
