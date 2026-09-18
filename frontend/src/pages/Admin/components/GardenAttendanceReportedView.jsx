import { Box, Typography, Paper, Chip, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

const GardenAttendanceReportedView = ({
  attendees = [],
  absentees = [],
  absenceReasons = {},
}) => {
  return (
    <Stack spacing={3}>
      {/* 1. Attendees */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <CheckCircleIcon sx={{ color: "#16a34a", fontSize: "1.25rem" }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, color: "#16a34a" }}
          >
            출석 성도 ({attendees.length}명)
          </Typography>
        </Box>

        {attendees.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "#94a3b8", fontStyle: "italic", pl: 0.5 }}
          >
            출석한 성도가 없습니다.
          </Typography>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "14px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {attendees.map((name) => (
              <Chip
                key={name}
                label={name}
                size="medium"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  backgroundColor: "#ffffff",
                  color: "#15803d",
                  border: "1px solid #86efac",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                }}
              />
            ))}
          </Paper>
        )}
      </Box>

      {/* 2. Absentees & Reasons */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <CancelIcon sx={{ color: "#dc2626", fontSize: "1.25rem" }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, color: "#dc2626" }}
          >
            결석 성도 & 사유 ({absentees.length}명)
          </Typography>
        </Box>

        {absentees.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "14px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#15803d", fontWeight: 700 }}
            >
              🎉 전원 출석했습니다!
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={1.2}>
            {absentees.map((name) => {
              const reason = absenceReasons[name];

              return (
                <Paper
                  key={name}
                  elevation={0}
                  sx={{
                    p: 1.6,
                    borderRadius: "12px",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 700, color: "#991b1b" }}
                  >
                    {name}
                  </Typography>

                  {reason ? (
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.6,
                        backgroundColor: "#fff",
                        border: "1px solid #fca5a5",
                        borderRadius: "8px",
                        px: 1.2,
                        py: 0.5,
                        maxWidth: "80%",
                      }}
                    >
                      <ChatBubbleOutlineIcon
                        sx={{ fontSize: "0.95rem", color: "#ea580c" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#7f1d1d",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          wordBreak: "break-word",
                        }}
                      >
                        {reason}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      variant="caption"
                      sx={{ color: "#94a3b8", fontWeight: 500 }}
                    >
                      (사유 미기재)
                    </Typography>
                  )}
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default GardenAttendanceReportedView;
