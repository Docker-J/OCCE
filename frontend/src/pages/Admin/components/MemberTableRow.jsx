/**
 * @file MemberTableRow.jsx
 * @description 교인 테이블 개별 행(Row) 컴포넌트
 */

import PropTypes from "prop-types";
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  Chip,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ForestIcon from "@mui/icons-material/Forest";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { formatPhoneNumber } from "../utils/memberUtils";

const MemberTableRow = ({ user, isProcessing, onOpenRoleModal, onOpenDeleteDialog }) => (
  <TableRow
    hover
    sx={{
      "&:last-child td, &:last-child th": { border: 0 },
      transition: "all 0.2s ease",
    }}
  >
    {/* 성명 및 이메일 */}
    <TableCell sx={{ py: 2 }}>
      <Typography variant="body1" sx={{ fontWeight: 700, color: "#222" }}>
        {user.name || "(이름 없음)"}
      </Typography>
      {user.email && (
        <Typography variant="caption" sx={{ color: "#888", display: "block" }}>
          {user.email}
        </Typography>
      )}
    </TableCell>

    {/* 연락처 및 인증 뱃지 */}
    <TableCell sx={{ py: 2, color: "#333", fontWeight: 500, whiteSpace: "nowrap" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "nowrap" }}>
        <Typography
          component="span"
          sx={{
            width: 140,
            minWidth: 140,
            whiteSpace: "nowrap",
            display: "inline-block",
            color: "#333",
            fontWeight: 500,
            fontSize: "0.875rem",
          }}
        >
          {formatPhoneNumber(user.phone)}
        </Typography>
        {user.phoneVerified ? (
          <Tooltip title="전화번호 인증 완료 (Verified)">
            <Chip
              size="small"
              label="인증됨"
              sx={{
                height: 20,
                fontSize: "0.72rem",
                fontWeight: 700,
                borderRadius: "6px",
                backgroundColor: "rgba(22, 163, 74, 0.1)",
                color: "#16a34a",
                border: "1px solid rgba(22, 163, 74, 0.25)",
                "& .MuiChip-label": { px: 0.8 },
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title="전화번호 미인증 (Not Verified)">
            <Chip
              size="small"
              label="미인증"
              sx={{
                height: 20,
                fontSize: "0.72rem",
                fontWeight: 700,
                borderRadius: "6px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#dc2626",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                "& .MuiChip-label": { px: 0.8 },
              }}
            />
          </Tooltip>
        )}
      </Box>
    </TableCell>

    {/* 역할 관리 */}
    <TableCell align="center" sx={{ py: 2, whiteSpace: "nowrap" }}>
      {isProcessing ? (
        <CircularProgress size={22} sx={{ color: "#ea580c" }} />
      ) : user.isStaff ? (
        <Tooltip title="온교회 교역자 / 스태프 (모든 소그룹 및 행정 권한 포함)">
          <Chip
            icon={
              <SupervisorAccountIcon
                sx={{ fontSize: "1.15rem !important", color: "inherit !important" }}
              />
            }
            label="스태프"
            sx={{
              fontWeight: 700,
              fontSize: "0.875rem",
              height: 34,
              width: 115,
              minWidth: 115,
              justifyContent: "center",
              borderRadius: "10px",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              color: "#1d4ed8",
              border: "1px solid rgba(37, 99, 235, 0.25)",
            }}
          />
        </Tooltip>
      ) : user.isGardenKeeper ? (
        <Tooltip title="클릭하여 정원지기 및 담당 정원 수정 또는 해제">
          <Chip
            icon={
              <ForestIcon
                sx={{ fontSize: "1.15rem !important", color: "inherit !important" }}
              />
            }
            label="정원지기"
            clickable
            onClick={() => onOpenRoleModal(user)}
            sx={{
              fontWeight: 700,
              fontSize: "0.875rem",
              height: 34,
              width: 115,
              minWidth: 115,
              justifyContent: "center",
              borderRadius: "10px",
              backgroundColor: "rgba(234, 88, 12, 0.12)",
              color: "#ea580c",
              border: "1px solid rgba(234, 88, 12, 0.3)",
              cursor: "pointer",
              transition: "all 0.18s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(234, 88, 12, 0.22)",
                transform: "translateY(-1px)",
                boxShadow: "0 2px 6px rgba(234, 88, 12, 0.2)",
              },
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="클릭하여 정원지기 임명 및 정원 배정">
          <Chip
            label="-"
            clickable
            onClick={() => onOpenRoleModal(user)}
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              height: 34,
              width: 115,
              minWidth: 115,
              justifyContent: "center",
              borderRadius: "10px",
              backgroundColor: "#f3f4f6",
              color: "#9ca3af",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              cursor: "pointer",
              transition: "all 0.18s ease-in-out",
              "&:hover": {
                backgroundColor: "#e5e7eb",
                color: "#4b5563",
                transform: "translateY(-1px)",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
              },
            }}
          />
        </Tooltip>
      )}
    </TableCell>

    {/* 담당 정원 */}
    <TableCell align="center" sx={{ py: 2, whiteSpace: "nowrap" }}>
      {user.garden ? (
        <Box
          sx={{
            display: "inline-flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 0.6,
            maxWidth: 180,
          }}
        >
          {user.garden
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean)
            .map((gardenName) => (
              <Chip
                key={gardenName}
                label={gardenName}
                size="small"
                clickable
                onClick={() => onOpenRoleModal(user)}
                sx={{
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  height: 26,
                  borderRadius: "8px",
                  backgroundColor: "rgba(234, 88, 12, 0.08)",
                  color: "#c2410c",
                  border: "1px solid rgba(234, 88, 12, 0.25)",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(234, 88, 12, 0.18)",
                    transform: "translateY(-1px)",
                  },
                }}
              />
            ))}
        </Box>
      ) : (
        <Typography variant="body2" sx={{ color: "#bbb", fontWeight: 500, fontSize: "0.9rem" }}>
          -
        </Typography>
      )}
    </TableCell>

    {/* 알림 상태 */}
    <TableCell align="center" sx={{ py: 2, whiteSpace: "nowrap" }}>
      {user.hasNotification ? (
        <Tooltip title="주일 리마인더 및 교회 소식 알림 수신 가능" arrow>
          <Chip
            icon={
              <NotificationsActiveIcon
                sx={{ fontSize: "1rem !important", color: "#16a34a !important" }}
              />
            }
            label="수신중"
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.78rem",
              height: 28,
              borderRadius: "8px",
              backgroundColor: "#f0fdf4",
              color: "#16a34a",
              border: "1px solid #bbf7d0",
              px: 0.6,
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="등록된 알림 기기가 없습니다" arrow>
          <Chip
            icon={
              <NotificationsOffIcon
                sx={{ fontSize: "1rem !important", color: "#9ca3af !important" }}
              />
            }
            label="미등록"
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: "0.78rem",
              height: 28,
              borderRadius: "8px",
              backgroundColor: "#f3f4f6",
              color: "#6b7280",
              border: "1px solid #e5e7eb",
              px: 0.6,
            }}
          />
        </Tooltip>
      )}
    </TableCell>

    {/* 계정 삭제 액션 */}
    <TableCell align="center" sx={{ py: 2 }}>
      <Tooltip title="계정 삭제">
        <span>
          <IconButton
            size="small"
            disabled={isProcessing}
            onClick={() => onOpenDeleteDialog(user)}
            sx={{
              color: "#ef4444",
              "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.08)" },
            }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </TableCell>
  </TableRow>
);

MemberTableRow.propTypes = {
  user: PropTypes.object.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  onOpenRoleModal: PropTypes.func.isRequired,
  onOpenDeleteDialog: PropTypes.func.isRequired,
};

export default MemberTableRow;
