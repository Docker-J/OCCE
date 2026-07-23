import {
  Box,
  Button,
  Container,
  Divider,
  Fab,
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
import { format } from "date-fns";

import useSnackbar from "../../../util/useSnackbar";
import { useState, useEffect } from "react";
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
  const [fontSize, setFontSize] = useState(17);

  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);

  const handleIncreaseFont = () => setFontSize((prev) => Math.min(prev + 2, 25));
  const handleDecreaseFont = () => setFontSize((prev) => Math.max(prev - 2, 13));
  const handleResetFont = () => setFontSize(17);

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
              boxShadow: "0 10px 40px rgba(255, 107, 0, 0.05), 0 2px 10px rgba(0, 0, 0, 0.02)",
              border: "1px solid rgba(255, 107, 0, 0.1)",
              p: { xs: 2.5, sm: 4, md: 5 },
              display: "flex",
              flexDirection: "column",
            }}
          >
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
                flexWrap: "wrap",
                gap: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: "#FF6B00" }} />
                <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                  {format(new Date(timestamp), "yyyy년 M월 d일")}
                </Typography>
              </Box>

              {/* Font Size Adjuster Controls */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                  borderRadius: "20px",
                  px: 1.5,
                  py: 0.5,
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#777", fontWeight: 600, mr: 0.5, fontSize: "12px" }}
                >
                  글꼴 크기
                </Typography>
                <Button
                  size="small"
                  onClick={handleDecreaseFont}
                  disabled={fontSize <= 13}
                  title="글자 줄이기"
                  sx={{
                    minWidth: "28px",
                    height: "28px",
                    p: 0,
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#555",
                    borderRadius: "6px",
                  }}
                >
                  가-
                </Button>
                <Typography
                  variant="caption"
                  onClick={handleResetFont}
                  title="기본 크기로 초기화"
                  sx={{
                    color: "rgba(0, 0, 0, 0.2)",
                    fontWeight: 400,
                    cursor: "pointer",
                    px: 0.75,
                    fontSize: "13px",
                    userSelect: "none",
                  }}
                >
                  |
                </Typography>
                <Button
                  size="small"
                  onClick={handleIncreaseFont}
                  disabled={fontSize >= 25}
                  title="글자 키우기"
                  sx={{
                    minWidth: "28px",
                    height: "28px",
                    p: 0,
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#555",
                    borderRadius: "6px",
                  }}
                >
                  가+
                </Button>
              </Box>
            </Box>

            {/* CKEditor Body Content */}
            <div
              className="ck-content"
              dangerouslySetInnerHTML={{
                __html: body,
              }}
              style={{
                wordBreak: "break-word",
                fontSize: `${fontSize}px`,
                lineHeight: 1.85,
                color: "#333333",
                transition: "font-size 0.2s ease",
              }}
            />

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

        {/* Floating Back to List Button */}
        <Fab
          variant="extended"
          onClick={() => navigate("/columns")}
          sx={{
            position: "fixed",
            bottom: { xs: 24, sm: 32 },
            left: { xs: 20, sm: 32 },
            zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(16px)",
            color: "#FF6B00",
            fontWeight: 700,
            fontSize: "14.5px",
            px: 2.5,
            py: 1,
            borderRadius: "30px",
            border: "1px solid rgba(255, 107, 0, 0.25)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(255, 107, 0, 0.15)",
            textTransform: "none",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              backgroundColor: "#FF6B00",
              color: "#ffffff",
              transform: "translateY(-3px)",
              boxShadow: "0 12px 36px rgba(255, 107, 0, 0.35)",
              "& .MuiSvgIcon-root": {
                transform: "translateX(-4px)",
              },
            },
            "& .MuiSvgIcon-root": {
              transition: "transform 0.2s ease",
              mr: 0.8,
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
          목록으로
        </Fab>
      </div>
    </>
  );
};

export default Column;
