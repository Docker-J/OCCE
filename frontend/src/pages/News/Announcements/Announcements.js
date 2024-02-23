import {
  Await,
  useLoaderData,
  useNavigation,
  useRevalidator,
  useSearchParams,
} from "react-router-dom";

import { CircularProgress, Fab, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import "./Announcements.css";
import AnnouncementPostModal from "../../../components/News/Announcement/AnnouncementPostModal";
import BoardTable from "../../../components/News/Announcement/BoardTable";

import "../../NextGen/NextGen.css";
import BoardPagination from "../../../components/News/Announcement/BoardPagination";
import useModals from "../../../util/useModal";
import AdminComponent from "../../../common/AdminComponent";
import { Suspense } from "react";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.30)),  url("/img/News/Announcements/Announcements.webp")',
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
        <div className="container" style={{ maxWidth: "1200px" }}>
          {state === "loading" && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </div>
          )}

          <Suspense
            fallback={
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </div>
            }
          >
            <Await
              resolve={data.announcementsData}
              errorElement={<p>Error loading package location!</p>}
            >
              {({ data }) => {
                return data.announcements.length === 0 ? (
                  <Typography align="center">
                    게시물이 존재하지 않습니다.
                  </Typography>
                ) : (
                  <>
                    <BoardTable announcements={data.announcements} />
                    <BoardPagination
                      pages={Math.ceil(data.count / 10)}
                      currentPage={page}
                    />
                  </>
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>

      <AdminComponent>
        <Fab
          style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
          onClick={() =>
            openModal(AnnouncementPostModal, {
              revalidator: revalidator.revalidate,
              origTitle: "",
              origBody: "",
            })
          }
        >
          <AddIcon />
        </Fab>
      </AdminComponent>
    </>
  );
};

export default Announcements;
