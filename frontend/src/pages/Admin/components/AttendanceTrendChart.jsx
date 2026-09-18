/**
 * @file AttendanceTrendChart.jsx
 * @description 최근 주차별 출석 추이 막대 차트 컴포넌트
 */

import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";

const AttendanceTrendChart = ({ trend, selectedDate, onDateChange }) => {
  if (!trend || trend.length <= 1) return null;

  const maxAttendees = Math.max(...trend.map((t) => t.attended || 1), 100);

  return (
    <Card
      sx={{
        mb: 4,
        borderRadius: "16px",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <BarChartIcon sx={{ color: "#ea580c" }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
            최근 주차별 출석 추이
          </Typography>
        </Box>

        {/* Visual Bar Columns */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${trend.length}, 1fr)`,
            gap: 2,
            pt: 2,
            pb: 1,
            alignItems: "flex-end",
            minHeight: 180,
          }}
        >
          {trend.map((w) => {
            const isCurrent = w.date === selectedDate;
            const heightPercent = Math.min(100, Math.max(15, (w.attended / maxAttendees) * 100));

            return (
              <Box
                key={w.date}
                onClick={() => onDateChange(w.date)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "transform 0.18s ease",
                  "&:hover": { transform: "translateY(-3px)" },
                }}
              >
                {/* Attendance count label */}
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    color: isCurrent ? "#ea580c" : "#475569",
                    mb: 0.5,
                    fontSize: "0.85rem",
                  }}
                >
                  {w.attended}명
                </Typography>

                {/* Bar */}
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 48,
                    height: `${heightPercent}px`,
                    minHeight: 24,
                    borderRadius: "8px 8px 4px 4px",
                    backgroundColor: isCurrent ? "#ea580c" : "#cbd5e1",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      backgroundColor: isCurrent ? "#c2410c" : "#94a3b8",
                    },
                  }}
                />

                {/* Date label */}
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    fontWeight: isCurrent ? 800 : 600,
                    color: isCurrent ? "#ea580c" : "#64748b",
                    fontSize: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  {w.date.slice(5)}
                </Typography>

                {/* Rate pill */}
                <Chip
                  label={`${w.rate}%`}
                  size="small"
                  sx={{
                    mt: 0.5,
                    height: 18,
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    backgroundColor: isCurrent ? "rgba(234, 88, 12, 0.15)" : "#f1f5f9",
                    color: isCurrent ? "#c2410c" : "#64748b",
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

AttendanceTrendChart.propTypes = {
  trend: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      attended: PropTypes.number.isRequired,
      rate: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
};

export default AttendanceTrendChart;
