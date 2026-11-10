import { useEffect, useRef } from "react";

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
import useScrollRestoration from "../../../util/useScrollRestoration";
import AdminComponent from "../../../common/AdminComponent";
import Footer from "../../../header/Footer";

import { getAlbums } from "../../../api/albums";

import { MemoizedMeditationONComp } from "./MeditationONImageListItem";
import ButtonYearPicker from "../../../common/ButtonYearPicker";
import { useSearchParams } from "react-router";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 12;
const MIN_ALBUM_DATE = new Date("2022/04/03");
const MAX_ALBUM_DATE = new Date();

const titleBackground = {
  backgroundImage: 'url("/img/News/Albums/Albums.webp")',
  backgroundPosition: "32% 22%",
};

const Albums = () => {
  const matches = useMediaQuery("(min-width:1200px)");
  const [searchParams, setSearchParams] = useSearchParams();
  const { openModal } = useModals();
  const queryClient = useQueryClient();

  useScrollRestoration();

  const yearParam = searchParams.get("year");
  const selectedYear = yearParam ? new Date(Number(yearParam), 0, 1) : null;
  const yearValue = selectedYear ? selectedYear.getFullYear() : undefined;
  const queryKey = ["albums", yearValue ?? "all"];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = null }) => {
      const res = await getAlbums(pageParam ? [pageParam] : [], yearValue);
      return res.data || [];
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length === 0 || lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return lastPage.at(-1);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const albums = data ? data.pages.flat() : [];
  const end = !hasNextPage;

  const handleYearChange = (newYear) => {
    if (newYear) {
      setSearchParams({ year: String(newYear.getFullYear()) });
    } else {
      setSearchParams({});
    }
  };

  const refreshAlbums = () => {
    sessionStorage.removeItem("albums");
    queryClient.invalidateQueries({ queryKey: ["albums"] });
  };

  const scrollRef = useRef();

  useEffect(() => {
    let timer;
    if (scrollRef.current && hasNextPage && !isFetchingNextPage && albums.length >= PAGE_SIZE) {
      timer = setTimeout(() => {
        try {
          const contentHeight = scrollRef.current.clientHeight;
          const screenHeight = window.innerHeight - 500;

          if (contentHeight > 100 && contentHeight < screenHeight) {
            fetchNextPage();
          }
        } catch {}
      }, 500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [albums.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
              color: "white",
            }}
          >
            교회사진
          </Typography>
          <ButtonYearPicker
            sx={{ mt: 2 }}
            value={selectedYear}
            minDate={MIN_ALBUM_DATE}
            maxDate={MAX_ALBUM_DATE}
            onChange={handleYearChange}
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
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  선택하신 연도에는 등록된 사진 앨범이 없습니다.
                </Typography>
              </Stack>
            )
          ) : (
            <InfiniteScroll
              dataLength={albums.length}
              next={fetchNextPage}
              hasMore={Boolean(hasNextPage)}
              loader={
                <Stack
                  sx={{
                    alignItems: "center",
                    py: 2,
                  }}
                >
                  <CircularProgress size={32} />
                </Stack>
              }
              scrollThreshold={0.8}
              style={{ overflowY: "hidden" }}
            >
              <ImageList ref={scrollRef} cols={matches ? 4 : 3} gap={3}>
                <MemoizedMeditationONComp
                  posts={albums}
                  cols={matches ? 4 : 3}
                />
              </ImageList>
            </InfiniteScroll>
          )}
        </Box>
      </div>
      <AdminComponent>
        <Fab
          variant="primary"
          aria-label="앨범 업로드"
          style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
          onClick={async () => {
            const { default: AlbumUploadModal } = await import(
              "./AlbumUploadModal"
            );
            openModal(AlbumUploadModal, { onSuccess: refreshAlbums });
          }}
        >
          <AddIcon />
        </Fab>
      </AdminComponent>
      {end && <Footer />}
    </>
  );
};

export default Albums;
