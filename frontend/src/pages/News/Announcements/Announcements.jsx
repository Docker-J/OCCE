import {
  Await,
  useLoaderData,
  useNavigation,
  useRevalidator,
  useSearchParams,
} from "react-router";

import { CircularProgress, Fab, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import BoardPagination from "../../../components/News/Announcement/BoardPagination";
import useModals from "../../../util/useModal";
import AdminComponent from "../../../common/AdminComponent";
import { Suspense } from "react";
import FullScreenLoading from "../../../common/FullScreenLoading";
import ForumPostBoard from "../../../common/Forum/ForumPostBoard";

const titleBackground = {
  backgroundImage: 'url("/img/News/Announcements/Announcements.webp")',
};

const Announcements = () => {
  let revalidator = useRevalidator();

  const data = useLoaderData();
  const { state } = useNavigation();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  const { openModal } = useModals();

  return (
    <>
      <title>공지사항 - OCCE</title>

      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            공지사항
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Suspense key={page} fallback={<CircularProgress />}>
            <Await
              resolve={data.announcementsData}
              errorElement={<p>Error loading!</p>}
            >
              {({ data }) => {
                return data.announcements.length === 0 ? (
                  <Typography align="center">
                    게시물이 존재하지 않습니다.
                  </Typography>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      width: "100%",
                      maxWidth: "1000px",
                    }}
                  >
                    {state === "loading" && <FullScreenLoading />}

                    <ForumPostBoard announcements={data.announcements} />
                    <BoardPagination
                      pages={Math.ceil(data.count / 10)}
                      currentPage={page}
                    />
                  </div>
                );
              }}
            </Await>
          </Suspense>
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
              revalidator: revalidator.revalidate,
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
