import { useState, useEffect, useRef } from "react";

import {
  CircularProgress,
  Fab,
  ImageList,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import axios from "axios";
import { MemoizedMeditationONComp } from "./MeditationONComp";

import InfiniteScroll from "react-infinite-scroll-component";
import useModals from "../../../util/useModal";
import AdminComponent from "../../../common/AdminComponent";
import Footer from "../../../header/Footer";

import "../../NextGen/NextGen.css";
import PhotosUploadModal from "./PhotosUploadModal";

const PAGE_SIZE = 12;

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.30)), url("/img/WeeklyUpdate.jpg")',
};

const Photos = () => {
  const matches = useMediaQuery("(min-width:1200px)");
  const { openModal } = useModals();

  const [photos, setPhotos] = useState([]);
  const [end, setEnd] = useState(false);
  const [restored, setRestored] = useState(true);

  const getPhotos = async () => {
    console.log("test getPosts");

    const result = await axios.get(
      `/api/photos/getPhotos${
        photos.length === 0
          ? ""
          : `?lastVisible=${photos.at(-1).id}&timeStamp=${
              photos.at(-1).Timestamp
            }`
      }`
    );

    if (result.data.length > 0) {
      setPhotos((prev) => [...prev, ...result.data]);
    } else {
      setEnd(true);
    }
  };

  useEffect(() => {
    if (photos.length % PAGE_SIZE !== 0) {
      setEnd(true);
    }
  }, [photos]);

  useEffect(() => {
    window.onpopstate = () => {
      setRestored(true);
      console.log("test restore");
      setPhotos(JSON.parse(sessionStorage.getItem("posts")));
    };
    setRestored(false);
    return () => {
      window.onpopstate = () => {};
    };
  }, []);

  useEffect(() => {
    if (restored !== null && !restored) {
      getPhotos();
    }
  }, [restored]);

  useEffect(() => {
    return () => {
      sessionStorage.setItem("photos", JSON.stringify(photos));
    };
  });

  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current && !end && photos.length >= 12) {
      setTimeout(() => {
        try {
          const contentHeight = scrollRef.current.clientHeight;
          const screenHeight = window.innerHeight - 500;

          console.log("test content", contentHeight);
          console.log("test screen", screenHeight);

          if (contentHeight > 100 && contentHeight < screenHeight) {
            getPhotos();
          }
        } catch (error) {}
      }, 500);
    }

    // re-run effect when items change
  }, [photos]);

  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            교회사진
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          {photos.length === 0 ? (
            <Stack alignItems="center">
              <CircularProgress />
            </Stack>
          ) : (
            <InfiniteScroll
              dataLength={photos.length}
              next={getPhotos}
              hasMore={!end}
              loader={<CircularProgress />}
              scrollThreshold={1}
              style={{ overflowY: "hidden" }}
            >
              {
                <ImageList ref={scrollRef} cols={matches ? 4 : 3} gap={2.5}>
                  <MemoizedMeditationONComp photos={photos} />
                </ImageList>
              }
            </InfiniteScroll>
          )}
        </div>
      </div>

      <AdminComponent>
        <Fab
          variant="primary"
          style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
          onClick={() => openModal(PhotosUploadModal, {})}
        >
          <AddIcon />
        </Fab>
      </AdminComponent>

      {end && <Footer />}
    </>
  );
};

export default Photos;
