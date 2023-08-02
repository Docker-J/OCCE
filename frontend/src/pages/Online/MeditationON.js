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
import {
  Link,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import MeditationONComp from "./MeditationONComp";

const PAGE_SIZE = 9;

const MeditationON = () => {
  const fetcher = useFetcher();
  const initialPosts = useLoaderData();
  const [posts, setPosts] = useState(initialPosts);
  const [end, setEnd] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();

  const loadNext = (event) => {
    event.preventDefault();
    fetcher.load(
      `/online/meditationON?page=${Number(searchParams.get("page")) +
        1}&lastVisible=${posts.at(-1).id}`
    );
  };

  useEffect(() => {
    if (posts.length % PAGE_SIZE !== 0) {
      setEnd(true);
    }
    return () => {
      sessionStorage.setItem("posts", JSON.stringify(posts));
    };
  }, [posts]);

  useEffect(() => {
    if (fetcher.data && fetcher.data.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...fetcher.data]);
      searchParams.set("page", Number(searchParams.get("page")) + 1);
      setSearchParams(searchParams);
    }
  }, [fetcher.data]);

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
        <MeditationONComp posts={posts} />
        <Button disabled={end} onClick={(e) => loadNext(e)}>
          Load More
        </Button>
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
