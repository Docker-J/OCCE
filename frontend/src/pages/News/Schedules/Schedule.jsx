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
            gap: 2,
            mt: 5,
            mb: 3,
            px: 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "24px", sm: "30px" },
              letterSpacing: "-0.02em",
              color: "#2b2b2b",
            }}
          >
            {month}
          </Typography>
          <Box
            sx={{
              flex: 1,
              height: "2px",
              background: "linear-gradient(90deg, rgba(0, 0, 0, 0.1) 0%, transparent 100%)",
              borderRadius: "2px",
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
                mb: 2.5,
                display: "flex",
                overflow: "hidden",
                borderRadius: "24px",
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: sunday
                  ? "0 10px 40px rgba(193, 18, 31, 0.06), inset 0 0 0 1px rgba(255,255,255,0.5)"
                  : "0 10px 40px rgba(255, 107, 0, 0.06), inset 0 0 0 1px rgba(255,255,255,0.5)",
                border: sunday
                  ? "1px solid rgba(193, 18, 31, 0.15)"
                  : "1px solid rgba(255, 107, 0, 0.15)",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: sunday
                    ? "0 15px 50px rgba(193, 18, 31, 0.12), inset 0 0 0 1px rgba(255,255,255,0.8)"
                    : "0 15px 50px rgba(255, 107, 0, 0.12), inset 0 0 0 1px rgba(255,255,255,0.8)",
                  borderColor: sunday
                    ? "rgba(193, 18, 31, 0.3)"
                    : "rgba(255, 107, 0, 0.3)",
                },
              }}
            >
              <Box
                sx={{
                  background: sunday 
                    ? "linear-gradient(145deg, rgba(193, 18, 31, 0.15), rgba(193, 18, 31, 0.05))" 
                    : "linear-gradient(145deg, rgba(255, 107, 0, 0.15), rgba(255, 107, 0, 0.05))",
                  p: { xs: 1.5, sm: 2.5 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: { xs: "75px", sm: "90px" },
                  borderRight: `1px solid ${sunday ? "rgba(193, 18, 31, 0.15)" : "rgba(255, 107, 0, 0.15)"}`,
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
