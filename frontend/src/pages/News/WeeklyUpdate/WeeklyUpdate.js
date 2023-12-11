import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import {
  Alert,
  CircularProgress,
  Fab,
  IconButton,
  Snackbar,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import UploadIcon from "@mui/icons-material/Upload";

import { isMobile } from "react-device-detect";

import ButtonDatePicker from "../../../components/News/WeeklyUpdate/ButtonDatePicker";
import PDFReader from "../../../components/News/WeeklyUpdate/PDFReader";
import BulletinUploadModal from "../../../components/News/WeeklyUpdate/BulletinUploadModal";

import "./WeeklyUpdate.css";
import { useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import AdminComponent from "../../../common/AdminComponent";
import { add, compareAsc, format, sub } from "date-fns";

const WeeklyUpdate = () => {
  const navigate = useNavigate();
  let revalidator = useRevalidator();

  const { maxDate, queryDate } = useLoaderData();
  const minDate = new Date("2022/04/03");

  const [bulletin, setBulletin] = useState(null);
  const [selectedDate, setSelectedDate] = useState(queryDate);
  const [modalState, setModalState] = useState(false);
  const [isSuccessSnackBarOpen, setIsSuccessSnackBarOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsSuccessSnackBarOpen(false);
  };

  // Get Bulletin from Firestore
  const loadFile = useCallback(async () => {
    setLoading(true);
    try {
      const result = await axios.get("/api/WeeklyUpdate/GetBulletin", {
        params: {
          date: format(selectedDate, "yyyyMMdd"),
        },
      });

      const byteArray = new Uint8Array(Object.values(result.data));
      const pdf = new Blob([byteArray.buffer], { type: "application/pdf" });

      setBulletin(pdf);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, [selectedDate]);

  const closeModal = () => {
    setModalState(false);
  };

  const uploadBulletin = async (file, date) => {
    try {
      const form = new FormData();
      form.append("images", file);
      form.append("date", format(selectedDate, "yyyyMMdd"));
      const res = await axios.put("/api/WeeklyUpdate/PostBulletin/", form, {
        headers: {
          "Content-Type": `multipart/form-data`,
        },
      });

      console.log(res.data);
      // setMaxDate(new Date(res.data.replace(/-/g, "/")));
      setSelectedDate(date);
      revalidator.revalidate(); //get new maxdate
      closeModal();
      setIsSuccessSnackBarOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const previousBulletin = () => {
    setSelectedDate((prev) => sub(prev, { days: 7 }));
  };

  const nextBulletin = () => {
    setSelectedDate((prev) => add(prev, { days: 7 }));
  };

  useEffect(() => {
    if (selectedDate != null) {
      loadFile();
      navigate("/weeklyupdate/" + format(selectedDate, "yyyyMMdd"));
    }
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
      <h1>주보</h1>

      <IconButton
        id="previousBulletin"
        onClick={previousBulletin}
        disabled={compareAsc(selectedDate, minDate) === 0 || loading}
      >
        <ArrowBackIosIcon />
      </IconButton>

      <ButtonDatePicker
        value={selectedDate}
        minDate={minDate}
        maxDate={maxDate}
        onChange={setSelectedDate}
      />

      <IconButton
        id="nextBulletin"
        onClick={nextBulletin}
        disabled={compareAsc(selectedDate, maxDate) === 0 || loading}
      >
        <ArrowForwardIosIcon />
      </IconButton>
      {loading ? (
        <div>
          <CircularProgress sx={{ mt: 2 }} />
        </div>
      ) : (
        <PDFReader file={bulletin} documentDimension={documentDimension} />
      )}

      <AdminComponent>
        <Fab
          id="uploadBulletinButton"
          variant="extended"
          onClick={() => setModalState(true)}
        >
          <UploadIcon sx={{ mr: 1 }} />
          Upload
        </Fab>

        <BulletinUploadModal
          open={modalState}
          onModalUpload={uploadBulletin}
          setModalState={setModalState}
        />

        <Snackbar
          open={isSuccessSnackBarOpen}
          autoHideDuration={8000}
          onClose={handleClose}
        >
          <Alert severity="success" onClose={handleClose}>
            Uploaded Succesfully!
          </Alert>
        </Snackbar>
      </AdminComponent>
    </>
  );
};

export default WeeklyUpdate;
