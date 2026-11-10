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
import { getColumns } from "../../../api/columns";

const titleBackground = {
  backgroundImage: 'url("/img/News/Columns/Columns.webp")',
  backgroundPosition: "25% 65%",
};

const Columns = () => {
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
    queryKey: ["columns", page],
    queryFn: () => getColumns(page),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Prefetch next page in background for instant pagination
  useEffect(() => {
    const nextPage = parseInt(page, 10) + 1;
    if (data?.count && nextPage <= Math.ceil(data.count / 10)) {
      queryClient.prefetchQuery({
        queryKey: ["columns", String(nextPage)],
        queryFn: () => getColumns(String(nextPage)),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [page, data?.count, queryClient]);

  return (
    <>
      <title>목회칼럼 - OCCE</title>
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
            목회칼럼
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
              title="목회칼럼을 불러오지 못했습니다"
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
              <ForumPostBoard
                announcements={data.announcements}
                themeColor="#1a365d"
                themeBg="rgba(26, 54, 93, 0.08)"
                themeHover="rgba(26, 54, 93, 0.15)"
              />
              <BoardPagination
                pages={Math.ceil(data.count / 10)}
                currentPage={page}
                themeColor="#1a365d"
                themeBg="rgba(26, 54, 93, 0.08)"
              />
            </div>
          )}
        </div>
      </div>
      <AdminComponent>
        <Fab
          aria-label="목회칼럼 작성"
          style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
          onClick={async () => {
            const { default: ColumnPostModalComponent } = await import(
              "../../../components/News/Columns/ColumnPostModal"
            );

            openModal(ColumnPostModalComponent, {
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

export default Columns;
