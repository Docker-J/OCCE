import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";

import { useGardenAttendanceDetail } from "./hooks/useGardenAttendanceDetail";
import GardenAttendanceSummaryBar from "./components/GardenAttendanceSummaryBar";
import GardenAttendanceReportedView from "./components/GardenAttendanceReportedView";
import GardenAttendanceUnreportedView from "./components/GardenAttendanceUnreportedView";
import "../../common/CustomDialog.css";

const GardenAttendanceDetailModal = ({ open, onClose, gardenName, date }) => {
  const {
    loading,
    error,
    detail,
    attendees,
    absentees,
    absenceReasons,
    allMembers,
    reported,
    total,
    rate,
  } = useGardenAttendanceDetail(open, gardenName, date);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Header */}
      <DialogTitle sx={{ pb: 1.5, pt: 2.5, px: { xs: 2.5, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
              {gardenName} 출석 상세
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontWeight: 600, mt: 0.3 }}
            >
              {date} 주일
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {detail && (
              <Chip
                icon={
                  reported ? (
                    <CheckCircleIcon
                      sx={{
                        fontSize: "1rem !important",
                        color: "#16a34a !important",
                      }}
                    />
                  ) : (
                    <ErrorOutlineIcon
                      sx={{
                        fontSize: "1rem !important",
                        color: "#ea580c !important",
                      }}
                    />
                  )
                }
                label={reported ? "보고 완료" : "미보고"}
                sx={{
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  backgroundColor: reported
                    ? "rgba(22, 163, 74, 0.1)"
                    : "rgba(234, 88, 12, 0.1)",
                  color: reported ? "#16a34a" : "#ea580c",
                  border: reported
                    ? "1px solid rgba(22, 163, 74, 0.25)"
                    : "1px solid rgba(234, 88, 12, 0.25)",
                }}
              />
            )}
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: "#94a3b8",
                "&:hover": {
                  color: "#334155",
                  backgroundColor: "rgba(0, 0, 0, 0.06)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Summary Mini Bar */}
        {detail && reported && (
          <GardenAttendanceSummaryBar
            total={total}
            attendeesCount={attendees.length}
            absenteesCount={absentees.length}
            rate={rate}
          />
        )}
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2.5, px: { xs: 2.5, sm: 3 } }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 6,
            }}
          >
            <CircularProgress sx={{ color: "#ea580c", mb: 2 }} />
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontWeight: 500 }}
            >
              정원 출석 상세 데이터를 불러오고 있습니다...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !reported ? (
          <GardenAttendanceUnreportedView allMembers={allMembers} />
        ) : (
          <GardenAttendanceReportedView
            attendees={attendees}
            absentees={absentees}
            absenceReasons={absenceReasons}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, px: { xs: 2.5, sm: 3 }, pt: 1.5 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#475569",
            "&:hover": { backgroundColor: "#334155" },
            borderRadius: "10px",
            px: 3,
            fontWeight: 700,
          }}
        >
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GardenAttendanceDetailModal;
