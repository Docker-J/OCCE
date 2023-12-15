import { useState, useEffect } from "react";

import { CircularProgress, Fab, ImageList } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import axios from "axios";
import { MemoizedMeditationONComp } from "./MeditationONComp";
import MeditationONModal from "./PhotoUploadModal";
import InfiniteScroll from "react-infinite-scroll-component";

const PAGE_SIZE = 12;

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [end, setEnd] = useState(false);
  const [restored, setRestored] = useState(true);

  const getPhotos = async () => {
    console.log("test getPosts");

    const result = await axios.get(
      `/api/photos/getPhotos${
        photos.length === 0 ? "" : `?lastVisible=${photos.at(-1).id}`
      }`
    );
    setPhotos((prev) => [...prev, ...result.data]);
  };

  useEffect(() => {
    if (photos.length % PAGE_SIZE !== 0) {
      setEnd(true);
    }
  }, [photos]);

  const restore = () => {
    setRestored(true);
    console.log("test restore");
    setPhotos(JSON.parse(sessionStorage.getItem("photos")));
  };

  useEffect(() => {
    window.onpopstate = () => {
      restore();
    };
    setRestored(false);
    return () => {
      window.onpopstate = () => {};
    };
  }, []);

  useEffect(() => {
    if (!restored) {
      getPhotos();
    }
  }, [restored]);

  useEffect(() => {
    return () => {
      sessionStorage.setItem("photos", JSON.stringify(photos));
    };
  });

  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };

  return (
    <>
      <h1>사진</h1>

      <div
        style={{
          position: "absolute",
          width: "100%",
          maxWidth: "1500px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {photos.length !== 0 ? (
          <InfiniteScroll
            dataLength={photos.length}
            next={getPhotos}
            hasMore={!end}
            loader={<CircularProgress />}
            scrollThreshold={0.75}
            // scrollableTarget="scrollableDiv"
            style={{ overflowY: "hidden" }}
          >
            {
              <ImageList sx={{ mx: "0.5rem" }} cols={3} gap={2.5}>
                <MemoizedMeditationONComp photos={photos} />
              </ImageList>
            }
          </InfiniteScroll>
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

      <MeditationONModal openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
};

export default Photos;
