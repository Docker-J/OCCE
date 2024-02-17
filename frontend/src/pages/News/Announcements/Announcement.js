import {
  Divider,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
} from "@mui/material";
import { useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

import axios from "axios";
import useSnackbar from "../../../util/useSnackbar";
import { useState } from "react";
import FullScreenLoading from "../../../common/FullScreenLoading";

import "../../NextGen/NextGen.css";
import "./content-styles.css";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.30)), url("/img/News/Announcements/Announcements.jpg")',
};

const Announcement = () => {
  let revalidator = useRevalidator();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { id, title, body, timestamp, pin } = useLoaderData();

  const [isLoading, setIsLoading] = useState(false);

  const pinAnnouncement = async () => {
    setIsLoading(true);

    try {
      await axios.put("/api/Announcements/pinAnnouncement", {
        id: id,
        pin: pin ? 0 : 1,
      });

      revalidator.revalidate();
      openSnackbar(
        "success",
        `The announcement is successfully ${pin ? "unpinned" : "pinned"}`
      );
    } catch (error) {
      openSnackbar(
        "error",
        "Error Occured. Please contact to the administrator."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAnnouncement = async () => {
    setIsLoading(true);

    try {
      await axios.delete(`/api/Announcements/deleteAnnouncement?id=${id}`);

      openSnackbar("success", "The announcement is successfully deleted!");
      navigate("/announcements");
    } catch (error) {
      openSnackbar(
        "error",
        "Error Occured. Please contact to the administrator."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const actions = [
    { icon: <EditNoteIcon />, name: "Edit" },
    {
      icon: pin ? <PushPinIcon /> : <PushPinOutlinedIcon />,
      name: pin ? "Unpin" : "Pin",
      onClick: pinAnnouncement,
    },
    { icon: <DeleteIcon />, name: "Delete", onClick: deleteAnnouncement },
  ];

  return (
    <>
      {isLoading && <FullScreenLoading />}

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
          style={{ display: "flex", flexDirection: "column" }}
        >
          {pin === 1 && <PushPinIcon sx={{ opacity: pin ? 1 : 0, mr: 2 }} />}

          <h1 style={{ textAlign: "left", wordBreak: "break-all" }}>{title}</h1>

          <p style={{ textAlign: "right" }}>
            {format(new Date(timestamp), "yyyy/MM/dd")}
          </p>

          <Divider />

          <div
            className="ck-content"
            dangerouslySetInnerHTML={{
              __html: body,
            }}
            style={{ wordBreak: "break-word" }}
          />

          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.onClick}
              />
            ))}
          </SpeedDial>
        </div>
      </div>
    </>
  );
};

export default Announcement;
