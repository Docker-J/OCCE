import { useState, useEffect } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Fab,
  ImageList,
  ImageListItem,
  Modal,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  query,
} from "firebase/firestore";
import { db } from "../../api/firebase";

import imageCompression from "browser-image-compression";
import { Link } from "react-router-dom";

const MeditationON = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1000px",
    height: "1000px",
    bgcolor: "#ffffff",
    border: "0.1px solid #f57c00",
    boxShadow: 24,
    p: 2,
  };

  const [filesToUpload, setFilesToUpload] = useState(null);

  const handleChangeFile = ({ target }) => {
    setFilesToUpload(target.files);
  };

  async function getImages() {
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
    getImages().then((result) => {
      post(result);
    });
  };

  async function post(images) {
    await addDoc(collection(db, "MeditationON"), {
      images: images,
    });
  }

  const [images, setImages] = useState(null);

  async function getImages() {
    const querySnap = await getDocs(collection(db, "MeditationON"));
    setImages(querySnap);
    console.log(querySnap.docs[0].data());
  }

  useEffect(() => {
    getImages();
  }, []);

  const fileToBase64 = async (file, cb) => {
    const compressedImage = await imageCompression(file, { maxSizeMB: 0.1 });
    const reader = new FileReader();
    reader.readAsDataURL(compressedImage);
    reader.onload = function () {
      cb(null, reader.result);
    };
    reader.onerror = function (error) {
      cb(error, null);
    };
  };

  // function fileToBase64(file) {
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = function () {
  //       resolve(reader.result);
  //     };
  //   });
  // }

  return (
    <>
      <div
        style={{
          position: "absolute",
          // width: "100%",
          // maxWidth: "1500px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <h1>묵상 ON</h1>
        {images ? (
          <ImageList sx={{ width: 900, height: 900 }} cols={3} rowHeight={300}>
            {images.docs.map((item) => (
              <ImageListItem
                component={Link}
                to={"/meditationON/post?docID=" + item.id}
              >
                <img
                  // src={`${
                  //   item.data().images[0]
                  // }?w=164&h=164&fit=crop&auto=format`}
                  src={`${
                    item.data().images[0]
                  }?w=300&h=300&fit=crop&auto=format`}
                  srcSet={item.data().images[0]}
                  // onClick={}
                  // srcSet={`${
                  //   item.data().images[0]
                  // }?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  // // alt={item.title}
                  // loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <CircularProgress />
        )}
      </div>

      <Fab
        variant="primary"
        style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>
      <Modal
        open={openModal}
        onClose={handleClose}
        // aria-labelledby="modal-modal-title"
        // aria-describedby="modal-modal-description"
      >
        <Box sx={style} bgcolor="white">
          <Button variant="contained" component="label">
            Upload
            <input
              hidden
              accept="image/*"
              multiple
              type="file"
              onChange={handleChangeFile}
            />
          </Button>

          <Button onClick={uploadFiles} variant="contained" component="label">
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default MeditationON;