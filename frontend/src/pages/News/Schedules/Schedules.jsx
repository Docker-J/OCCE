import { Suspense } from "react";
import { Await, useLoaderData, useRevalidator } from "react-router";
import Schedule from "./Schedule";
import AdminComponent from "../../../common/AdminComponent";

import { CircularProgress, Fab, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { refreshSchedules } from "../../../api/schedules";

const titleBackground = {
  backgroundImage: 'url("/img/News/Schedules/Schedules.jpg")',
  backgroundPositionX: "0%",
  backgroundPositionY: "60%",
};

const Schedules = () => {
  const data = useLoaderData();
  const revalidator = useRevalidator();

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
          <Suspense fallback={<CircularProgress />}>
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
                  {data.length === 0 ? (
                    "등록된 일정이 없습니다."
                  ) : (
                    <Schedule events={data} />
                  )}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>

      <AdminComponent>
        <Fab
          style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
          onClick={async () => {
            await refreshSchedules();
            revalidator.revalidate();
          }}
        >
          <RefreshIcon />
        </Fab>
      </AdminComponent>
    </>
  );
};

export default Schedules;
