import { useState, useEffect } from "react";

import { CircularProgress, Fab, ImageList } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import axios from "axios";
import { MemoizedMeditationONComp } from "./MeditationONComp";
import MeditationONModal from "./MeditationONModal";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLoaderData } from "react-router-dom";

const PAGE_SIZE = 12;

const Photos = () => {
  const initalPosts = useLoaderData();
  const [posts, setPosts] = useState(initalPosts);
  const [end, setEnd] = useState(false);
  const [restored, setRestored] = useState(true);

  const getPosts = async () => {
    console.log("test getPosts");

    const result = await axios.get(
      `/api/MeditationON/getPosts${
        posts.length === 0 ? "" : `?lastVisible=${posts.at(-1).id}`
      }`
    );
    setPosts((prev) => [...prev, ...result.data]);
  };

  useEffect(() => {
    if (posts.length % PAGE_SIZE !== 0) {
      setEnd(true);
    }
  }, [posts]);

  // const handlePopstate = (event) => {
  //   console.log("test back");
  //   // Check if the popstate event was triggered by the back or forward button
  //   if (event.state !== null) {
  //     // Perform your desired action here
  //     // For example, you can call getPosts() here
  //     restore();
  //   }
  // };

  // function handlePopstate(event) {
  //   if (event.state !== null) {
  //     console.log("test back");
  //     restore();
  //   } else {
  //     getPosts();
  //   }
  // }

  const restore = () => {
    setRestored(true);
    console.log("test restore");
    setPosts(JSON.parse(sessionStorage.getItem("posts")));
  };

  // useEffect(() => {
  //   window.addEventListener("popstate", (event) => handlePopstate(event));

  //   if (performance.getEntriesByType("navigation")[0].type === "reload") {
  //     getPosts();
  //   }

  //   return () => {
  //     window.removeEventListener("popstate", () => handlePopstate());
  //   };
  // }, []);

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
      getPosts();
    }
  }, [restored]);

  useEffect(() => {
    return () => {
      sessionStorage.setItem("posts", JSON.stringify(posts));
    };
  });

  // useEffect(() => {
  //   if (fetcher.data && fetcher.data.length > 0) {
  //     setPosts((prevPosts) => [...prevPosts, ...fetcher.data]);
  //     searchParams.set("page", Number(searchParams.get("page")) + 1);
  //     setSearchParams(searchParams);
  //   }
  // }, [fetcher.data]);

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
        {posts.length !== 0 ? (
          <InfiniteScroll
            dataLength={posts.length}
            next={getPosts}
            hasMore={!end}
            loader={<CircularProgress />}
            scrollThreshold={0.75}
            // scrollableTarget="scrollableDiv"
            style={{ overflowY: "hidden" }}
          >
            {
              <ImageList sx={{ mx: "0.5rem" }} cols={3} gap={2.5}>
                <MemoizedMeditationONComp posts={posts} />
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
