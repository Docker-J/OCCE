import { useState, useEffect, useCallback } from "react";

import { CircularProgress, Fab, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";

import { isMobile } from "react-device-detect";

import ButtonDatePicker from "../../../common/ButtonDatePicker";
import PDFReader from "../../../components/News/WeeklyUpdate/PDFReader";

import { useLoaderData, useNavigate } from "react-router";
import AdminComponent from "../../../common/AdminComponent";
import {
  addDays,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSunday,
  parse,
  startOfWeek,
  subDays,
} from "date-fns";

import "./WeeklyUpdate.css";
import useModals from "../../../util/useModal";
import { deleteWeeklyUpdate, getWeeklyUpdate } from "../../../api/weeklyupdate";
import { useSelector } from "react-redux";
import { MIN_DATE } from "../../../constants/WeeklyUpdate";
import CustomConfirmDialog from "../../../common/CustomConfirmDialog";

const titleBackground = {
  backgroundImage: 'url("/img/News/WeeklyUpdate/WeeklyUpdate.webp")',
};

const WeeklyUpdate = () => {
  const { openModal } = useModals();
  const navigate = useNavigate();
  const authenticated = useSelector((state) => state.authToken.authenticated);

  const { maxDate, queryDate } = useLoaderData();

  const [bulletin, setBulletin] = useState(null);
  const [selectedDate, setSelectedDate] = useState(queryDate);

  const [loading, setLoading] = useState(true);

  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);

  // Get Bulletin from Firestore
  const loadFile = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getWeeklyUpdate(selectedDate);

      setBulletin(result.data);
    } catch (err) {
      console.log(err);
      setBulletin(null);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  const deleteFile = async () => {
    const result = await deleteWeeklyUpdate(selectedDate);
    setSelectedDate(parse(JSON.stringify(result.data), "yyyyMMdd", new Date()));
  };

  const previousSunday = () => {
    setSelectedDate((prev) =>
      isSunday(prev) ? subDays(prev, 7) : startOfWeek(prev, { weekStartsOn: 0 })
    );
  };

  const nextSunday = () => {
    setSelectedDate((prev) =>
      isSunday(prev) ? addDays(prev, 7) : endOfWeek(prev, { weekStartsOn: 1 })
    );
  };

  useEffect(() => {
    loadFile();
    navigate("/weeklyupdate/" + format(selectedDate, "yyyyMMdd"));
  }, [selectedDate, authenticated, loadFile, navigate]);

  const [documentDimension, setDocumentDimension] = useState({
    width: null,
    height: null,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const width = isMobile
        ? document.documentElement.clientWidth
        : window.innerWidth;
      const height = isMobile
        ? document.documentElement.clientHeight
        : window.innerHeight;

      const aspectRatio = height / width;
      const isPortrait = aspectRatio >= 16 / 10;

      setDocumentDimension({
        width: isPortrait ? width - 30 : null,
        height: isPortrait ? null : height,
      });
    };

    updateDimensions(); // Initial calculation
    window.addEventListener("resize", updateDimensions); // Update on resize

    return () => window.removeEventListener("resize", updateDimensions); // Clean up
  }, []);

  return (
    <>
      <title>{`${format(selectedDate, "yyyy-MM-dd")} 주보`}</title>

      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            주보
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div
          className="container"
          style={{ textAlign: "center", paddingLeft: 0, paddingRight: 0 }}
        >
          <>
            <IconButton
              id="previousBulletin"
              onClick={previousSunday}
              disabled={
                isSameDay(selectedDate, MIN_DATE) ||
                isBefore(selectedDate, MIN_DATE) ||
                loading
              }
            >
              <ArrowBackIosIcon />
            </IconButton>

            <ButtonDatePicker
              value={selectedDate}
              minDate={MIN_DATE}
              maxDate={maxDate}
              onChange={setSelectedDate}
              disableDate={(date) => !isSunday(date)}
            />

            <IconButton
              id="nextBulletin"
              onClick={nextSunday}
              disabled={
                isSameDay(selectedDate, maxDate) ||
                isAfter(selectedDate, maxDate) ||
                loading
              }
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>

          {loading ? (
            <div style={{ height: "100vh" }}>
              <CircularProgress sx={{ mt: 2 }} />
            </div>
          ) : (
            <PDFReader file={bulletin} documentDimension={documentDimension} />
          )}
        </div>
      </div>

      <AdminComponent>
        <Fab
          id="uploadBulletinButton"
          onClick={async () => {
            const { default: WeeklyUpdatePostModalComponent } = await import(
              "../../../components/News/WeeklyUpdate/WeeklyUpdatePostModal" // Use the correct path
            );

            openModal(WeeklyUpdatePostModalComponent, {
              setParentDate: setSelectedDate,
            });
          }}
        >
          <UploadIcon />
        </Fab>

        <Fab
          id="deleteBulletinButton"
          sx={{
            backgroundColor: "#d10000",
            color: "white",
            ":hover": { backgroundColor: "#ff0000" },
          }}
          onClick={() => setDeleteConfirmDialog(true)}
        >
          <DeleteIcon />
        </Fab>

        <CustomConfirmDialog
          title="삭제하시겠습니까?"
          body={`${format(selectedDate, "yyyyMMdd")} 주보가 삭제됩니다`}
          isOpen={deleteConfirmDialog}
          onClose={() => setDeleteConfirmDialog(false)}
          onConfirm={deleteFile}
        />
      </AdminComponent>
    </>
  );
};

export default WeeklyUpdate;
