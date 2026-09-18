import { lazy, Suspense } from "react";
import { Typography } from "@mui/material";
import { useLoaderData } from "react-router";
import { format } from "date-fns";

import {
  WeeklyUpdateDateToolbar,
  WeeklyUpdateAdminFabs,
  BulletinSkeleton,
  useWeeklyUpdate,
  useBulletinDimensions,
} from "../../../components/News/WeeklyUpdate";
import "./WeeklyUpdate.css";

const PDFReader = lazy(
  () => import("../../../components/News/WeeklyUpdate/PDFReader"),
);

const titleBackground = {
  backgroundImage: 'url("/img/News/WeeklyUpdate/WeeklyUpdate.webp")',
};

const WeeklyUpdate = () => {
  const { maxDate, queryDate } = useLoaderData();
  const {
    selectedDate,
    setSelectedDate,
    bulletin,
    loading,
    previousSunday,
    nextSunday,
    canGoPrevious,
    canGoNext,
    deleteFile,
    minDate,
  } = useWeeklyUpdate(queryDate, maxDate);

  const documentDimension = useBulletinDimensions();

  return (
    <>
      <title>{`${format(selectedDate, "yyyy-MM-dd")} 주보 - OCCE`}</title>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 830,
              letterSpacing: "0.4em",
              pl: "0.4em",
              color: "white",
            }}
          >
            주보
          </Typography>
        </div>
      </div>

      <div className="container-wrapper" style={{ backgroundColor: "#ffffff" }}>
        <div
          className="container"
          style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0 }}
        >
          <WeeklyUpdateDateToolbar
            selectedDate={selectedDate}
            onChangeDate={setSelectedDate}
            previousSunday={previousSunday}
            nextSunday={nextSunday}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            minDate={minDate}
            maxDate={maxDate}
          />

          <Suspense
            fallback={
              <BulletinSkeleton documentDimension={documentDimension} />
            }
          >
            <PDFReader
              file={bulletin}
              loading={loading}
              documentDimension={documentDimension}
            />
          </Suspense>
        </div>
      </div>

      <WeeklyUpdateAdminFabs
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onDeleteConfirm={deleteFile}
      />
    </>
  );
};

export default WeeklyUpdate;
