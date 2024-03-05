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

import { MemoizedMeditationONComp } from "../../../components/Online/MeditationON/MeditationONImageListItem";
import MeditationONModal from "../../../components/Online/MeditationON/MeditationONModal";
import InfiniteScroll from "react-infinite-scroll-component";

import "../../NextGen/NextGen.css";
import AdminComponent from "../../../common/AdminComponent";
import Footer from "../../../header/Footer";
import useModals from "../../../util/useModal";
import { getPosts } from "../../../api/meditationon";

const PAGE_SIZE = 12;
const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/img/Online/MeditationON.webp")',
};

const MeditationON = () => {
  const matches = useMediaQuery("(min-width:1200px)");

  const { openModal } = useModals();

  const [posts, setPosts] = useState([]);
  const [end, setEnd] = useState(false);
  const [restored, setRestored] = useState(null);

  const onLoad = async () => {
    console.log("test getPosts");

    const result = await getPosts(posts);

    if (result.data.length > 0) {
      setPosts((prev) => [...prev, ...result.data]);
    } else {
      setEnd(true);
    }
  };

  useEffect(() => {
    if (posts.length % PAGE_SIZE !== 0) {
      setEnd(true);
    }
  }, [posts]);

  useEffect(() => {
    window.onpopstate = () => {
      setRestored(true);
      console.log("test restore");
      setPosts(JSON.parse(sessionStorage.getItem("posts")));
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
      sessionStorage.setItem("posts", JSON.stringify(posts));
    };
  });

  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current && !end && posts.length >= 12) {
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
  }, [posts]);

  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            묵상 ON
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <Box
          className="container"
          // style={{
          //   padding: "0em 0.2em",
          // }}
          sx={{
            px: { xs: "0 !important", md: "1.5em !important" },
            py: "0 !important",
          }}
        >
          {posts.length <= 0 ? (
            <Stack alignItems="center">
              <CircularProgress />
            </Stack>
          ) : (
            <InfiniteScroll
              dataLength={posts.length}
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
                  <MemoizedMeditationONComp posts={posts} />
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
          onClick={() => openModal(MeditationONModal, {})}
        >
          <AddIcon />
        </Fab>
      </AdminComponent>

      {end && <Footer />}
    </>
  );
};

export default MeditationON;
