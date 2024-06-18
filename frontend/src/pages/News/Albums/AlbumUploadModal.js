import { Button, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import update from "immutability-helper";

import useSnackbar from "../../../util/useSnackbar";
import { uploadAlbum } from "../../../api/albums";
import ButtonDatePicker from "../../../common/ButtonDatePicker";
import ImagePreviews from "../../../common/ImagePreviews";
import FileUploadComponent from "../../../common/FileUploadComponent";
import CustomModal from "../../../common/CustomModal";

const AlbumUploadModal = ({ isOpen, onClose }) => {
  const { openSnackbar } = useSnackbar();

  const handleClose = () => {
    removeAllImage();
    onClose();
  };

  const today = new Date();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [coverImage, setCoverImage] = useState(0);
  const [imagesPreview, setImagesPreview] = useState([]);

  const handleChangeFile = (files) => {
    setFilesToUpload((prev) => [...prev, ...files]);
    files.forEach((image) => {
      setImagesPreview((prev) =>
        update(prev, { $push: [URL.createObjectURL(image)] })
      );
    });
  };

  const uploadImages = async () => {
    const form = new FormData();

    form.append("title", title);
    form.append("date", date.toISOString());

    filesToUpload.forEach((image) => {
      form.append("images", image);
    });

    form.append("cover", coverImage);

    try {
      setLoading(true);

      await uploadAlbum(form);

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
      height="85vh"
      maxWidth="1300px"
      loading={loading}
      // aria-labelledby="modal-modal-title"
      // aria-describedby="modal-modal-description"
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div style={{ display: "flex", width: "95%" }}>
            <ButtonDatePicker
              value={date}
              minDate={new Date("2022/04/03")}
              maxDate={today}
              onChange={setDate}
            />
            <TextField
              id="filled-basic"
              label="Album Title"
              variant="outlined"
              sx={{ flexGrow: 1, ml: 4 }}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <ImagePreviews
            imagesPreview={imagesPreview}
            setImagesPreview={setImagesPreview}
            setFilesToUpload={setFilesToUpload}
            cover={coverImage}
            setCoverImage={setCoverImage}
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
              disabled={title.trim() === "" || filesToUpload.length <= 0}
              onClick={uploadImages}
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

export default AlbumUploadModal;
