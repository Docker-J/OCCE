/**
 * @file MemberFilterToolbar.jsx
 * @description 교인 검색, 웹 가입 상태/역할/정원/제적 상태 필터 및 등록/가져오기 액션 툴바
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
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";

const MemberFilterToolbar = ({
  searchTerm,
  onSearchChange,
  registrationFilter,
  onRegistrationFilterChange,
  roleFilter,
  onRoleFilterChange,
  gardenFilter,
  onGardenFilterChange,
  availableGardens,
  statusFilter,
  onStatusFilterChange,
  notificationFilter,
  onNotificationFilterChange,
  sortDirection,
  onSortDirectionChange,
  onRefresh,
  loading,
  refreshing,
  onOpenCreateModal,
  onImportFromDrive,
  importing,
}) => (
  <Box
    sx={{
      p: { xs: 2, sm: 2.5 },
      display: "flex",
      flexDirection: "column",
      gap: 2,
      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      backgroundColor: "#fafafa",
    }}
  >
    {/* 1. 상단 액션 바: 신규 등록 버튼, 구글 드라이브 가져오기 버튼, 검색창 */}
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 1.5,
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Button
          variant="contained"
          startIcon={<PersonAddAlt1Icon />}
          onClick={onOpenCreateModal}
          sx={{
            backgroundColor: "#2563eb",
            "&:hover": { backgroundColor: "#1d4ed8" },
            borderRadius: "12px",
            px: 2.5,
            py: 1,
            fontWeight: 700,
            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
            whiteSpace: "nowrap",
          }}
        >
          새 교인 등록
        </Button>

        <Tooltip title="Google Drive의 엑셀 교적부 데이터를 1회성으로 D1에 가져옵니다.">
          <span>
            <Button
              variant="outlined"
              startIcon={importing ? <CircularProgress size={18} color="inherit" /> : <CloudDownloadOutlinedIcon />}
              onClick={onImportFromDrive}
              disabled={importing || loading || refreshing}
              sx={{
                borderRadius: "12px",
                px: 2,
                py: 1,
                fontWeight: 600,
                color: "#555",
                borderColor: "rgba(0, 0, 0, 0.2)",
                "&:hover": { backgroundColor: "#fff", borderColor: "#222" },
                whiteSpace: "nowrap",
              }}
            >
              {importing ? "교적 이전 중..." : "구글 엑셀 가져오기"}
            </Button>
          </span>
        </Tooltip>
      </Stack>

      {/* 검색 입력창 */}
      <TextField
        size="small"
        placeholder="교인 성명, 연락처, 주소 검색..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          minWidth: { xs: "100%", md: 340 },
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
    </Box>

    {/* 2. 하단 필터 바: 웹가입, 직분, 정원, 제적 상태, 알림, 정렬, 새로고침 */}
    <Stack direction="row" spacing={1.2} sx={{ flexWrap: "wrap", alignItems: "center", gap: 1 }}>
      {/* 웹 가입 상태 필터 */}
      <FormControl size="small" sx={{ minWidth: 135, backgroundColor: "#fff" }}>
        <InputLabel id="reg-filter-label">웹 가입 여부</InputLabel>
        <Select
          labelId="reg-filter-label"
          value={registrationFilter}
          label="웹 가입 여부"
          onChange={(e) => onRegistrationFilterChange(e.target.value)}
          sx={{ borderRadius: "12px" }}
        >
          <MenuItem value="all">전체 교인</MenuItem>
          <MenuItem value="registered">웹가입 완료</MenuItem>
          <MenuItem value="unregistered">미가입 교인</MenuItem>
        </Select>
      </FormControl>

      {/* 직분 / 부서 필터 */}
      <FormControl size="small" sx={{ minWidth: 140, backgroundColor: "#fff" }}>
        <InputLabel id="role-filter-label">직분 / 부서</InputLabel>
        <Select
          labelId="role-filter-label"
          value={roleFilter}
          label="직분 / 부서"
          onChange={(e) => onRoleFilterChange(e.target.value)}
          sx={{ borderRadius: "12px" }}
        >
          <MenuItem value="all">전체 직분 / 부서</MenuItem>
          <MenuItem value="pastor">교역자만</MenuItem>
          <MenuItem value="keeper">정원지기만</MenuItem>
          <MenuItem value="staff">스태프(관리자)</MenuItem>
          <MenuItem value="member">일반 장년 성도</MenuItem>
          <MenuItem value="young_adult">청년부만</MenuItem>
          <MenuItem value="youth">중고등부만</MenuItem>
          <MenuItem value="elementary">유초등부만</MenuItem>
          <MenuItem value="kindergarten">유아유치부만</MenuItem>
        </Select>
      </FormControl>

      {/* 정원 필터 */}
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
              <MenuItem key={g.id || g.name} value={g.name}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* 교적 상태 필터 (제적 여부) */}
      <FormControl size="small" sx={{ minWidth: 120, backgroundColor: "#fff" }}>
        <InputLabel id="status-filter-label">교적 상태</InputLabel>
        <Select
          labelId="status-filter-label"
          value={statusFilter}
          label="교적 상태"
          onChange={(e) => onStatusFilterChange(e.target.value)}
          sx={{ borderRadius: "12px" }}
        >
          <MenuItem value="active">활동 성도만</MenuItem>
          <MenuItem value="all">전체 (제적 포함)</MenuItem>
          <MenuItem value="removed">제적된 성도만</MenuItem>
        </Select>
      </FormControl>

      {/* 알림 필터 */}
      <FormControl size="small" sx={{ minWidth: 125, backgroundColor: "#fff" }}>
        <InputLabel id="notification-filter-label">알림 수신</InputLabel>
        <Select
          labelId="notification-filter-label"
          value={notificationFilter}
          label="알림 수신"
          onChange={(e) => onNotificationFilterChange(e.target.value)}
          sx={{ borderRadius: "12px" }}
        >
          <MenuItem value="all">전체 알림</MenuItem>
          <MenuItem value="enabled">알림 켜짐 (ON)</MenuItem>
          <MenuItem value="disabled">알림 미등록 (OFF)</MenuItem>
        </Select>
      </FormControl>

      {/* 세대주 기준 정렬 */}
      <FormControl size="small" sx={{ minWidth: 145, backgroundColor: "#fff" }}>
        <InputLabel id="sort-select-label">세대주 정렬</InputLabel>
        <Select
          labelId="sort-select-label"
          value={sortDirection}
          label="세대주 정렬"
          onChange={(e) => onSortDirectionChange(e.target.value)}
          sx={{ borderRadius: "12px" }}
        >
          <MenuItem value="asc">가나다순 (세대 묶음)</MenuItem>
          <MenuItem value="desc">하파타순 (세대 묶음)</MenuItem>
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
  registrationFilter: PropTypes.string.isRequired,
  onRegistrationFilterChange: PropTypes.func.isRequired,
  roleFilter: PropTypes.string.isRequired,
  onRoleFilterChange: PropTypes.func.isRequired,
  gardenFilter: PropTypes.string.isRequired,
  onGardenFilterChange: PropTypes.func.isRequired,
  availableGardens: PropTypes.arrayOf(PropTypes.object).isRequired,
  statusFilter: PropTypes.string.isRequired,
  onStatusFilterChange: PropTypes.func.isRequired,
  notificationFilter: PropTypes.string.isRequired,
  onNotificationFilterChange: PropTypes.func.isRequired,
  sortDirection: PropTypes.string.isRequired,
  onSortDirectionChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  onOpenCreateModal: PropTypes.func.isRequired,
  onImportFromDrive: PropTypes.func.isRequired,
  importing: PropTypes.bool.isRequired,
};

export default MemberFilterToolbar;
