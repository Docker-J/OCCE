import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import ButtonDatePicker from "./ButtonDatePicker";
import { useDropzone } from "react-dropzone";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PDFReader from "./PDFReader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  height: "80vh",
  maxWidth: "1300px",
  bgcolor: "#ffffff",
  boxShadow: 24,
  borderRadius: "0.5em",
  p: 1,
  py: 5,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const BulletinUploadModal = (props) => {
  const [selectedDate, setSelectedDate] = useState();
  const [fileToUpload, setFileToUpload] = useState(null);

  const handleClose = () => {
    setFileToUpload(null);
    props.setModalState(false);
  };

  const nextSunday = () => {
    const today = new Date();
    today.setDate(today.getDate() + ((-1 - today.getDay() + 7) % 7) + 1);
    setSelectedDate(today);
  };

  const handleChangeFile = (file) => {
    console.log(file);
    setFileToUpload(file[0]);
  };

  useEffect(() => {
    nextSunday();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [],
    },
    onDrop: (acceptedFiles) => {
      handleChangeFile(acceptedFiles);
    },
    multiple: false,
  });

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
        {/* <input
          type="file"
          id="bulletin"
          name="theFile"
          onChange={handleChangeFile}
          accept="application/pdf"
        /> */}
        <PDFReader file={fileToUpload} />

        <div
          style={{
            width: "95%",
            height: "20%",
            border: "1pt dotted #f57c00",
            borderRadius: "1em",
            overflowY: "auto",
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <Box
            sx={{
              position: "relative",
              height: "100%",
              widht: "100%",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <AddCircleOutlineIcon fontSize="large" color="primary" />
              <Typography>Click or Drag Files to here</Typography>
            </div>
          </Box>
        </div>

        <p>
          <Button
            variant="outlined"
            onClick={() => props.onModalUpload(fileToUpload, selectedDate)}
          >
            Upload
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
        </p>
      </Box>
    </Modal>
  );
};

export default BulletinUploadModal;
