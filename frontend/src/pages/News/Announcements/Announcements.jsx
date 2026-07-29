import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { announcementsQuery } from "../../../route/AnnouncementsLoader";

import { CircularProgress, Fab, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import BoardPagination from "../../../components/News/Announcement/BoardPagination";
import useModals from "../../../util/useModal";
import AdminComponent from "../../../common/AdminComponent";

import ForumPostBoard from "../../../common/Forum/ForumPostBoard";

const titleBackground = {
  backgroundImage: 'url("/img/News/Announcements/Announcements.webp")',
};

const Announcements = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  const { data, isLoading, isError, refetch } = useQuery(announcementsQuery(page));

  const { openModal } = useModals();

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
            <CircularProgress />
          ) : isError ? (
            <p>Error loading!</p>
          ) : data.announcements.length === 0 ? (
            <Typography align="center">
              게시물이 존재하지 않습니다.
            </Typography>
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
                dateFirst
              />
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
          style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
          onClick={async () => {
            const { default: AnnouncementPostModalComponent } = await import(
              "../../../components/News/Announcement/AnnouncementPostModal" // Use the correct path
            );

            openModal(AnnouncementPostModalComponent, {
              revalidator: refetch,
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
