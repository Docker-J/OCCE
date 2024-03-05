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

import InfiniteScroll from "react-infinite-scroll-component";
import useModals from "../../../util/useModal";
import AdminComponent from "../../../common/AdminComponent";
import Footer from "../../../header/Footer";

import "../../NextGen/NextGen.css";
import { getAlbums } from "../../../api/albums";
import AlbumUploadModal from "./AlbumUploadModal";

import { MemoizedMeditationONComp } from "./MeditationONImageListItem";
import ButtonYearPicker from "../../../common/ButtonYearPicker";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 12;

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.40)), url("/img/News/Albums/Albums.jpg")',
};

const Albums = () => {
  const matches = useMediaQuery("(min-width:1200px)");
  const navigate = useNavigate();
  const { openModal } = useModals();

  const [selectedYear, setSelectedYear] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [end, setEnd] = useState(false);
  const [restored, setRestored] = useState(true);

  useEffect(() => {
    selectedYear
      ? navigate(`?year=${selectedYear.getFullYear()}`)
      : navigate("");
  }, [selectedYear]);

  const getPhotos = async () => {
    const result = await getAlbums(albums);

    if (result.data.length > 0) {
      setAlbums((prev) => [...prev, ...result.data]);
    } else {
      setEnd(true);
    }
  };

  useEffect(() => {
    if (albums.length % PAGE_SIZE !== 0) {
      setEnd(true);
    }
  }, [albums]);

  useEffect(() => {
    window.onpopstate = () => {
      setRestored(true);
      console.log("test restore");
      setAlbums(JSON.parse(sessionStorage.getItem("albums")));
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
      sessionStorage.setItem("albums", JSON.stringify(albums));
    };
  });

  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current && !end && albums.length >= 12) {
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
  }, [albums]);

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
          <ButtonYearPicker
            sx={{ mt: 2 }}
            value={selectedYear}
            minDate={new Date("2022/04/03")}
            maxDate={new Date()}
            onChange={setSelectedYear}
          />
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          {albums.length <= 0 ? (
            <Stack alignItems="center">
              <CircularProgress />
            </Stack>
          ) : (
            <InfiniteScroll
              dataLength={albums.length}
              next={getPhotos}
              hasMore={!end}
              loader={
                <Stack alignItems="center">
                  <CircularProgress />
                </Stack>
              }
              scrollThreshold={1}
              style={{ overflowY: "hidden" }}
            >
              {
                <ImageList ref={scrollRef} cols={matches ? 4 : 3} gap={2.5}>
                  <MemoizedMeditationONComp
                    posts={albums}
                    cols={matches ? 4 : 3}
                  />
                </ImageList>
              }
            </InfiniteScroll>
          )}
        </div>
      </div>

      <Fab
        variant="primary"
        style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
        onClick={() => openModal(AlbumUploadModal, {})}
      >
        <AddIcon />
      </Fab>

      {end && <Footer />}
    </>
  );
};

export default Albums;
