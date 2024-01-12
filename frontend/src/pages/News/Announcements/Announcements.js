import { useState } from "react";
import { useLoaderData } from "react-router-dom";

import { Fab, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import "./Announcements.css";
import AnnouncementPostModal from "../../../components/News/Announcement/AnnouncementPostModal";
import BoardTable from "../../../components/News/Announcement/BoardTable";

import "../../NextGen/NextGen.css";
import BoardPagination from "../../../components/News/Announcement/BoardPagination";
import useModals from "../../../util/useModal";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.30)), url("/img/Announcements.jpg")',
};

const Announcements = () => {
  const { count, announcements } = useLoaderData();
  const pages = Math.ceil(count / 10);

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
        <div className="container">
          <BoardTable announcements={announcements} />
          <BoardPagination pages={pages} />
        </div>
      </div>

      <Fab
        variant="primary"
        style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
        onClick={() => openModal(AnnouncementPostModal, {})}
      >
        <AddIcon />
      </Fab>
    </>
  );
};

export default Announcements;
