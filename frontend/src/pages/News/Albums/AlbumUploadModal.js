import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import update from "immutability-helper";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import useSnackbar from "../../../util/useSnackbar";
import PreviewCard from "../../../components/Online/MeditationON/PreviewCard";
import { uploadAlbum } from "../../../api/albums";
import ButtonDatePicker from "../../../common/ButtonDatePicker";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
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
      // setImagesPreview((prev) => [...prev, URL.createObjectURL(image)]);
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

  const removeImage = (i) => {
    URL.revokeObjectURL(imagesPreview[i]);
    setFilesToUpload((prev) =>
      update(prev, {
        $splice: [[i, 1]],
      })
    );
    setImagesPreview((prev) =>
      update(prev, {
        $splice: [[i, 1]],
      })
    );
  };

  const removeAllImage = () => {
    imagesPreview.forEach((preview) => URL.revokeObjectURL(preview));
    setFilesToUpload([]);
    setImagesPreview([]);
  };

  const movePhoto = useCallback((dragIndex, hoverIndex) => {
    setFilesToUpload((prev) =>
      update(prev, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prev[dragIndex]],
        ],
      })
    );
    setImagesPreview((prev) =>
      update(prev, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prev[dragIndex]],
        ],
      })
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      handleChangeFile(acceptedFiles);
    },
    noDragEventsBubbling: true,
  });

  const renderCard = useCallback(
    (image, index) => {
      return (
        <PreviewCard
          key={index}
          index={index}
          image={image}
          cover={index === coverImage}
          setCoverImage={setCoverImage}
          movePhoto={movePhoto}
          removeImage={removeImage}
        />
      );
    },
    [coverImage]
  );

  const [loading, setLoading] = useState(false);

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      // aria-labelledby="modal-modal-title"
      // aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
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

            <DndProvider backend={HTML5Backend}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignContent: "flex-start",
                  justifyContent: "space-between",
                  width: "95%",
                  height: "65%",
                  overflowX: "auto",
                }}
              >
                {imagesPreview.map((image, index) => renderCard(image, index))}
              </div>
            </DndProvider>
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
                  <Typography>Click or Drag Photos to here</Typography>
                </div>
              </Box>
            </div>
            <div style={{ display: "flex", marginTop: "2em" }}>
              <Button
                variant="outlined"
                disabled={title.trim() === "" || filesToUpload.length <= 0}
                onClick={uploadImages}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                onClick={removeAllImage}
                disabled={filesToUpload.length <= 0}
              >
                Clear All
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

export default AlbumUploadModal;
