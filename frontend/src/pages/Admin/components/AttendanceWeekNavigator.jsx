/**
 * @file AttendanceWeekNavigator.jsx
 * @description 주차 선택, 이전/다음 주일 이동 및 실시간 새로고침 툴바 컴포넌트
 */

import PropTypes from "prop-types";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAttendanceDashboardContext } from "../AdminDashboardContexts";

const AttendanceWeekNavigator = ({
  selectedDate: selectedDateProp,
  availableDates: availableDatesProp,
  hasPrevious: hasPreviousProp,
  hasNext: hasNextProp,
  loading: loadingProp,
  refreshing: refreshingProp,
  onPrevDate: onPrevDateProp,
  onNextDate: onNextDateProp,
  onDateChange: onDateChangeProp,
  onRefresh: onRefreshProp,
}) => {
  const ctx = useAttendanceDashboardContext();

  const selectedDate = selectedDateProp ?? ctx?.state?.selectedDate ?? "";
  const availableDates =
    availableDatesProp ?? ctx?.state?.availableDates ?? [];
  const hasPrevious = hasPreviousProp ?? ctx?.state?.hasPrevious ?? false;
  const hasNext = hasNextProp ?? ctx?.state?.hasNext ?? false;
  const loading = loadingProp ?? ctx?.state?.loading ?? false;
  const refreshing = refreshingProp ?? ctx?.state?.refreshing ?? false;
  const onPrevDate = onPrevDateProp ?? ctx?.actions?.handlePrevDate;
  const onNextDate = onNextDateProp ?? ctx?.actions?.handleNextDate;
  const onDateChange = onDateChangeProp ?? ctx?.actions?.handleDateChange;
  const onRefresh =
    onRefreshProp ?? (() => ctx?.actions?.fetchData?.(true));

  return (
    <Card
      sx={{
        mb: 3,
        p: 2,
        borderRadius: "16px",
        background: "#fff",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Left: 날짜 선택 및 이전/다음 이동 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="이전 주일 출석부">
            <span>
              <IconButton
                size="small"
                onClick={onPrevDate}
                disabled={!hasPrevious || refreshing || loading}
                sx={{
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  borderRadius: "10px",
                  p: 0.8,
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel id="attendance-date-label">주일 날짜 선택</InputLabel>
            <Select
              labelId="attendance-date-label"
              value={selectedDate}
              label="주일 날짜 선택"
              onChange={(e) => onDateChange(e.target.value)}
              sx={{ borderRadius: "10px", fontWeight: 700 }}
            >
              {availableDates.map((d, i) => (
                <MenuItem key={d} value={d}>
                  {d} {i === 0 ? "(최근 주일)" : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title="다음 주일 출석부">
            <span>
              <IconButton
                size="small"
                onClick={onNextDate}
                disabled={!hasNext || refreshing || loading}
                sx={{
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  borderRadius: "10px",
                  p: 0.8,
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Right: 현황 라벨 및 새로고침 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
            {selectedDate} 주일 출석 현황
          </Typography>
          <Tooltip title="실시간 새로고침">
            <span>
              <IconButton
                onClick={onRefresh}
                disabled={refreshing || loading}
                sx={{
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  borderRadius: "10px",
                  p: 0.8,
                }}
              >
                {refreshing ? (
                  <CircularProgress size={18} sx={{ color: "#FF6B00" }} />
                ) : (
                  <RefreshIcon fontSize="small" sx={{ color: "#555" }} />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
};

AttendanceWeekNavigator.propTypes = {
  selectedDate: PropTypes.string,
  availableDates: PropTypes.arrayOf(PropTypes.string),
  hasPrevious: PropTypes.bool,
  hasNext: PropTypes.bool,
  loading: PropTypes.bool,
  refreshing: PropTypes.bool,
  onPrevDate: PropTypes.func,
  onNextDate: PropTypes.func,
  onDateChange: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default AttendanceWeekNavigator;
