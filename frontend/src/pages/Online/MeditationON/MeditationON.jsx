import { useEffect, useLayoutEffect, useRef } from "react";

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

import { MemoizedMeditationONComp } from "../../../components/Online/MeditationON/MeditationONImageListItem";
import InfiniteScroll from "react-infinite-scroll-component";

import AdminComponent from "../../../common/AdminComponent";
import Footer from "../../../header/Footer";
import useModals from "../../../util/useModal";
import { getPosts } from "../../../api/meditationon";
import { useNavigationType, useLocation } from "react-router";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 12;
const titleBackground = {
  backgroundImage: 'url("/img/Online/MeditationON.webp")',
};

const MeditationON = () => {
  const matches = useMediaQuery("(min-width:1200px)");
  const navType = useNavigationType();
  const location = useLocation();
  const { openModal } = useModals();
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["meditation-on"],
    queryFn: async ({ pageParam = null }) => {
      const res = await getPosts(pageParam ? [pageParam] : []);
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

  const posts = data ? data.pages.flat() : [];
  const end = !hasNextPage;

  const refreshPosts = () => {
    sessionStorage.removeItem("posts");
    queryClient.invalidateQueries({ queryKey: ["meditation-on"] });
  };

  // Track and persist scroll position for POP navigation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        sessionStorage.setItem(`scroll_pos_${location.pathname}`, String(window.scrollY));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  // Restore scroll position when returning from meditation post details (POP navigation)
  useLayoutEffect(() => {
    if (navType === "POP") {
      const savedPos = sessionStorage.getItem(`scroll_pos_${location.pathname}`);
      if (savedPos) {
        const targetY = parseInt(savedPos, 10);
        if (!isNaN(targetY) && targetY > 0) {
          const rafId = requestAnimationFrame(() => {
            const prevBehavior = document.documentElement.style.scrollBehavior;
            document.documentElement.style.scrollBehavior = "auto";
            window.scrollTo({ top: targetY, behavior: "instant" });
            document.documentElement.scrollTop = targetY;
            document.documentElement.style.scrollBehavior = prevBehavior;
          });
          return () => cancelAnimationFrame(rafId);
        }
      }
    }
  }, [navType, location.pathname]);

  const scrollRef = useRef();

  useEffect(() => {
    let timer;
    if (scrollRef.current && hasNextPage && !isFetchingNextPage && posts.length >= PAGE_SIZE) {
      timer = setTimeout(() => {
        try {
          const contentHeight = scrollRef.current.clientHeight;
          const screenHeight = window.innerHeight - 500;

          if (contentHeight > 100 && contentHeight < screenHeight) {
            fetchNextPage();
          }
        } catch (error) {}
      }, 500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [posts.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <title>묵상 ON - OCCE</title>
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
            묵상 ON
          </Typography>
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
          {posts.length <= 0 ? (
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
                  등록된 게시물이 없습니다
                </Typography>
                <Typography variant="body2" sx={{ color: "text.disabled" }}>
                  현재 등록된 묵상 ON 게시물이 없습니다.
                </Typography>
              </Stack>
            )
          ) : (
            <InfiniteScroll
              dataLength={posts.length}
              next={fetchNextPage}
              hasMore={Boolean(hasNextPage)}
              loader={
                <Stack sx={{ alignItems: "center", py: 2 }}>
                  <CircularProgress size={32} />
                </Stack>
              }
              scrollThreshold={0.8}
              style={{ overflowY: "hidden" }}
            >
              <ImageList ref={scrollRef} cols={matches ? 4 : 3} gap={3}>
                <MemoizedMeditationONComp posts={posts} />
              </ImageList>
            </InfiniteScroll>
          )}
        </Box>
      </div>
      <AdminComponent>
        <Fab
          variant="primary"
          aria-label="묵상ON 업로드"
          style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
          onClick={async () => {
            const { default: MeditationONModalComponent } = await import(
              "../../../components/Online/MeditationON/MeditationONModal"
            );
            openModal(MeditationONModalComponent, {
              onSuccess: refreshPosts,
            });
          }}
        >
          <AddIcon />
        </Fab>
      </AdminComponent>
      {end && <Footer />}
    </>
  );
};

export default MeditationON;
