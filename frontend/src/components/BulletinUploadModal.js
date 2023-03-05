import React, { useRef, useState } from "react";
import Modal from "react-modal";

import { Button } from "@mui/material";

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

Modal.setAppElement("#root");

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
    <Modal
      isOpen={props.open}
      contentLabel="Selected Todo"
      style={modalStyle}
      onRequestClose={props.onModalClose}
    >
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
        <Button onClick={() => props.onModalUpload(fileToUpload, selectedDate)}>
          Upload
        </Button>
        <Button onClick={props.onModalClose}>Close</Button>
      </p>
    </Modal>
  );
};

export default BulletinUploadModal;
