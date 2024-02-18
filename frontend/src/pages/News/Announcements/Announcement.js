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

import useSnackbar from "../../../util/useSnackbar";
import { useState } from "react";
import FullScreenLoading from "../../../common/FullScreenLoading";

import "../../NextGen/NextGen.css";
import "./content-styles.css";
import AdminComponent from "../../../common/AdminComponent";
import useModals from "../../../util/useModal";
import AnnouncementPostModal from "../../../components/News/Announcement/AnnouncementPostModal";
import {
  deleteAnnouncement,
  pinAnnouncement,
} from "../../../api/announcements";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.30)), url("/img/News/Announcements/Announcements.jpg")',
};

const Announcement = () => {
  let revalidator = useRevalidator();
  const navigate = useNavigate();
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();
  const { id, title, body, timestamp, pin } = useLoaderData();

  const [isLoading, setIsLoading] = useState(false);

  const onPin = async () => {
    setIsLoading(true);

    try {
      await pinAnnouncement(id, pin);

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

  const onDelete = async () => {
    setIsLoading(true);

    try {
      await deleteAnnouncement(id);

      openSnackbar("success", "The announcement is successfully deleted!");
      navigate("/announcements");
    } catch {
      openSnackbar(
        "error",
        "Error Occured. Please contact to the administrator."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const actions = [
    {
      icon: <EditNoteIcon />,
      name: "Edit",
      onClick: () =>
        openModal(AnnouncementPostModal, {
          revalidator: revalidator.revalidate,
          id: id,
          origTitle: title,
          origBody: body,
        }),
    },
    {
      icon: pin ? <PushPinIcon /> : <PushPinOutlinedIcon />,
      name: pin ? "Unpin" : "Pin",
      onClick: onPin,
    },
    { icon: <DeleteIcon />, name: "Delete", onClick: onDelete },
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

          <AdminComponent>
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
          </AdminComponent>
        </div>
      </div>
    </>
  );
};

export default Announcement;
