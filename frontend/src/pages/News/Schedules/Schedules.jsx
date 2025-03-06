import { CircularProgress, Typography } from "@mui/material";

import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import Schedule from "./Schedule";

const titleBackground = {
  backgroundImage: 'url("/img/News/Schedules/Schedules.jpg")',
  backgroundPositionX: "0%",
  backgroundPositionY: "60%",
};

// &timeMin=${new Date().toISOString()}
// &timeMax=${addMonth(new Date(), 1),toISOString()}

const Schedules = () => {
  const data = useLoaderData();

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
        <div
          className="container"
          style={{ display: "flex", justifyContent: "center" }}
        >
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
                    maxWidth: "800px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  {data.items.length === 0 ? (
                    "등록된 일정이 없습니다."
                  ) : (
                    <Schedule events={data.items} />
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

export default Schedules;
