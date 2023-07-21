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

import ButtonDatePicker from "../../components/WeeklyUpdate/ButtonDatePicker";
import PDFReader from "../../components/WeeklyUpdate/PDFReader";
import BulletinUploadModal from "../../components/WeeklyUpdate/BulletinUploadModal";

import "./WeeklyUpdate.css";
import { useSelector } from "react-redux";
import { useLoaderData, useNavigate, useRevalidator } from "react-router-dom";

const WeeklyUpdate = () => {
  const user = useSelector((state) => state.authToken.admin);
  const { maxDate, queryDate } = useLoaderData();
  const minDate = new Date("2022/04/03");

  const navigate = useNavigate();
  let revalidator = useRevalidator();

  const [bulletin, setBulletin] = useState(null);
  const [isSuccessSnackBarOpen, setIsSuccessSnackBarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(queryDate);
  const [modalState, setModalState] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsSuccessSnackBarOpen(false);
  };

  // Get Bulletin from Firestore
  const loadFile = useCallback(async () => {
    try {
      const result = await axios.get("/api/WeeklyUpdate/GetBulletin", {
        params: { date: selectedDate.toLocaleDateString("sv") },
      });
      setBulletin(result.data);
    } catch (err) {}
  }, [selectedDate]);

  const closeModal = () => {
    setModalState(false);
  };

  const uploadBulletin = async (file, date) => {
    fileToBase64(file, (err, result) => {
      axios
        .put("/api/WeeklyUpdate/PostBulletin/", {
          file: result,
          date: date.toLocaleDateString("sv"),
        })
        .then((res) => {
          console.log(res.data);
          // setMaxDate(new Date(res.data.replace(/-/g, "/")));
          revalidator.revalidate(); //get new maxdate
          setSelectedDate(date);
          closeModal();
          setIsSuccessSnackBarOpen(true);
        });
    });
  };

  const fileToBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      cb(null, reader.result);
    };
    reader.onerror = function(error) {
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
    if (selectedDate != null) {
      loadFile();
      navigate(
        "/weeklyupdate/" +
          selectedDate.toLocaleDateString("sv").replace(/-/g, "")
      );
    }
  }, [selectedDate, loadFile, navigate]);

  function compareDate(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  return (
    <>
      <h1>주보</h1>

      {selectedDate && bulletin ? (
        <>
          <IconButton
            id="previousBulletin"
            onClick={previousBulletin}
            disabled={compareDate(selectedDate, minDate)}
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
            disabled={compareDate(selectedDate, maxDate)}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          <PDFReader file={bulletin} />
        </>
      ) : (
        <CircularProgress />
      )}

      {user && (
        <>
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
        </>
      )}
    </>
  );
};

export default WeeklyUpdate;
