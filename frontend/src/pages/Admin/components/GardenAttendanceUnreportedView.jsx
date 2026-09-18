import { Box, Typography, Alert, Chip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const GardenAttendanceUnreportedView = ({ allMembers = [] }) => {
  return (
    <Box>
      <Alert severity="warning" sx={{ mb: 2.5 }}>
        해당 주일에는 아직 정원지기의 출석 보고가 완료되지 않았습니다.
      </Alert>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 700, color: "#475569", mb: 1.5 }}
      >
        정원 소속 성도 명단 ({allMembers.length}명)
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {allMembers.map((m) => (
          <Chip
            key={m}
            label={m}
            icon={<PersonIcon sx={{ fontSize: "1rem !important" }} />}
            sx={{
              fontWeight: 600,
              backgroundColor: "#f1f5f9",
              color: "#334155",
              borderRadius: "8px",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default GardenAttendanceUnreportedView;
