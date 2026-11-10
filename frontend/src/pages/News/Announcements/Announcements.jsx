import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Fab, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import ForumPostBoard from "../../../common/Forum/ForumPostBoard";
import BoardPagination from "../../../components/News/Announcement/BoardPagination";

import useModals from "../../../util/useModal";
import useScrollRestoration from "../../../util/useScrollRestoration";
import AdminComponent from "../../../common/AdminComponent";
import ForumPostBoardSkeleton from "../../../common/Forum/ForumPostBoardSkeleton";
import OCCEFallbackCard from "../../../common/OCCEFallbackCard";
import { getAnnouncements } from "../../../api/announcements";

const titleBackground = {
  backgroundImage: 'url("/img/News/Announcements/Announcements.webp")',
};

const Announcements = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  const { openModal } = useModals();
  const queryClient = useQueryClient();

  useScrollRestoration();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["announcements", page],
    queryFn: () => getAnnouncements(page),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Prefetch next page in background for instant pagination
  useEffect(() => {
    const nextPage = parseInt(page, 10) + 1;
    if (data?.count && nextPage <= Math.ceil(data.count / 10)) {
      queryClient.prefetchQuery({
        queryKey: ["announcements", String(nextPage)],
        queryFn: () => getAnnouncements(String(nextPage)),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [page, data?.count, queryClient]);

  return (
    <>
      <title>공지사항 - OCCE</title>
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
            공지사항
          </Typography>
        </div>
      </div>
      <div
        className="container-wrapper"
        style={{
          backgroundColor: "#fcfbf9",
          minHeight: "60vh",
          paddingTop: "20px",
          paddingBottom: "40px",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {isLoading ? (
            <ForumPostBoardSkeleton />
          ) : isError ? (
            <OCCEFallbackCard
              title="공지사항을 불러오지 못했습니다"
              description="일시적인 네트워크 오류이거나 서버에 연결할 수 없습니다."
              onReset={refetch}
            />
          ) : !data || data.announcements.length === 0 ? (
            <Typography align="center">게시물이 존재하지 않습니다.</Typography>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <ForumPostBoard announcements={data.announcements} />
              <BoardPagination
                pages={Math.ceil(data.count / 10)}
                currentPage={page}
              />
            </div>
          )}
        </div>
      </div>
      <AdminComponent>
        <Fab
          aria-label="공지사항 작성"
          style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
          onClick={async () => {
            const { default: AnnouncementPostModalComponent } = await import(
              "../../../components/News/Announcement/AnnouncementPostModal"
            );

            openModal(AnnouncementPostModalComponent, {
              origTitle: "",
              origBody: "",
            });
          }}
        >
          <AddIcon />
        </Fab>
      </AdminComponent>
    </>
  );
};

export default Announcements;
