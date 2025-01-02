import { Box, CircularProgress, Typography } from "@mui/material";
import { getDate, isSameDay, startOfMonth } from "date-fns";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";

const titleBackground = {
  backgroundImage: 'url("/img/NewComers/NewComers.webp")',
};

// &timeMin=${new Date().toISOString()}
// &timeMax=${addMonth(new Date(), 1),toISOString()}

const Schedule = () => {
  const data = useLoaderData();

  function getEventsByMonth(schedules) {
    const test = schedules.reduce((acc, event) => {
      const start = new Date(event.start.dateTime);
      const monthStart = startOfMonth(start);
      const month = monthStart.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      acc[month] = acc[month] || [];
      acc[month].push(event);
      return acc;
    }, {});
    return test;
  }

  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            textAlign="center"
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            교회일정
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <Suspense
            fallback={
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </div>
            }
          >
            <Await
              resolve={data.schedules}
              errorElement={<p>Error loading!</p>}
            >
              {({ data }) => (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {Object.entries(getEventsByMonth(data.items)).map(
                    ([month, monthEvents]) => (
                      <div key={month} style={{ width: "70%" }}>
                        <h2>{month}</h2>
                        {monthEvents.map((event, index) => {
                          const start = new Date(event.start.dateTime);
                          const end = new Date(event.end.dateTime);

                          const options = {
                            timezone: event.start.timeZone,
                          };

                          const startDate = start.toLocaleDateString(
                            "en-US",
                            options
                          );
                          const startDateOnly = getDate(start);
                          const startTime = start.toLocaleTimeString(
                            "en-US",
                            options
                          );
                          const endDate = start.toLocaleDateString(
                            "en-US",
                            options
                          );
                          const endDateOnly = getDate(end);

                          const endTime = end.toLocaleTimeString(
                            "en-US",
                            options
                          );

                          const sameDay = isSameDay(start, end);

                          return (
                            <Box key={index} width="100%" display="flex">
                              <div>
                                <Typography variant="h5">
                                  {startDateOnly}
                                  {!sameDay && ` - ${endDateOnly}`}
                                </Typography>
                              </div>
                              <div>
                                <Typography>{event.summary}</Typography>
                                <Typography>{event.description}</Typography>

                                <Typography>
                                  {startTime}
                                  {sameDay
                                    ? ` - ${end.toLocaleTimeString(
                                        "en-US",
                                        options
                                      )}`
                                    : ` - ${endTime}`}
                                </Typography>
                              </div>
                              <br />
                            </Box>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default Schedule;
