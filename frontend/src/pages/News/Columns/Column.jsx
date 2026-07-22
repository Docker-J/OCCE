import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
} from "@mui/material";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { format } from "date-fns";

import useSnackbar from "../../../util/useSnackbar";
import { useState } from "react";
import FullScreenLoading from "../../../common/FullScreenLoading";

import AdminComponent from "../../../common/AdminComponent";
import useModals from "../../../util/useModal";

import { deleteColumn } from "../../../api/columns";
import CustomConfirmDialog from "../../../common/CustomConfirmDialog";

import "./content-styles.css";

const titleBackground = {
  backgroundImage: 'url("/img/News/Columns/Columns.webp")',
  backgroundPosition: "25% 65%",
};

const Column = () => {
  let revalidator = useRevalidator();
  const navigate = useNavigate();
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();
  const { id, title, body, timestamp } = useLoaderData();

  const [isLoading, setIsLoading] = useState(false);

  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    openSnackbar("success", "링크가 클립보드에 복사되었습니다!");
  };

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
          id: id,
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
      <div className="container-wrapper" style={{ backgroundColor: "#fcfbf9", minHeight: "60vh" }}>
        <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              boxShadow: "0 10px 40px rgba(150, 75, 0, 0.05), 0 2px 10px rgba(0, 0, 0, 0.02)",
              border: "1px solid rgba(150, 75, 0, 0.1)",
              p: { xs: 2.5, sm: 4, md: 5 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Top Navigation Bar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/columns")}
                sx={{
                  color: "#964b00",
                  fontWeight: 600,
                  fontSize: "14px",
                  borderRadius: "12px",
                  px: 2,
                  py: 0.75,
                  backgroundColor: "rgba(150, 75, 0, 0.06)",
                  "&:hover": {
                    backgroundColor: "rgba(150, 75, 0, 0.12)",
                  },
                }}
              >
                목록으로
              </Button>
            </Box>

            {/* Post Title */}
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                color: "#2b2b2b",
                fontSize: { xs: "22px", sm: "28px", md: "32px" },
                lineHeight: 1.35,
                mb: 2.5,
                wordBreak: "break-word",
              }}
            >
              {title}
            </Typography>

            {/* Metadata Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#757575",
                fontSize: "14px",
                pb: 2.5,
                mb: 3.5,
                borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: "#964b00" }} />
                <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                  {format(new Date(timestamp), "yyyy년 M월 d일")}
                </Typography>
              </Box>

              <IconButton
                onClick={handleCopyLink}
                size="small"
                title="링크 복사"
                sx={{
                  color: "#666",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  p: 0.75,
                  "&:hover": { color: "#964b00", borderColor: "#964b00" },
                }}
              >
                <ContentCopyIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            {/* CKEditor Body Content */}
            <div
              className="ck-content"
              dangerouslySetInnerHTML={{
                __html: body,
              }}
              style={{
                wordBreak: "break-word",
                fontSize: "17px",
                lineHeight: 1.85,
                color: "#333333",
              }}
            />

            {/* Bottom Actions */}
            <Divider sx={{ my: 4 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/columns")}
                variant="outlined"
                sx={{
                  borderColor: "rgba(150, 75, 0, 0.3)",
                  color: "#964b00",
                  fontWeight: 600,
                  borderRadius: "12px",
                  px: 3,
                  "&:hover": {
                    borderColor: "#964b00",
                    backgroundColor: "rgba(150, 75, 0, 0.04)",
                  },
                }}
              >
                목록으로 돌아가기
              </Button>
            </Box>

            <AdminComponent>
              <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: "fixed", bottom: 24, right: 24 }}
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

              <CustomConfirmDialog
                title="삭제하시겠습니까?"
                body={`${title} 목회칼럼이 삭제됩니다`}
                isOpen={deleteConfirmDialog}
                onClose={() => setDeleteConfirmDialog(false)}
                onConfirm={onDelete}
              />
            </AdminComponent>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default Column;
