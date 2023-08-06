import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";

const MeditationONModal = ({ openModal, setOpenModal }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "800px",
    height: "800px",
    bgcolor: "#ffffff",
    border: "0.1px solid #f57c00",
    boxShadow: 24,
    p: 2,
  };

  const handleClose = () => {
    setFilesToUpload([]);
    setImagesPreview([]);
    setOpenModal(false);
  };

  const [filesToUpload, setFilesToUpload] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const handleChangeFile = (e) => {
    setFilesToUpload(e.target.files);
  };

  useEffect(() => {
    Array.from(filesToUpload).forEach((image) => {
      setImagesPreview((prev) => [prev.push, URL.createObjectURL(image)]);
    });
  }, [filesToUpload]);

  async function imgToBase64() {
    return new Promise((resolve) => {
      let images = [];
      for (let i = 0; i < filesToUpload.length; i++) {
        fileToBase64(filesToUpload[i], (err, result) => {
          images.push(result);
          if (i === filesToUpload.length - 1) {
            resolve(images);
          }
        });
      }
    });
  }

  const uploadFiles = () => {
    imgToBase64().then((result) => {
      post(result);
    });
  };

  async function post(images) {
    const data = {};
    for (let i = 0; i < images.length; i++) {
      data[i] = images.shift();
    }
    const test = await axios.post("/api/meditationON/uploadPost", {
      images: data,
    });
  }

  const fileToBase64 = async (file, cb) => {
    const compressedImage = await imageCompression(file, { maxSizeMB: 0.1 });
    const reader = new FileReader();
    reader.readAsDataURL(compressedImage);
    reader.onload = function() {
      cb(null, reader.result);
    };
    reader.onerror = function(error) {
      cb(error, null);
    };
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      // aria-labelledby="modal-modal-title"
      // aria-describedby="modal-modal-description"
    >
      <Box sx={style} bgcolor="white">
        <div style={{ display: "flex" }}>
          {imagesPreview.map((image) => (
            <img src={image} />
          ))}
        </div>

        <Button variant="contained" component="label">
          Upload
          <input
            hidden
            accept="image/*"
            multiple
            type="file"
            onChange={(e) => handleChangeFile(e)}
          />
        </Button>

        <Button onClick={uploadFiles} variant="contained" component="label">
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default MeditationONModal;
