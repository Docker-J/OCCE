import { useState, useEffect, useRef } from "react";

import {
  Box,
  CircularProgress,
  Fab,
  ImageList,
  ImageListItem,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";

import InfiniteScroll from "react-infinite-scroll-component";
import useModals from "../../../util/useModal";
import AdminComponent from "../../../common/AdminComponent";
import Footer from "../../../header/Footer";

import { getAlbums } from "../../../api/albums";
import AlbumUploadModal from "./AlbumUploadModal";

import { MemoizedMeditationONComp } from "./MeditationONImageListItem";
import ButtonYearPicker from "../../../common/ButtonYearPicker";
import { useSearchParams, useNavigationType } from "react-router";

const PAGE_SIZE = 12;

const titleBackground = {
  backgroundImage: 'url("/img/News/Albums/Albums.webp")',
  backgroundPosition: "32% 22%",
};

const Albums = () => {
  const matches = useMediaQuery("(min-width:1200px)");
  const [searchParams, setSearchParams] = useSearchParams();
  const navType = useNavigationType();
  const { openModal } = useModals();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    searchParams.has("year") ? new Date(Number(searchParams.get("year")), 0, 1) : null
  );
  const [albums, setAlbums] = useState([]);
  const [end, setEnd] = useState(false);
  const isInitialMount = useRef(true);

  const fetchInitialAlbums = async (yearValue) => {
    setIsLoading(true);
    setEnd(false);
    try {
      const result = await getAlbums([], yearValue);
      const data = result.data || [];
      setAlbums(data);
      if (data.length === 0 || data.length % PAGE_SIZE !== 0) {
        setEnd(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onLoad = async () => {
    if (isLoading || end) return;

    setIsLoading(true);
    try {
      const result = await getAlbums(albums, selectedYear?.getFullYear());
      const data = result.data || [];

      if (data.length > 0) {
        setAlbums((prev) => {
          const next = [...prev, ...data];
          if (next.length % PAGE_SIZE !== 0) {
            setEnd(true);
          }
          return next;
        });
      } else {
        setEnd(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAlbums = async () => {
    sessionStorage.removeItem("albums");
    await fetchInitialAlbums(selectedYear?.getFullYear());
  };

  useEffect(() => {
    if (navType === "POP" && sessionStorage.getItem("albums")) {
      try {
        const cached = JSON.parse(sessionStorage.getItem("albums"));
        if (Array.isArray(cached) && cached.length > 0) {
          setAlbums(cached);
          if (cached.length % PAGE_SIZE !== 0) {
            setEnd(true);
          }
          return;
        }
      } catch {}
    }
    fetchInitialAlbums(selectedYear?.getFullYear());
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    sessionStorage.removeItem("albums");
    if (selectedYear) {
      setSearchParams({ year: String(selectedYear.getFullYear()) });
    } else {
      setSearchParams({});
    }
    fetchInitialAlbums(selectedYear?.getFullYear());
  }, [selectedYear]);

  useEffect(() => {
    return () => {
      if (albums.length > 0) {
        sessionStorage.setItem("albums", JSON.stringify(albums));
      }
    };
  }, [albums]);

  const scrollRef = useRef();

  useEffect(() => {
    let timer;
    if (scrollRef.current && !end && albums.length >= PAGE_SIZE) {
      timer = setTimeout(() => {
        try {
          const contentHeight = scrollRef.current.clientHeight;
          const screenHeight = window.innerHeight - 500;

          if (contentHeight > 100 && contentHeight < screenHeight) {
            onLoad();
          }
        } catch {}
      }, 500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [albums, end]);

  return (
    <>
      <title>교회사진 - OCCE</title>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 830,
              letterSpacing: "0.4em",
              pl: "0.4em",
              color: "white"
            }}>
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
            isLoading ? (
              <Box sx={{ width: "100%", py: 3 }}>
                <ImageList cols={matches ? 4 : 3} gap={12}>
                  {Array.from({ length: matches ? 8 : 6 }).map((_, i) => (
                    <ImageListItem key={i}>
                      <Skeleton
                        variant="rounded"
                        sx={{
                          width: "100%",
                          height: 0,
                          paddingBottom: "100%",
                          borderRadius: "12px",
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            ) : (
              <Stack
                sx={{
                  alignItems: "center",
                  py: 10,
                  gap: 1,
                }}
              >
                <PhotoLibraryOutlinedIcon
                  sx={{ fontSize: 52, color: "text.disabled", mb: 0.5 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "text.secondary" }}
                >
                  등록된 사진이 없습니다
                </Typography>
                <Typography variant="body2" sx={{ color: "text.disabled" }}>
                  선택하신 연도에는 등록된 사진 앨범이 없습니다.
                </Typography>
              </Stack>
            )
          ) : (
            <InfiniteScroll
              dataLength={albums.length}
              next={onLoad}
              hasMore={!end}
              loader={
                <Stack sx={{
                  alignItems: "center"
                }}>
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
          onClick={() => openModal(AlbumUploadModal, { onSuccess: refreshAlbums })}
        >
          <AddIcon />
        </Fab>
      </AdminComponent>
      {end && <Footer />}
    </>
  );
};

export default Albums;
