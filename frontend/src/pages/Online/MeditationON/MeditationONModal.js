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
    width: "80vw",
    height: "80vh",
    maxWidth: "1300px",
    bgcolor: "#ffffff",
    // border: "1pt solid #f57c00",
    boxShadow: 24,
    borderRadius: "0.5em",
    p: 1,
    pt: 5,
    pb: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const handleClose = () => {
    setFilesToUpload([]);
    setImagesPreview([]);
    setOpenModal(false);
  };

  const [filesToUpload, setFilesToUpload] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const handleChangeFile = (e) => {
    setFilesToUpload((prev) => [...prev, ...e.target.files]);
  };

  useEffect(() => {
    setImagesPreview([]);
    filesToUpload.forEach((image) => {
      setImagesPreview((prev) => [...prev, URL.createObjectURL(image)]);
    });
  }, [filesToUpload]);

  async function imgToBase64() {
    // return new Promise((resolve) => {
    //   const images = [];
    //   for (let i = 0; i < filesToUpload.length; i++) {
    //     fileToBase64(filesToUpload[i], (err, result) => {
    //       images.push(result);
    //       // if (i === filesToUpload.length - 1) {
    //       // }
    //     });
    //   }
    //   resolve(images);
    // });

    const promises = filesToUpload.map((file) => {
      return new Promise((resolve) => {
        fileToBase64(file, (err, result) => {
          resolve(result);
        });
      });
    });

    const images = await Promise.all(promises);
    return images;
  }

  const uploadFiles = () => {
    imgToBase64().then((result) => {
      post(result);
    });
  };

  async function post(images) {
    const data = {};

    images.forEach((image, index) => {
      data[index] = image;
    });

    console.log(data);

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

  const removeImage = (e) => {
    const previews = document.querySelectorAll(".previews");
    const clickedItem = e.target;

    let i;
    for (i = 0; i < previews.length; i++) {
      if (previews[i] === clickedItem) {
        break;
      }
    }

    const newArray = [...filesToUpload]; // Make a copy of the original array
    newArray.splice(i, 1); // Remove the element at the specified index
    setFilesToUpload(newArray);
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
            <img
              className="previews"
              src={image}
              width={300}
              alt="preview"
              onClick={(e) => removeImage(e)}
            />
          ))}
        </div>

        <div
          style={{
            width: "95%",
            height: "50%",
            border: "1pt solid #f57c00",
            borderRadius: "1em",
          }}
        >
          <input
            hidden
            accept="image/*"
            multiple
            type="file"
            onChange={(e) => handleChangeFile(e)}
          />
          Click or Drag Files
          <Button variant="outlined" component="label">
            Choose Files
            <input
              hidden
              accept="image/*"
              multiple
              type="file"
              onChange={(e) => handleChangeFile(e)}
            />
          </Button>
        </div>

        <Button
          onClick={uploadFiles}
          variant="outlined"
          component="label"
          disabled={filesToUpload.length === 0}
        >
          Upload
        </Button>
      </Box>
    </Modal>
  );
};

export default MeditationONModal;
