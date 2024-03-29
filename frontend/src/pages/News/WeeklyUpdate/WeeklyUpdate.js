import React, { useState, useEffect, useCallback } from "react";

import { CircularProgress, Fab, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import UploadIcon from "@mui/icons-material/Upload";

import { isMobile } from "react-device-detect";

import ButtonDatePicker from "../../../common/ButtonDatePicker";
import PDFReader from "../../../components/News/WeeklyUpdate/PDFReader";

import { useLoaderData, useNavigate } from "react-router-dom";
import AdminComponent from "../../../common/AdminComponent";
import {
  addDays,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSunday,
  startOfWeek,
  subDays,
} from "date-fns";

import "./WeeklyUpdate.css";
import "../../NextGen/NextGen.css";
import useModals from "../../../util/useModal";
import WeeklyUpdatePostModal from "../../../components/News/WeeklyUpdate/WeeklyUpdatePostModal";
import { getWeeklyUpdate } from "../../../api/weeklyupdate";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.30)), url("/img/News/WeeklyUpdate/WeeklyUpdate.webp")',
};

const WeeklyUpdate = () => {
  const { openModal } = useModals();
  const navigate = useNavigate();

  const { maxDate, queryDate } = useLoaderData();
  const minDate = new Date("2022/04/03");

  const [bulletin, setBulletin] = useState(null);
  const [selectedDate, setSelectedDate] = useState(queryDate);

  const [loading, setLoading] = useState(true);

  // Get Bulletin from Firestore
  const loadFile = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getWeeklyUpdate(selectedDate);

      setBulletin(result.data);
    } catch (err) {
      console.log(err);
      setBulletin(null);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  const previousSunday = () => {
    setSelectedDate((prev) =>
      isSunday(prev) ? subDays(prev, 7) : startOfWeek(prev, { weekStartsOn: 0 })
    );
  };

  const nextSunday = () => {
    setSelectedDate((prev) =>
      isSunday(prev) ? addDays(prev, 7) : endOfWeek(prev, { weekStartsOn: 1 })
    );
  };

  useEffect(() => {
    loadFile();
    navigate("/weeklyupdate/" + format(selectedDate, "yyyyMMdd"));
  }, [selectedDate, loadFile, navigate]);

  const width = isMobile
    ? document.documentElement.clientWidth
    : window.innerWidth;
  const height = isMobile
    ? document.documentElement.clientHeight
    : window.innerHeight;

  const [documentDimension, detectHW] = useState({
    width: height / width >= 16 / 10 ? width - 30 : null,
    height: height / width < 16 / 10 ? height : null,
  });

  const detectSize = () => {
    const width = isMobile
      ? document.documentElement.clientWidth
      : window.innerWidth;
    const height = isMobile
      ? document.documentElement.clientHeight
      : window.innerHeight;

    detectHW({
      width: height / width >= 16 / 10 ? width - 30 : null,
      height: height / width < 16 / 10 ? height : null,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [documentDimension]);

  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            주보
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div
          className="container"
          style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0 }}
        >
          <>
            <IconButton
              id="previousBulletin"
              onClick={previousSunday}
              disabled={
                isSameDay(selectedDate, minDate) ||
                isBefore(selectedDate, minDate) ||
                loading
              }
            >
              <ArrowBackIosIcon />
            </IconButton>

            <ButtonDatePicker
              value={selectedDate}
              minDate={minDate}
              maxDate={maxDate}
              onChange={setSelectedDate}
              disableDate={(date) => !isSunday(date)}
            />

            <IconButton
              id="nextBulletin"
              onClick={nextSunday}
              disabled={
                isSameDay(selectedDate, maxDate) ||
                isAfter(selectedDate, maxDate) ||
                loading
              }
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>

          {loading ? (
            <div style={{ height: "100vh" }}>
              <CircularProgress sx={{ mt: 2 }} />
            </div>
          ) : (
            <PDFReader file={bulletin} documentDimension={documentDimension} />
          )}
        </div>
      </div>

      <AdminComponent>
        <Fab
          id="uploadBulletinButton"
          onClick={() =>
            openModal(WeeklyUpdatePostModal, {
              setParentDate: setSelectedDate,
            })
          }
        >
          <UploadIcon />
        </Fab>
      </AdminComponent>
    </>
  );
};

export default WeeklyUpdate;
