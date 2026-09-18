/**
 * @file MemberFilterToolbar.jsx
 * @description 교인 검색어 입력, 권한/정원/알림 필터 셀렉트, 정렬 및 새로고침 툴바 컴포넌트
 */

import PropTypes from "prop-types";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";

const MemberFilterToolbar = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  gardenFilter,
  onGardenFilterChange,
  availableGardens,
  notificationFilter,
  onNotificationFilterChange,
  sortDirection,
  onSortDirectionChange,
  onRefresh,
  loading,
  refreshing,
}) => (
  <Box
    sx={{
      p: { xs: 2, sm: 3 },
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      gap: 2,
      alignItems: { xs: "stretch", md: "center" },
      justifyContent: "space-between",
      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      backgroundColor: "#fafafa",
    }}
  >
    {/* 검색 입력창 */}
    <TextField
      size="small"
      placeholder="교인 성명 또는 전화번호 검색..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      sx={{
        minWidth: { xs: "100%", md: 320 },
        backgroundColor: "#fff",
        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#888" }} />
            </InputAdornment>
          ),
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onSearchChange("")}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />

    {/* 필터 및 컨트롤 */}
    <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", alignItems: "center" }}>
      <FormControl size="small" sx={{ minWidth: 125, backgroundColor: "#fff" }}>
        <InputLabel id="role-filter-label">역할 필터</InputLabel>
        <Select
          labelId="role-filter-label"
          value={roleFilter}
          label="역할 필터"
          onChange={(e) => onRoleFilterChange(e.target.value)}
          sx={{ borderRadius: "12px" }}
        >
          <MenuItem value="all">전체 역할</MenuItem>
          <MenuItem value="staff">스태프만</MenuItem>
          <MenuItem value="keeper">정원지기만</MenuItem>
          <MenuItem value="member">역할 없음 (-)</MenuItem>
        </Select>
      </FormControl>

      {availableGardens.length > 0 && (
        <FormControl size="small" sx={{ minWidth: 120, backgroundColor: "#fff" }}>
          <InputLabel id="garden-filter-label">정원 필터</InputLabel>
          <Select
            labelId="garden-filter-label"
            value={gardenFilter}
            label="정원 필터"
            onChange={(e) => onGardenFilterChange(e.target.value)}
            sx={{ borderRadius: "12px" }}
          >
            <MenuItem value="all">전체 정원</MenuItem>
            {availableGardens.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <FormControl size="small" sx={{ minWidth: 125, backgroundColor: "#fff" }}>
        <InputLabel id="notification-filter-label">알림 필터</InputLabel>
        <Select
          labelId="notification-filter-label"
          value={notificationFilter}
          label="알림 필터"
          onChange={(e) => onNotificationFilterChange(e.target.value)}
          sx={{ borderRadius: "12px" }}
        >
          <MenuItem value="all">전체 알림</MenuItem>
          <MenuItem value="enabled">알림 켜짐 (ON)</MenuItem>
          <MenuItem value="disabled">알림 미등록 (OFF)</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140, backgroundColor: "#fff" }}>
        <InputLabel id="sort-select-label">정렬 기준</InputLabel>
        <Select
          labelId="sort-select-label"
          value={sortDirection}
          label="정렬 기준"
          onChange={(e) => onSortDirectionChange(e.target.value)}
          sx={{ borderRadius: "12px" }}
        >
          <MenuItem value="asc">이름순 (가나다)</MenuItem>
          <MenuItem value="desc">이름 역순 (하파타)</MenuItem>
        </Select>
      </FormControl>

      <Tooltip title="새로고침">
        <span>
          <IconButton
            onClick={onRefresh}
            disabled={refreshing || loading}
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.12)",
              borderRadius: "12px",
              backgroundColor: "#fff",
              p: 0.9,
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            {refreshing ? (
              <CircularProgress size={20} sx={{ color: "#FF6B00" }} />
            ) : (
              <RefreshIcon sx={{ color: "#555" }} />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  </Box>
);

MemberFilterToolbar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  roleFilter: PropTypes.string.isRequired,
  onRoleFilterChange: PropTypes.func.isRequired,
  gardenFilter: PropTypes.string.isRequired,
  onGardenFilterChange: PropTypes.func.isRequired,
  availableGardens: PropTypes.arrayOf(PropTypes.string).isRequired,
  notificationFilter: PropTypes.string.isRequired,
  onNotificationFilterChange: PropTypes.func.isRequired,
  sortDirection: PropTypes.string.isRequired,
  onSortDirectionChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
};

export default MemberFilterToolbar;
