import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import ButtonDatePicker from "./ButtonDatePicker";

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
  const [selectedDate, setSelectedDate] = useState();
  const [fileToUpload, setFileToUpload] = useState(null);

  const nextSunday = () => {
    const today = new Date();
    today.setDate(today.getDate() + ((-1 - today.getDay() + 7) % 7) + 1);
    setSelectedDate(today);
  };

  const inputRef = useRef(null);

  const handleChangeFile = ({ target }) => {
    setFileToUpload(target.files[0]);
  };

  useEffect(() => {
    nextSunday();
  }, []);

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
