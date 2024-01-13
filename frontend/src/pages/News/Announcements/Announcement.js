import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Typography,
} from "@mui/material";
import { useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

import "../../NextGen/NextGen.css";
import axios from "axios";
import useSnackbar from "../../../util/useSnackbar";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.30)), url("/img/Announcements.jpg")',
};

const Announcement = () => {
  let revalidator = useRevalidator();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { id, title, body, timestamp, pin } = useLoaderData();

  const pinAnnouncement = async () => {
    try {
      const result = await axios.put("/api/Announcements/pinAnnouncement", {
        id: id,
        pin: pin ? 0 : 1,
      });

      revalidator.revalidate();
      openSnackbar("success", "The announcement is successfully pinned!");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAnnouncement = async () => {
    try {
      const result = await axios.delete(
        `/api/Announcements/deleteAnnouncement?id=${id}`
      );

      openSnackbar("success", "The announcement is successfully deleted!");
      navigate("/announcements");
    } catch (error) {
      console.log(error);
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
          <h1 style={{ textAlign: "left", wordWrap: "break-word" }}>
            <Stack direction="row" alignItems="center">
              <PushPinIcon sx={{ opacity: pin ? 1 : 0, mr: 2 }} />
              {title}
            </Stack>
          </h1>

          <p style={{ textAlign: "right" }}>
            {format(new Date(timestamp), "yyyy/MM/dd")}
          </p>

          <hr />

          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: body,
            }}
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
