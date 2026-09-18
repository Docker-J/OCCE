/**
 * @file AttendanceSummaryCards.jsx
 * @description 출석 통계 4대 상단 요약 카드 (총 출석 인원, 보고 진척도, 미보고 정원, 전주 대비 변동)
 */

import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EventIcon from "@mui/icons-material/Event";

const AttendanceSummaryCards = ({ summary }) => {
  if (!summary) return null;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
        gap: 2,
        mb: 4,
      }}
    >
      {/* Card 1: Total Attendance */}
      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(22, 163, 74, 0.15)",
          background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
        }}
      >
        <CardContent sx={{ p: "20px !important" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#16a34a" }}>
              주일 총 출석 인원
            </Typography>
            <PeopleIcon sx={{ color: "#16a34a", fontSize: "1.4rem" }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 0.8 }}>
            {summary.totalAttendees}
            <Typography component="span" variant="body1" sx={{ color: "#64748b", fontWeight: 500, ml: 0.5 }}>
              / {summary.totalMembers}명
            </Typography>
          </Typography>
          <Chip
            label={`출석률 ${summary.overallAttendanceRate}%`}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              backgroundColor: "#dcfce7",
              color: "#15803d",
              borderRadius: "6px",
            }}
          />
        </CardContent>
      </Card>

      {/* Card 2: Garden Reporting Progress */}
      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(37, 99, 235, 0.15)",
          background: "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)",
        }}
      >
        <CardContent sx={{ p: "20px !important" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#2563eb" }}>
              정원 보고 진척도
            </Typography>
            <AssignmentTurnedInIcon sx={{ color: "#2563eb", fontSize: "1.4rem" }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 0.8 }}>
            {summary.reportedGardensCount}
            <Typography component="span" variant="body1" sx={{ color: "#64748b", fontWeight: 500, ml: 0.5 }}>
              / {summary.totalGardensCount} 정원
            </Typography>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <LinearProgress
              variant="determinate"
              value={summary.reportingRate}
              sx={{
                flexGrow: 1,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#dbeafe",
                "& .MuiLinearProgress-bar": { backgroundColor: "#2563eb", borderRadius: 3 },
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#2563eb" }}>
              {summary.reportingRate}%
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Card 3: Unreported Gardens */}
      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(234, 88, 12, 0.15)",
          background: "linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)",
        }}
      >
        <CardContent sx={{ p: "20px !important" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#ea580c" }}>
              미보고 정원
            </Typography>
            <WarningAmberIcon sx={{ color: "#ea580c", fontSize: "1.4rem" }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 0.8 }}>
            {summary.unreportedGardens.length}
            <Typography component="span" variant="body1" sx={{ color: "#64748b", fontWeight: 500, ml: 0.5 }}>
              곳
            </Typography>
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxHeight: 36, overflow: "hidden" }}>
            {summary.unreportedGardens.length === 0 ? (
              <Chip
                label="모든 정원 보고 완료"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  backgroundColor: "#dcfce7",
                  color: "#15803d",
                  borderRadius: "6px",
                }}
              />
            ) : (
              summary.unreportedGardens.slice(0, 3).map((g) => (
                <Chip
                  key={g}
                  label={g}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    borderRadius: "6px",
                    height: 20,
                  }}
                />
              ))
            )}
            {summary.unreportedGardens.length > 3 && (
              <Typography variant="caption" sx={{ color: "#888", alignSelf: "center" }}>
                +{summary.unreportedGardens.length - 3}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Card 4: Comparison vs Previous Week */}
      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(100, 116, 139, 0.15)",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <CardContent sx={{ p: "20px !important" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748b" }}>
              전주 대비 변동
            </Typography>
            {summary.delta ? (
              summary.delta.attendeesDiff >= 0 ? (
                <TrendingUpIcon sx={{ color: "#16a34a", fontSize: "1.4rem" }} />
              ) : (
                <TrendingDownIcon sx={{ color: "#dc2626", fontSize: "1.4rem" }} />
              )
            ) : (
              <EventIcon sx={{ color: "#94a3b8", fontSize: "1.4rem" }} />
            )}
          </Box>
          {summary.delta ? (
            <>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: summary.delta.attendeesDiff >= 0 ? "#16a34a" : "#dc2626",
                  mb: 0.8,
                }}
              >
                {summary.delta.attendeesDiff >= 0 ? `+${summary.delta.attendeesDiff}` : summary.delta.attendeesDiff}
                <Typography component="span" variant="body1" sx={{ color: "#64748b", fontWeight: 500, ml: 0.5 }}>
                  명
                </Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                출석률 {summary.delta.rateDiff >= 0 ? `+${summary.delta.rateDiff}%p` : `${summary.delta.rateDiff}%p`}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" sx={{ color: "#94a3b8", mt: 1.5, fontWeight: 500 }}>
              이전 주 비교 데이터 없음
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

AttendanceSummaryCards.propTypes = {
  summary: PropTypes.shape({
    totalAttendees: PropTypes.number.isRequired,
    totalMembers: PropTypes.number.isRequired,
    overallAttendanceRate: PropTypes.number.isRequired,
    reportedGardensCount: PropTypes.number.isRequired,
    totalGardensCount: PropTypes.number.isRequired,
    reportingRate: PropTypes.number.isRequired,
    unreportedGardens: PropTypes.arrayOf(PropTypes.string).isRequired,
    delta: PropTypes.shape({
      attendeesDiff: PropTypes.number.isRequired,
      rateDiff: PropTypes.number.isRequired,
    }),
  }),
};

export default AttendanceSummaryCards;
