import { Suspense, useState } from "react";
import { Await, useLoaderData, useRevalidator } from "react-router";
import Schedule from "./Schedule";
import AdminComponent from "../../../common/AdminComponent";

import { CircularProgress, Fab, Tooltip, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { refreshSchedules } from "../../../api/schedules";
import useSnackbar from "../../../util/useSnackbar";

const titleBackground = {
  backgroundImage: 'url("/img/News/Schedules/Schedules.webp")',
  backgroundPositionX: "0%",
  backgroundPositionY: "60%",
};

const Schedules = () => {
  const data = useLoaderData();
  const revalidator = useRevalidator();
  const { openSnackbar } = useSnackbar();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await refreshSchedules();
      revalidator.revalidate();
      openSnackbar("success", "교회 일정을 성공적으로 새로고침했습니다.");
    } catch {
      openSnackbar("error", "교회 일정을 새로고침하는 중 오류가 발생했습니다.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <title>교회일정 - OCCE</title>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 830,
              textAlign: "center",
              letterSpacing: "0.4em",
              pl: "0.4em",
              color: "white"
            }}>
            교회일정
          </Typography>
        </div>
      </div>
      <div 
        className="container-wrapper" 
        style={{ 
          backgroundColor: "#fcfbf9", 
          backgroundImage: "radial-gradient(at 0% 0%, hsla(28,100%,74%,0.08) 0px, transparent 50%), radial-gradient(at 100% 0%, hsla(349,100%,71%,0.05) 0px, transparent 50%)",
          minHeight: "60vh", 
          paddingTop: "20px", 
          paddingBottom: "40px" 
        }}
      >
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
        <Tooltip title="일정 새로고침">
          <span>
            <Fab
              color="primary"
              disabled={isRefreshing}
              sx={{
                position: "fixed",
                right: { xs: 20, md: 32 },
                bottom: { xs: 24, md: 36 },
                zIndex: 1000,
              }}
              onClick={handleRefresh}
            >
              {isRefreshing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <RefreshIcon />
              )}
            </Fab>
          </span>
        </Tooltip>
      </AdminComponent>
    </>
  );
};

export default Schedules;
