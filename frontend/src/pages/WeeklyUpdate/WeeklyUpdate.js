import React, { useState, useEffect } from "react";
import "./WeeklyUpdate.css";

import axios from "axios";

import ButtonDatePicker from "../../components/WeeklyUpdate/ButtonDatePicker";

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

import PDFReader from "../../components/WeeklyUpdate/PDFReader";
import BulletinUploadModal from "../../components/WeeklyUpdate/BulletinUploadModal";

import { setDoc, doc } from "firebase/firestore";
import { db } from "../../api/firebase";

const WeeklyUpdate = () => {
  function printLog(value) {
    console.log(value);
  }

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

  function closeModal() {
    setModalState(false);
  }

  const uploadBulletin = (file, date) => {
    fileToBase64(file, (err, result) => {
      setDoc(doc(db, "weeklyBulletin", date.toLocaleDateString("sv")), {
        file: result,
      });

      setSelectedDate(date);

      if (date > maxDate) {
        setMaxDate(date);
        setDoc(doc(db, "Misc", "RecentWeeklyBulletin"), {
          date: date.toLocaleDateString("sv"),
        });
      }

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
    // if (useParams.postId != null) {
    //   selectedDate.toLocaleDateString("sv").replace(/-/g, "");
    // }
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
  });

  return (
    <div className="weeklyBulletinBoard">
      <h1>주보</h1>

      {selectedDate && bulletin ? (
        <div>
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
        </div>
      ) : (
        <CircularProgress />
      )}

      {/* <div>
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

      <div>
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
          onModalClose={() => closeModal()}
        />
      </div> */}
    </div>
  );
};

export default WeeklyUpdate;