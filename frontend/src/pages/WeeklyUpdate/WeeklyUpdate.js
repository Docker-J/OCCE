import React, { useState, useEffect } from "react";
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

import ButtonDatePicker from "../../components/WeeklyUpdate/ButtonDatePicker";
import PDFReader from "../../components/WeeklyUpdate/PDFReader";
import BulletinUploadModal from "../../components/WeeklyUpdate/BulletinUploadModal";

import "./WeeklyUpdate.css";

const WeeklyUpdate = () => {
  const [bulletin, setBulletin] = useState(null);
  const [isSuccessSnackBarOpen, setIsSuccessSnackBarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalState, setModalState] = useState(false);
  const [maxDate, setMaxDate] = useState(null);
  const minDate = new Date("2022/04/03");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsSuccessSnackBarOpen(false);
  };

  const getMaxDate = async () => {
    try {
      const result = await axios.get("/api/WeeklyUpdate/RecentDate");
      console.log(result.data);

      const recentDate = new Date(result.data.replace(/-/g, "/"));
      setMaxDate(recentDate);

      const params = new URLSearchParams(window.location.search);
      const queryDate = params.get("date");

      if (queryDate === null) {
        setSelectedDate(recentDate);
      } else {
        const year = +queryDate.substring(0, 4);
        const month = +queryDate.substring(4, 6);
        const day = +queryDate.substring(6, 8);

        setSelectedDate(new Date(year, month - 1, day));
      }
    } catch (err) {}
  };

  // Get Bulletin from Firestore
  const loadFile = async () => {
    try {
      const result = await axios.get("/api/WeeklyUpdate/GetBulletin", {
        params: { date: selectedDate.toLocaleDateString("sv") },
      });
      setBulletin(result.data);
    } catch (err) {}
  };

  const closeModal = () => {
    setModalState(false);
  };

  const uploadBulletin = async (file, date) => {
    fileToBase64(file, (err, result) => {
      axios.put("/api/WeeklyUpdate/PostBulletin/", {
        file: result,
        date: date.toLocaleDateString("sv"),
      });

      setSelectedDate(date);

      closeModal();
      setIsSuccessSnackBarOpen(true);
    });
  };

  const fileToBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(null, reader.result);
    };
    reader.onerror = function (error) {
      cb(error, null);
    };
  };

  const previousBulletin = () => {
    setSelectedDate(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() - 7
      )
    );
  };

  const nextBulletin = () => {
    setSelectedDate(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() + 7
      )
    );
  };

  useEffect(() => {
    getMaxDate();
  }, []);

  useEffect(() => {
    if (selectedDate != null) {
      loadFile();
      const newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?date=" +
        selectedDate.toLocaleDateString("sv").replace(/-/g, "");

      window.history.replaceState({}, null, newUrl);
    }
  }, [selectedDate]);

  return (
    <div className="weeklyBulletinBoard">
      <h1>주보</h1>

      {selectedDate && bulletin ? (
        <>
          <IconButton
            id="previousBulletin"
            onClick={previousBulletin}
            disabled={selectedDate.getTime() === minDate.getTime()}
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
            disabled={selectedDate.getTime() === maxDate.getTime()}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          <PDFReader file={bulletin} />
        </>
      ) : (
        <CircularProgress />
      )}

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
        onClose={closeModal}
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
    </div>
  );
};

export default WeeklyUpdate;
