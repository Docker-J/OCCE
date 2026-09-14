import { Button, CircularProgress } from "@mui/material";
import { useState, useActionState } from "react";
import update from "immutability-helper";

import { format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import useSnackbar from "../../../util/useSnackbar";
import { uploadImages } from "../../../api/meditationon";
import CustomModal from "../../../common/CustomModal";
import FileUploadComponent from "../../../common/FileUploadComponent";
import ImagePreviews from "../../../common/ImagePreviews";
import ButtonDatePicker from "../../../common/ButtonDatePicker";
import { MIN_DATE } from "../../../constants/WeeklyUpdate";

const MeditationONModal = ({ isOpen, onClose, onSuccess }) => {
  const { openSnackbar } = useSnackbar();

  const handleClose = () => {
    removeAllImage();
    onClose();
  };

  const [filesToUpload, setFilesToUpload] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleChangeFile = (files) => {
    setFilesToUpload((prev) => [...prev, ...files]);
    files.forEach((image) => {
      setImagesPreview((prev) =>
        update(prev, { $push: [URL.createObjectURL(image)] })
      );
    });
  };

  const [, formAction, isPending] = useActionState(async () => {
    const form = new FormData();

    filesToUpload.forEach((image) => {
      form.append("images", image);
    });

    try {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      const edmontonTimestamp = fromZonedTime(
        `${dateString} 00:00`,
        "America/Edmonton"
      );
      await uploadImages(form, edmontonTimestamp.toISOString());

      openSnackbar("success", "Uploaded Succesfully!");
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
      return { success: true };
    } catch (error) {
      console.error("MeditationON upload error:", error);
      openSnackbar(
        "error",
        error.message || "Error Occured. Please contact to the administrator."
      );
      return { error };
    }
  }, null);

  const removeAllImage = () => {
    imagesPreview.forEach((preview) => URL.revokeObjectURL(preview));
    setFilesToUpload([]);
    setImagesPreview([]);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      maxHeight="85vh"
      maxWidth="1300px"
    >
      {isPending ? (
        <CircularProgress />
      ) : (
        <>
          <ImagePreviews
            imagesPreview={imagesPreview}
            setImagesPreview={setImagesPreview}
            setFilesToUpload={setFilesToUpload}
          />

          <div
            style={{
              width: "100%",
              height: "12.75svh",
            }}
          >
            <FileUploadComponent
              accept={{ "image/*": [] }}
              handleChangeFile={handleChangeFile}
              multiple={true}
            />
          </div>

          <ButtonDatePicker
            value={selectedDate}
            minDate={MIN_DATE}
            onChange={setSelectedDate}
          />

          <div style={{ display: "flex", marginTop: "1.5em", width: "100%" }}>
            <Button
              variant="outlined"
              disabled={isPending || filesToUpload.length <= 0}
              onClick={formAction}
              fullWidth
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              onClick={removeAllImage}
              disabled={isPending || filesToUpload.length <= 0}
              fullWidth
            >
              Clear All
            </Button>
          </div>
        </>
      )}
    </CustomModal>
  );
};

export default MeditationONModal;
