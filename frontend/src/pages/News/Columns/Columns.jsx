import {
  Await,
  useLoaderData,
  useNavigation,
  useRevalidator,
  useSearchParams,
} from "react-router";

import { CircularProgress, Fab, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import ColumnPostModal from "../../../components/News/Columns/ColumnPostModal";
import ForumPostBoard from "../../../common/Forum/ForumPostBoard";
import BoardPagination from "../../../components/News/Announcement/BoardPagination";

import useModals from "../../../util/useModal";
import AdminComponent from "../../../common/AdminComponent";
import { Suspense } from "react";
import FullScreenLoading from "../../../common/FullScreenLoading";

const titleBackground = {
  backgroundImage: 'url("/img/News/Columns/Columns.webp")',
  backgroundPosition: "25% 65%",
};

const Columns = () => {
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
            목회칼럼
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
          {state === "loading" && <FullScreenLoading />}

          <Suspense
            fallback={
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </div>
            }
          >
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
                      width: "100%",
                      maxWidth: "1000px",
                    }}
                  >
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
          onClick={() =>
            openModal(ColumnPostModal, {
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

export default Columns;
