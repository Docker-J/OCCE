import {
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EditNoteIcon from "@mui/icons-material/EditNote";

const ReportSubmitButton = ({
  submitting = false,
  checkingReport = false,
  disabled = false,
  isReported = false,
  onClick,
  themeColor = "#dc2626",
  hoverColor = "#b91c1c",
  shadowColor = "rgba(220, 38, 38, 0.3)",
  submitText = "보고서 제출하기",
  updateText = "보고서 수정(업데이트)하기",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 1,
        mb: 4,
      }}
    >
      <Button
        variant="contained"
        size="large"
        disabled={submitting || checkingReport || disabled}
        onClick={onClick}
        startIcon={
          submitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : isReported ? (
            <EditNoteIcon />
          ) : (
            <SendIcon />
          )
        }
        sx={{
          backgroundColor: isReported ? "#2563eb" : themeColor,
          "&:hover": {
            backgroundColor: isReported ? "#1d4ed8" : hoverColor,
          },
          borderRadius: "28px",
          px: 6,
          py: 1.8,
          fontWeight: 700,
          fontSize: "1.05em",
          boxShadow: isReported
            ? "0 4px 14px 0 rgba(37, 99, 235, 0.3)"
            : `0 4px 14px 0 ${shadowColor}`,
        }}
      >
        {submitting ? "제출 중..." : isReported ? updateText : submitText}
      </Button>
    </Box>
  );
};

export default ReportSubmitButton;
