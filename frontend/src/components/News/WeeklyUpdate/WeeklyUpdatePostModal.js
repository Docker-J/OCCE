import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import ButtonDatePicker from "../../../common/ButtonDatePicker";
import { useDropzone } from "react-dropzone";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Document, Page } from "react-pdf";
import { add, endOfWeek, format, isSunday } from "date-fns";
import useSnackbar from "../../../util/useSnackbar";
import { uploadWeeklyUpdate } from "../../../api/weeklyupdate";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  height: "90vh",
  maxWidth: "1300px",
  bgcolor: "#ffffff",
  boxShadow: 24,
  borderRadius: "0.5em",
  p: 1,
  py: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const MIN_DATE = "2022/04/03";

const WeeklyUpdatePostModal = ({ isOpen, onClose, setParentDate }) => {
  const { openSnackbar } = useSnackbar();
  const user = useSelector((state) => state.authToken);

  const [selectedDate, setSelectedDate] = useState(
    add(endOfWeek(new Date()), { days: 1 })
  );
  const [fileToUpload, setFileToUpload] = useState(null);

  const test = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (test.current) {
      setHeight(test.current.clientHeight);
    }
  }, [fileToUpload]);

  const handleClose = () => {
    setFileToUpload(null);
    onClose();
  };

  const handleChangeFile = (file) => {
    setFileToUpload(file[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [],
    },
    onDrop: (acceptedFile) => {
      handleChangeFile(acceptedFile);
    },
    multiple: false,
  });

  const uploadBulletin = async () => {
    try {
      setLoading(true);

      const form = new FormData();
      const date = format(selectedDate, "yyyyMMdd");
      form.append("images", fileToUpload);
      form.append("date", date);

      await uploadWeeklyUpdate(user.accessToken, form);

      openSnackbar("success", "Uploaded Succesfully!");
      setParentDate(selectedDate);
      handleClose();
    } catch (error) {
      console.log(error);
      openSnackbar(
        "error",
        "Error Occured. Please contact to the administrator."
      );
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style} bgcolor="white">
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <h2>Choose Date</h2>

            <ButtonDatePicker
              value={selectedDate}
              minDate={new Date(MIN_DATE)}
              onChange={setSelectedDate}
              disableDate={(date) => !isSunday(date)}
            />

            <div ref={test} style={{ height: "60%" }}>
              <p>{fileToUpload ? fileToUpload.name : null}</p>
              <Document file={fileToUpload}>
                <Page
                  renderTextLayer={false}
                  className="page"
                  height={height - 80}
                  // width={100}
                  pageNumber={1}
                />
              </Document>
            </div>

            <div
              style={{
                width: "95%",
                height: "15%",
                border: "1pt dotted #f57c00",
                borderRadius: "1em",
                overflowY: "auto",
                marginBottom: "1em",
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
                  <Typography>Click or Drag File to here</Typography>
                </div>
              </Box>
            </div>

            <div>
              <Button
                variant="outlined"
                onClick={uploadBulletin}
                disabled={!fileToUpload}
              >
                Upload
              </Button>
              <Button variant="outlined" onClick={handleClose}>
                Close
              </Button>
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default WeeklyUpdatePostModal;
