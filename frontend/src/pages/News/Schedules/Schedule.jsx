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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mt: 3,
            mb: 2.5,
            px: 0.5,
          }}
        >
          <Box
            sx={{
              width: "4px",
              height: "22px",
              borderRadius: "4px",
              bgcolor: "#FF6B00",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 850,
              color: "#1e1e1e",
              fontSize: { xs: "20px", sm: "24px" },
              letterSpacing: "-0.02em",
            }}
          >
            {month}
          </Typography>
          <Box
            sx={{
              flex: 1,
              height: "1px",
              bgcolor: "rgba(0, 0, 0, 0.08)",
              ml: 1,
            }}
          />
        </Box>

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
                boxShadow: sunday
                  ? "0 4px 20px rgba(193, 18, 31, 0.12), 0 1px 10px rgba(0, 0, 0, 0.06)"
                  : "0 4px 20px rgba(255, 107, 0, 0.12), 0 1px 10px rgba(0, 0, 0, 0.06)",
                border: sunday
                  ? "1px solid rgba(193, 18, 31, 0.3)"
                  : "1px solid rgba(255, 107, 0, 0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: sunday
                    ? "0 12px 30px rgba(193, 18, 31, 0.2)"
                    : "0 12px 30px rgba(255, 107, 0, 0.2)",
                  borderColor: sunday
                    ? "rgba(193, 18, 31, 0.5)"
                    : "rgba(255, 107, 0, 0.5)",
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: sunday ? "rgba(193, 18, 31, 0.12)" : "rgba(255, 107, 0, 0.12)",
                  p: { xs: 1.5, sm: 2.5 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: { xs: "75px", sm: "90px" },
                  borderRight: `1px solid ${sunday ? "rgba(193, 18, 31, 0.25)" : "rgba(255, 107, 0, 0.25)"}`,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ 
                    color: sunday ? "#c1121f" : "#FF6B00", 
                    fontSize: { xs: "24px", sm: "32px" }, 
                    fontWeight: 700 
                  }}
                >
                  {date.toString().padStart(2, "0")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    color: sunday ? "rgba(193, 18, 31, 0.8)" : "rgba(255, 107, 0, 0.8)", 
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
                  px: { xs: 1.5, sm: 2.5 },
                  minWidth: 0,
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
