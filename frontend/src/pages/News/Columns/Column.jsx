import { useState } from "react";
import { Container, Typography } from "@mui/material";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";

import useSnackbar from "../../../util/useSnackbar";
import FullScreenLoading from "../../../common/FullScreenLoading";
import useModals from "../../../util/useModal";
import { deleteColumn } from "../../../api/columns";
import {
  usePostFontSize,
  PostDetailCard,
  PostAdminActions,
  BackToListFab,
} from "../../../components/News/common";
import "./content-styles.css";

const titleBackground = {
  backgroundImage: 'url("/img/News/Columns/Columns.webp")',
  backgroundPosition: "25% 65%",
};

const Column = () => {
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();
  const { id, title, body, timestamp } = useLoaderData();

  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const { fontSize, increaseFont, decreaseFont, resetFont } = usePostFontSize();

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await deleteColumn(id);
      openSnackbar("success", "The column is successfully deleted!");
      navigate("/columns");
    } catch {
      openSnackbar(
        "error",
        "Error Occured. Please contact to the administrator.",
      );
    } finally {
      setIsLoading(false);
      setDeleteConfirmDialog(false);
    }
  };

  const actions = [
    {
      icon: <EditNoteIcon />,
      name: "Edit",
      onClick: async () => {
        const { default: ColumnPostModalComponent } = await import(
          "../../../components/News/Columns/ColumnPostModal"
        );
        openModal(ColumnPostModalComponent, {
          revalidator: revalidator.revalidate,
          id,
          origTitle: title,
          origBody: body,
        });
      },
    },
    {
      icon: <DeleteIcon />,
      name: "Delete",
      onClick: () => setDeleteConfirmDialog(true),
    },
  ];

  return (
    <>
      <title>{`${title} - 목회칼럼 - OCCE`}</title>
      {isLoading && <FullScreenLoading />}

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
            목회칼럼
          </Typography>
        </div>
      </div>

      <div
        className="container-wrapper"
        style={{ backgroundColor: "#fcfbf9", minHeight: "60vh" }}
      >
        <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
          <PostDetailCard
            title={title}
            body={body}
            timestamp={timestamp}
            fontSize={fontSize}
            onIncreaseFont={increaseFont}
            onDecreaseFont={decreaseFont}
            onResetFont={resetFont}
          >
            <PostAdminActions
              actions={actions}
              deleteConfirmOpen={deleteConfirmDialog}
              onCloseDeleteConfirm={() => setDeleteConfirmDialog(false)}
              onConfirmDelete={onDelete}
              deleteBody={`"${title}" 목회칼럼이 삭제됩니다.`}
            />
          </PostDetailCard>
        </Container>

        <BackToListFab onClick={() => navigate("/columns")} />
      </div>
    </>
  );
};

export default Column;
