import { Box, Typography, Divider } from "@mui/material";

const GardenAttendanceSummaryBar = ({
  total,
  attendeesCount,
  absenteesCount,
  rate,
}) => {
  return (
    <Box
      sx={{
        mt: 2,
        p: 1.5,
        borderRadius: "12px",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="caption"
          sx={{ color: "#64748b", fontWeight: 600, display: "block" }}
        >
          총원
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 800, color: "#1e293b" }}>
          {total}명
        </Typography>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="caption"
          sx={{ color: "#16a34a", fontWeight: 600, display: "block" }}
        >
          출석
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 800, color: "#16a34a" }}>
          {attendeesCount}명
        </Typography>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="caption"
          sx={{ color: "#dc2626", fontWeight: 600, display: "block" }}
        >
          결석
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 800, color: "#dc2626" }}>
          {absenteesCount}명
        </Typography>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ textAlign: "center", minWidth: 70 }}>
        <Typography
          variant="caption"
          sx={{ color: "#ea580c", fontWeight: 600, display: "block" }}
        >
          출석률
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 800, color: "#ea580c" }}>
          {rate}%
        </Typography>
      </Box>
    </Box>
  );
};

export default GardenAttendanceSummaryBar;
