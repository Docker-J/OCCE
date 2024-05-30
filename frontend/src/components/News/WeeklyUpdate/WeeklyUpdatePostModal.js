import React, { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import ButtonDatePicker from "../../../common/ButtonDatePicker";
import { Document, Page } from "react-pdf";
import { add, endOfWeek, format, isSunday } from "date-fns";
import useSnackbar from "../../../util/useSnackbar";
import { uploadWeeklyUpdate } from "../../../api/weeklyupdate";
import { MIN_DATE } from "../../../constants/WeeklyUpdate";
import FileUploadComponent from "./FileUploadComponent";
import CustomModal from "../../../common/CustomModal";
import { isMobile } from "react-device-detect";

const WeeklyUpdatePostModal = ({ isOpen, onClose, setParentDate }) => {
  const { openSnackbar } = useSnackbar();

  const [selectedDate, setSelectedDate] = useState(
    add(endOfWeek(new Date()), { days: 1 })
  );
  const [weeklyUpdate, setWeeklyUpdate] = useState(null);
  const [memberWeeklyUpdate, setMemberWeeklyUpdate] = useState(null);

  const handleClose = () => {
    setWeeklyUpdate(null);
    setMemberWeeklyUpdate(null);
    onClose();
  };

  const handleFileChange = (file) => {
    setWeeklyUpdate(file[0]);
  };

  const handleMemberFileChange = (file) => {
    setMemberWeeklyUpdate(file[0]);
  };

  const [width, setWidth] = useState(null);

  useEffect(() => {
    const updateDimensions = () => {
      const width = isMobile
        ? document.documentElement.clientWidth
        : window.innerWidth;

      setWidth(Math.min(width * 0.8, 1300) / 2 - 24);
    };

    updateDimensions(); // Initial calculation
    window.addEventListener("resize", updateDimensions); // Update on resize

    return () => window.removeEventListener("resize", updateDimensions); // Clean up
  }, []);

  const uploadBulletin = async () => {
    try {
      setLoading(true);

      const form = new FormData();
      form.append("date", format(selectedDate, "yyyyMMdd"));
      form.append("pdfs", weeklyUpdate);
      form.append("pdfs", memberWeeklyUpdate);

      await uploadWeeklyUpdate(form);

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
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      maxHeight="85vh"
      maxWidth="1300px"
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <h1 style={{ marginTop: 0 }}>주보 업로드</h1>

          <ButtonDatePicker
            value={selectedDate}
            minDate={MIN_DATE}
            onChange={setSelectedDate}
            disableDate={(date) => !isSunday(date)}
          />

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "49%",
              }}
            >
              <h3>헌금 내역 미포함</h3>
              <div style={{ height: "40svh" }}>
                <p>{weeklyUpdate?.name}</p>
                <Document file={weeklyUpdate} noData="파일을 선택해주세요.">
                  <Page
                    renderTextLayer={false}
                    className="page"
                    width={width}
                    pageNumber={1}
                  />
                </Document>
              </div>
              <div
                style={{
                  height: "15svh",
                }}
              >
                <FileUploadComponent handleChangeFile={handleFileChange} />
              </div>
            </div>

            <div
              style={{
                width: "49%",
              }}
            >
              <h3>헌금 내역 포함</h3>

              <div style={{ height: "40svh" }}>
                <p>{memberWeeklyUpdate?.name}</p>
                <Document
                  file={memberWeeklyUpdate}
                  noData="파일을 선택해주세요."
                >
                  <Page
                    renderTextLayer={false}
                    className="page"
                    width={width}
                    pageNumber={1}
                  />
                </Document>
              </div>

              <div
                style={{
                  height: "15svh",
                }}
              >
                <FileUploadComponent
                  handleChangeFile={handleMemberFileChange}
                />
              </div>
            </div>
          </div>

          <Button
            fullWidth
            variant="outlined"
            onClick={uploadBulletin}
            disabled={!weeklyUpdate || !memberWeeklyUpdate}
            sx={{ mt: "1.5em" }}
          >
            Upload
          </Button>
        </>
      )}
    </CustomModal>
  );
};

export default WeeklyUpdatePostModal;
