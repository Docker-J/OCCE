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
        const end = parseISO(event.end.date);
        const alldaylength = differenceInDays(end, start);
        
        // Use a shallow copy to prevent mutating the original data
        const allDayEvent = {
          ...event,
          allday: true,
          alldaylength,
        };

        acc[month][dateKey].unshift(allDayEvent);

        for (let i = 1; i < alldaylength; i++) {
          const newStart = addDays(start, i);
          const newMonth = format(newStart, "MMMM yyyy");
          const newDateKey = format(newStart, "d");

          acc[newMonth] = acc[newMonth] || {};
          acc[newMonth][newDateKey] = acc[newMonth][newDateKey] || [];
          acc[newMonth][newDateKey].unshift(allDayEvent);
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
            fontWeight: 800,
            color: "#2b2b2b",
            mb: "16px",
            mt: "8px",
            pl: "4px"
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
              elevation={0}
              sx={{
                mb: 2,
                display: "flex",
                overflow: "hidden",
                borderRadius: "24px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 20px rgba(255, 107, 0, 0.05), 0 1px 8px rgba(0, 0, 0, 0.03)",
                border: "1px solid rgba(255, 107, 0, 0.1)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 30px rgba(255, 107, 0, 0.12)",
                  borderColor: "rgba(255, 107, 0, 0.3)",
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: sunday ? "rgba(220, 38, 38, 0.06)" : "rgba(255, 107, 0, 0.06)",
                  p: { xs: 1.5, sm: 2.5 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: { xs: "75px", sm: "90px" },
                  borderRight: `1px solid ${sunday ? "rgba(220, 38, 38, 0.15)" : "rgba(255, 107, 0, 0.1)"}`,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ 
                    color: sunday ? "#dc2626" : "#FF6B00", 
                    fontSize: { xs: "24px", sm: "32px" }, 
                    fontWeight: 700 
                  }}
                >
                  {date.toString().padStart(2, "0")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    color: sunday ? "rgba(220, 38, 38, 0.8)" : "rgba(255, 107, 0, 0.8)", 
                    textTransform: "uppercase", 
                    fontWeight: 600,
                    fontSize: { xs: "12px", sm: "14px" }
                  }}
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
                  py: 1.5,
                  px: { xs: 1.5, sm: 2.5 }
                }}
              >
                {dateEvents.map((event, index) => (
                  <ScheduleCard
                    key={index}
                    date={eventDate}
                    event={event}
                    sunday={sunday}
                    isLast={index === dateEvents.length - 1}
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
