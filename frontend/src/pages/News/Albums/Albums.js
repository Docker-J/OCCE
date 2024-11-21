import { useState, useEffect, useRef } from "react";

import {
  Box,
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
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 12;

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.40)), url("/img/News/Albums/Albums.webp")',
  backgroundPosition: "32% 22%",
};

const Albums = () => {
  const matches = useMediaQuery("(min-width:1200px)");
  let [searchParams, setSearchParams] = useSearchParams();
  const { openModal } = useModals();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    searchParams.has("year") ? new Date(searchParams.get("year"), 0, 1) : null
  );
  const [albums, setAlbums] = useState([]);
  const [end, setEnd] = useState(false);
  const [restored, setRestored] = useState(null);

  useEffect(() => {
    setAlbums([]);
    setEnd(false);
    console.log(selectedYear);
    selectedYear
      ? setSearchParams({ year: selectedYear.getFullYear() })
      : setSearchParams((prev) => prev.delete("year"));
  }, [selectedYear, setSearchParams]);

  useEffect(() => {
    if (restored !== null) {
      onLoad();
    }
  }, [searchParams.get("year")]);

  const onLoad = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await getAlbums(albums, selectedYear?.getFullYear());

      if (result.data.length > 0) {
        setAlbums((prev) => [...prev, ...result.data]);
      } else {
        setEnd(true);
      }
    } finally {
      setIsLoading(false);
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
      onLoad();
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
            onLoad();
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
        <Box
          className="container"
          sx={{
            px: { xs: "0 !important", md: "1.5em !important" },
            py: "0 !important",
          }}
        >
          {albums.length <= 0 ? (
            <Stack alignItems="center" sx={{ py: 8 }}>
              {isLoading ? <CircularProgress /> : "사진이 존재하지 않습니다"}
            </Stack>
          ) : (
            <InfiniteScroll
              dataLength={albums.length}
              next={onLoad}
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
                <ImageList ref={scrollRef} cols={matches ? 4 : 3} gap={3}>
                  <MemoizedMeditationONComp
                    posts={albums}
                    cols={matches ? 4 : 3}
                  />
                </ImageList>
              }
            </InfiniteScroll>
          )}
        </Box>
      </div>

      <AdminComponent>
        <Fab
          variant="primary"
          style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
          onClick={() => openModal(AlbumUploadModal, {})}
        >
          <AddIcon />
        </Fab>
      </AdminComponent>

      {end && <Footer />}
    </>
  );
};

export default Albums;
