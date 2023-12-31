import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
} from "@mui/material";
import { useLoaderData } from "react-router-dom";
import PushPinIcon from "@mui/icons-material/PushPin";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

import "../../NextGen/NextGen.css";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.30)), url("/img/Announcements.jpg")',
};

const actions = [
  { icon: <EditNoteIcon />, name: "Edit" },
  { icon: <PushPinIcon />, name: "Pin" },
  { icon: <DeleteIcon />, name: "Delete" },
];

const Announcement = () => {
  const { title, body, timestamp, pin } = useLoaderData();

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "3em",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "1500px", width: "100%", textAlign: "left" }}>
          {pin && <PushPinIcon />}

          <h1 style={{ textAlign: "left", wordWrap: "break-word" }}>{title}</h1>

          <p style={{ textAlign: "right" }}>
            {format(new Date(timestamp), "yyyy/MM/dd")}
          </p>

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
              />
            ))}
          </SpeedDial>
        </div>
      </div>
    </>
  );
};

export default Announcement;
