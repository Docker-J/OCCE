import {
  Divider,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
} from "@mui/material";
import { useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

import useSnackbar from "../../../util/useSnackbar";
import { useState } from "react";
import FullScreenLoading from "../../../common/FullScreenLoading";

import AdminComponent from "../../../common/AdminComponent";
import useModals from "../../../util/useModal";

import "../../NextGen/NextGen.css";
import "./content-styles.css";
import { deleteColumn } from "../../../api/columns";
import ColumnPostModal from "./../../../components/News/Columns/ColumnPostModal";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.30)), url("/img/News/Columns/Columns.jpg")',
  backgroundPosition: "25% 65%",
};

const Column = () => {
  let revalidator = useRevalidator();
  const navigate = useNavigate();
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();
  const { id, title, body, timestamp } = useLoaderData();

  console.log(timestamp);

  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    setIsLoading(true);

    try {
      await deleteColumn(id);

      openSnackbar("success", "The column is successfully deleted!");
      navigate("/columns");
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
        openModal(ColumnPostModal, {
          revalidator: revalidator.revalidate,
          id: id,
          origTitle: title,
          origBody: body,
        }),
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
            목회칼럼
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div
          className="container"
          style={{ display: "flex", flexDirection: "column" }}
        >
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

export default Column;