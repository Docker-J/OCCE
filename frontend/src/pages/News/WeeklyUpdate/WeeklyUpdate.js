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

import ButtonDatePicker from "../../../components/News/WeeklyUpdate/ButtonDatePicker";
import PDFReader from "../../../components/News/WeeklyUpdate/PDFReader";
import BulletinUploadModal from "../../../components/News/WeeklyUpdate/BulletinUploadModal";

import "./WeeklyUpdate.css";
import { useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import AdminComponent from "../../../common/AdminComponent";

const WeeklyUpdate = () => {
  const navigate = useNavigate();
  let revalidator = useRevalidator();

  const { maxDate, queryDate } = useLoaderData();
  const minDate = new Date("2022/04/03");

  const [bulletin, setBulletin] = useState(null);
  const [selectedDate, setSelectedDate] = useState(queryDate);
  const [modalState, setModalState] = useState(false);
  const [isSuccessSnackBarOpen, setIsSuccessSnackBarOpen] = useState(false);

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

      const byteArray = new Uint8Array(Object.values(result.data));
      const pdf = new Blob([byteArray.buffer], { type: "application/pdf" });

      setBulletin(pdf);
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
      form.append("date", date.toLocaleDateString("sv"));
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

      {bulletin ? (
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

      {/* <AdminComponent> */}
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
      {/* </AdminComponent> */}
    </>
  );
};

export default WeeklyUpdate;
