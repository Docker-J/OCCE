import React, { useRef, useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import ButtonDatePicker from "./ButtonDatePicker";

const modalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    zIndex: 10,
  },
  content: {
    justifyContent: "center",
    background: "#ffffff",
    overflow: "auto",
    top: "30vh",
    left: "35vw",
    right: "35vw",
    bottom: "30vh",
    WebkitOverflowScrolling: "touch",
    borderRadius: "14px",
    outline: "none",
    zIndex: 10,
  },
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  maxWidth: "1500px",
  height: "50vh",
  bgcolor: "#ffffff",
  border: "0.1px solid #f57c00",
  boxShadow: 24,
  p: 2,
};

const BulletinUploadModal = (props) => {
  function nextSunday() {
    var today = new Date();
    today.setDate(today.getDate() + ((-1 - today.getDay() + 7) % 7) + 1);
    return today;
  }

  const [selectedDate, setSelectedDate] = useState(nextSunday());

  const inputRef = useRef(null);

  const [fileToUpload, setFileToUpload] = useState(null);

  const handleChangeFile = ({ target }) => {
    setFileToUpload(target.files[0]);
  };

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box sx={style} bgcolor="white">
        <h2>Choose Date</h2>

        <ButtonDatePicker
          value={selectedDate}
          minDate={new Date("2022/04/03")}
          onChange={setSelectedDate}
        />

        <h2>Choose File</h2>
        <input
          type="file"
          ref={inputRef}
          id="bulletin"
          name="theFile"
          onChange={handleChangeFile}
          accept="application/pdf"
        />

        <p>
          <Button
            onClick={() => props.onModalUpload(fileToUpload, selectedDate)}
          >
            Upload
          </Button>
          <Button onClick={props.onClose}>Close</Button>
        </p>
      </Box>
    </Modal>
  );
};

export default BulletinUploadModal;
