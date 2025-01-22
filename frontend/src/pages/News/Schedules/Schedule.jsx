import {
  addDays,
  differenceInDays,
  format,
  getDate,
  isSameDay,
  isSunday,
  parseISO,
} from "date-fns";

import { Box, Paper, Typography } from "@mui/material";

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

        event.day = 0;

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

  function isSameDayEvent(start, end, endTime) {
    return (
      isSameDay(start, end) ||
      (getDate(addDays(start, 1)) === getDate(end) && endTime === "00:00 AM")
    );
  }

  return Object.entries(getEventsByMonthAndDate(events)).map(
    ([month, monthEvents]) => (
      <div key={month}>
        <Typography variant="h5" fontWeight={500} sx={{ mb: "12px" }}>
          {month}
        </Typography>
        {Object.entries(monthEvents).map(([date, dateEvents]) => (
          <Paper
            key={date}
            elevation={4}
            sx={{ p: 2, mb: 2, display: "flex", justifyContent: "center" }}
          >
            <div
              style={{
                borderLeft: isSunday(new Date(month + " " + date))
                  ? "3px solid red"
                  : "3px solid #f57c00",
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
              <Typography
                variant="h5"
                color={
                  isSunday(new Date(month + " " + date)) ? "red" : "primary"
                }
              >
                {date}
              </Typography>
              <Typography
                variant="caption"
                color={
                  isSunday(new Date(month + " " + date)) ? "red" : "primary"
                }
              >
                {format(new Date(month + " " + date), "eee")}
              </Typography>
            </Box>
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              {dateEvents.map((event, index) => {
                const allday = event.allday;

                const start = parseISO(
                  allday ? event.start.date : event.start.dateTime
                );
                const end = parseISO(
                  allday ? event.end.date : event.end.dateTime
                );

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
                  >
                    {allday ? (
                      <Typography
                        fontWeight={700}
                        color="primary"
                        sx={{
                          border: "1px solid #f57c00",
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        {event.summary}
                        {!sameDay &&
                          ` (Day ${incrEventDay(event)}/${event.alldaylength})`}
                      </Typography>
                    ) : (
                      <Typography
                        fontWeight={700}
                        sx={{
                          border: "1px solid #afafaf",
                          p: 1.2,
                          borderRadius: 1,
                        }}
                      >
                        {event.summary}
                      </Typography>
                    )}

                    <Typography variant="h5">
                      {!allday &&
                        !sameDay &&
                        `${startDate} - ${getDate(endDate)}`}
                    </Typography>
                    <Typography>{event.description}</Typography>
                    <Typography>
                      {allday ? "" : startTime}
                      {!allday &&
                        (sameDay
                          ? ` - ${endTime}`
                          : ` - ${endDate} ${endTime} `)}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        ))}
        <br />
      </div>
    )
  );
};

export default Schedule;
