import { Box, Button, IconButton, Modal } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { useDropzone } from "react-dropzone";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import DeleteIcon from "@mui/icons-material/Delete";

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

  const handleChangeFile = (file) => {
    setFilesToUpload((prev) => [...prev, ...file]);
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
    const clickedItem = e.target.src;

    let i;
    for (i = 0; i < imagesPreview.length; i++) {
      if (imagesPreview[i] === clickedItem) {
        break;
      }
    }
    URL.revokeObjectURL(imagesPreview[i]);
    const newArray = [...filesToUpload]; // Make a copy of the original array
    newArray.splice(i, 1); // Remove the element at the specified index
    setFilesToUpload(newArray);
  };

  useEffect(() => {
    return () => {
      imagesPreview.map((preview) => URL.revokeObjectURL(preview));
    };
  });

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      handleChangeFile(acceptedFiles);
    },
  });

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      // aria-labelledby="modal-modal-title"
      // aria-describedby="modal-modal-description"
    >
      <Box sx={style} bgcolor="white">
        <div
          style={{
            width: "95%",
            height: "90%",
            border: "1pt dotted #f57c00",
            borderRadius: "1em",
            overflowY: "auto",
          }}
          {...getRootProps()}
        >
          <input onChange={(e) => handleChangeFile(e)} {...getInputProps()} />
          {filesToUpload.length === 0 ? (
            "Click or Drag Files"
          ) : (
            <DndProvider backend={HTML5Backend}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  margin: "10pt",
                }}
              >
                {imagesPreview.map((image) => (
                  <div
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      borderRadius: 2,
                      border: "1px solid #eaeaea",
                      marginBottom: 8,
                      marginRight: 8,
                      width: "18vw",
                      height: "18vw",
                      padding: 4,
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        minWidth: 0,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={image}
                        alt="preview"
                        style={{
                          display: "block",
                          width: "auto",
                          height: "100%",
                        }}
                        onClick={(e) => removeImage(e)}
                      />
                    </div>
                    <IconButton
                      style={{
                        position: "absolute",
                        display: "block",
                        zIndex: 99,
                        top: 0,
                        right: 0,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
              </div>
            </DndProvider>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default MeditationONModal;
