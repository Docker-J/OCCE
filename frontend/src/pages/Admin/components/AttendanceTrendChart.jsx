/**
 * @file AttendanceTrendChart.jsx
 * @description 최근 주차별 출석 추이 막대 차트 컴포넌트
 * - 가로 스크롤(overflow-x) 지원 및 최신 주차(오른쪽) 자동 기본 포커싱
 */

import { useRef, useEffect } from "react";
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
  const scrollContainerRef = useRef(null);
  const itemRefs = useRef({});

  // 데이터 로드 시 기본 스크롤 위치를 가장 오른쪽(최신 주차)으로 이동
  useEffect(() => {
    const scrollToFarRight = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
      }
    };

    const frameId = requestAnimationFrame(scrollToFarRight);
    const timer = setTimeout(scrollToFarRight, 60);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [trend]);

  // 선택된 주차가 스크롤 영역 밖으로 벗어난 경우 부드럽게 화면 안으로 스크롤 이동
  useEffect(() => {
    if (selectedDate && itemRefs.current[selectedDate] && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const el = itemRefs.current[selectedDate];

      const elLeft = el.offsetLeft;
      const elRight = elLeft + el.offsetWidth;
      const containerLeft = container.scrollLeft;
      const containerRight = containerLeft + container.clientWidth;

      if (elLeft < containerLeft) {
        container.scrollTo({ left: Math.max(0, elLeft - 24), behavior: "smooth" });
      } else if (elRight > containerRight) {
        container.scrollTo({ left: elRight - container.clientWidth + 24, behavior: "smooth" });
      }
    }
  }, [selectedDate]);

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <BarChartIcon sx={{ color: "#ea580c" }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
            최근 주차별 출석 추이
          </Typography>
        </Box>

        {/* Visual Bar Columns with Horizontal Scroll */}
        <Box
          ref={scrollContainerRef}
          sx={{
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch",
            py: 1,
            px: 0.5,
            "&::-webkit-scrollbar": {
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f5f9",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cbd5e1",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#94a3b8",
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              minWidth: "max-content",
              minHeight: 180,
              gap: { xs: 2.5, sm: 3.5 },
              pt: 2,
              pb: 1,
              px: 1,
            }}
          >
            {trend.map((w) => {
              const isCurrent = w.date === selectedDate;
              const heightPercent = Math.min(110, Math.max(24, Math.round((w.attended / maxAttendees) * 110)));

              return (
                <Box
                  key={w.date}
                  ref={(el) => {
                    if (el) itemRefs.current[w.date] = el;
                    else delete itemRefs.current[w.date];
                  }}
                  onClick={() => onDateChange(w.date)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    minWidth: { xs: 54, sm: 64 },
                    flex: "1 0 auto",
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
                      maxWidth: 44,
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
