import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import update from "immutability-helper";

import useSnackbar from "../../../util/useSnackbar";
import { uploadImages } from "../../../api/meditationon";
import CustomModal from "../../../common/CustomModal";
import FileUploadComponent from "../../../common/FileUploadComponent";
import ImagePreviews from "../../../common/ImagePreviews";

const MeditationONModal = ({ isOpen, onClose }) => {
  const { openSnackbar } = useSnackbar();

  const handleClose = () => {
    removeAllImage();
    onClose();
  };

  const [filesToUpload, setFilesToUpload] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const handleChangeFile = (files) => {
    setFilesToUpload((prev) => [...prev, ...files]);
    files.forEach((image) => {
      setImagesPreview((prev) =>
        update(prev, { $push: [URL.createObjectURL(image)] })
      );
    });
  };

  const onSubmit = async () => {
    const form = new FormData();

    filesToUpload.forEach((image) => {
      form.append("images", image);
    });

    try {
      setLoading(true);

      await uploadImages(form);

      openSnackbar("success", "Uploaded Succesfully!");
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

  const removeAllImage = () => {
    imagesPreview.forEach((preview) => URL.revokeObjectURL(preview));
    setFilesToUpload([]);
    setImagesPreview([]);
  };

  const [loading, setLoading] = useState(false);

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      maxHeight="85vh"
      maxWidth="1300px"
      // aria-labelledby="modal-modal-title"
      // aria-describedby="modal-modal-description"
    >
      {loading ? (
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

          <div style={{ display: "flex", marginTop: "1.5em", width: "100%" }}>
            <Button
              variant="outlined"
              disabled={filesToUpload.length <= 0}
              onClick={onSubmit}
              fullWidth
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              onClick={removeAllImage}
              disabled={filesToUpload.length <= 0}
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
