import {
  Box,
  Typography,
  Alert,
  Chip,
  LinearProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ReportStatusBanner = ({
  checkingReport,
  isReported,
  color = "#dc2626",
  title = "이미 제출된 보고서가 있습니다",
  message = "기존에 제출하신 내역을 불러왔습니다. 변경이 필요한 부분만 수정한 후 다시 제출하시면 업데이트됩니다.",
}) => {
  return (
    <>
      {checkingReport && (
        <LinearProgress
          sx={{
            borderRadius: "4px",
            backgroundColor: `${color}1A`, // ~10% opacity
            "& .MuiLinearProgress-bar": {
              backgroundColor: color,
            },
            my: 1,
          }}
        />
      )}

      {isReported && (
        <Alert
          severity="success"
          icon={<CheckCircleIcon sx={{ color: "#15803d", mt: 0.5 }} />}
          sx={{
            borderRadius: "16px",
            backgroundColor: "rgba(240, 253, 244, 0.95)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            boxShadow: "0 4px 16px rgba(34, 197, 94, 0.08)",
            p: { xs: 1.5, sm: 2 },
            "& .MuiAlert-message": { width: "100%" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: "#166534" }}
            >
              {title}
            </Typography>
            <Chip
              label="기존 제출 내역 불러옴"
              size="small"
              sx={{
                backgroundColor: "#16a34a",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.75rem",
                height: "24px",
              }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "#15803d", mt: 0.5, lineHeight: 1.5 }}
          >
            {message}
          </Typography>
        </Alert>
      )}
    </>
  );
};

export default ReportStatusBanner;
