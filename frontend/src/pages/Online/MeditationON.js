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
    setFilesToUpload([]);
    setImagesPreview([]);
    setOpenModal(false);
  };

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

  const [filesToUpload, setFilesToUpload] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const handleChangeFile = (e) => {
    setFilesToUpload(e.target.files);
  };

  useEffect(() => {
    Array.from(filesToUpload).forEach((image) => {
      setImagesPreview([...imagesPreview, URL.createObjectURL(image)]);
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

  // useEffect(() => {
  //   getImages();
  // }, []);

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
    <>
      <h1>묵상 ON</h1>

      <div
        style={{
          position: "absolute",
          width: "100%",
          maxWidth: "1500px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <ImageList sx={{ mx: "0.5rem" }} cols={3}>
          <ImageListItem component={Link} to={"/online/meditationON/" + 123456}>
            <img
              // src={`${
              //   item.data().images[0]
              // }?w=164&h=164&fit=crop&auto=format`}
              src="/img/square.jpg?w=164&h=164&fit=crop&auto=format"
              // onClick={}
              srcSet="/img/Main/join.webp?w=164&h=164&fit=cover&auto=format&dpr=2 2x"
              alt="test"
              loading="lazy"
            />
          </ImageListItem>
          <ImageListItem
          // component={Link}
          // to={"/meditationON/post?docID=" + item.id}
          >
            <img
              // src={`${
              //   item.data().images[0]
              // }?w=164&h=164&fit=crop&auto=format`}
              src="/img/Main/join.webp?w=300&h=300&fit=crop&auto=format"
              // onClick={}
              // srcSet={`${
              //   item.data().images[0]
              // }?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt="test"
              // loading="lazy"
            />
          </ImageListItem>
          <ImageListItem
          // component={Link}
          // to={"/meditationON/post?docID=" + item.id}
          >
            <img
              // src={`${
              //   item.data().images[0]
              // }?w=164&h=164&fit=crop&auto=format`}
              src="/img/Main/join.webp?w=164&h=164&fit=crop&auto=format&dpr=2"
              // onClick={}
              // srcSet={`${
              //   item.data().images[0]
              // }?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt="test"
              // loading="lazy"
            />
          </ImageListItem>
          <ImageListItem
          // component={Link}
          // to={"/meditationON/post?docID=" + item.id}
          >
            <img
              // src={`${
              //   item.data().images[0]
              // }?w=164&h=164&fit=crop&auto=format`}
              src="/img/Main/join.webp?w=164&h=164&fit=crop&auto=format&dpr=2"
              // onClick={}
              // srcSet={`${
              //   item.data().images[0]
              // }?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt="test"
              loading="lazy"
            />
          </ImageListItem>
        </ImageList>
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
              onChange={(e) => handleChangeFile(e)}
            />
          </Button>

          <Button onClick={uploadFiles} variant="contained" component="label">
            Submit
          </Button>

          {/* {imagesPreview.map((image) => (
            <img src={image} />
          ))} */}
        </Box>
      </Modal>
    </>
  );
};

export default MeditationON;
