import { useState } from "react";
import { Container, Typography } from "@mui/material";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";

import useSnackbar from "../../../util/useSnackbar";
import FullScreenLoading from "../../../common/FullScreenLoading";
import useModals from "../../../util/useModal";
import {
  deleteAnnouncement,
  pinAnnouncement,
} from "../../../api/announcements";
import {
  usePostFontSize,
  PostDetailCard,
  PostAdminActions,
  BackToListFab,
} from "../../../components/News/common";
import "./content-styles.css";

const titleBackground = {
  backgroundImage: 'url("/img/News/Announcements/Announcements.webp")',
};

const Announcement = () => {
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();
  const { id, title, body, timestamp, pin } = useLoaderData();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const { fontSize, increaseFont, decreaseFont, resetFont } = usePostFontSize();

  const onPin = async () => {
    setIsLoading(true);
    try {
      await pinAnnouncement(id, pin);
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      revalidator.revalidate();
      openSnackbar(
        "success",
        `The announcement is successfully ${pin ? "unpinned" : "pinned"}`,
      );
    } catch {
      openSnackbar(
        "error",
        "Error Occured. Please contact to the administrator.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await deleteAnnouncement(id);
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      openSnackbar("success", "The announcement is successfully deleted!");
      navigate("/announcements");
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
        const { default: AnnouncementPostModalComponent } = await import(
          "../../../components/News/Announcement/AnnouncementPostModal"
        );
        openModal(AnnouncementPostModalComponent, {
          revalidator: revalidator.revalidate,
          id,
          origTitle: title,
          origBody: body,
        });
      },
    },
    {
      icon: pin ? <PushPinIcon /> : <PushPinOutlinedIcon />,
      name: pin ? "Unpin" : "Pin",
      onClick: onPin,
    },
    {
      icon: <DeleteIcon />,
      name: "Delete",
      onClick: () => setDeleteConfirmDialog(true),
    },
  ];

  return (
    <>
      <title>{`${title} - OCCE`}</title>
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
            공지사항
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
            isPinned={pin === 1}
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
              deleteBody={`"${title}" 공지사항이 삭제됩니다.`}
            />
          </PostDetailCard>
        </Container>

        <BackToListFab onClick={() => navigate("/announcements")} />
      </div>
    </>
  );
};

export default Announcement;
