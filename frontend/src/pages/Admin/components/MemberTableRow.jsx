/**
 * @file MemberTableRow.jsx
 * @description 교인 및 교적부 테이블 개별 행(Row) 컴포넌트
 * 세대/주소, 직분, 세례, 웹가입 여부, 연락처, 정원, 알림 및 수정/제적 관리 지원
 */

import PropTypes from "prop-types";
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  Chip,
  Tooltip,
  CircularProgress,
  Stack,
} from "@mui/material";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ForestIcon from "@mui/icons-material/Forest";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { formatPhoneNumber } from "../utils/memberUtils";

const RELATIONSHIP_LABELS = {
  HEAD: "세대주",
  SPOUSE: "배우자",
  CHILD: "자녀",
  PARENT: "부모",
  OTHER: "기타",
};

const BAPTISM_LABELS = {
  BAPTIZED: { label: "세례", bg: "rgba(37, 99, 235, 0.08)", color: "#1d4ed8", border: "rgba(37, 99, 235, 0.2)" },
  INFANT: { label: "유아세례", bg: "rgba(13, 148, 136, 0.08)", color: "#0f766e", border: "rgba(13, 148, 136, 0.2)" },
  CONFIRMATION: { label: "입교", bg: "rgba(124, 58, 237, 0.08)", color: "#6d28d9", border: "rgba(124, 58, 237, 0.2)" },
  NONE: { label: "미세례", bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" },
};

const MemberTableRow = ({
  user,
  isProcessing,
  onOpenRoleModal,
  onOpenEditModal,
}) => {
  const relLabel = RELATIONSHIP_LABELS[user.relationship] || (user.isHead ? "세대주" : "");
  const baptismMeta = BAPTISM_LABELS[user.baptismStatus] || BAPTISM_LABELS.NONE;
  const isRemoved = user.status === "REMOVED";

  const cityProvince = [user.city || "Edmonton", user.province || "AB"].filter(Boolean).join(", ");
  const fullAddress = [user.address, user.addressDetail, cityProvince, user.postalCode]
    .filter(Boolean)
    .join(", ");

  return (
    <TableRow
      hover
      onClick={() => onOpenEditModal(user)}
      sx={{
        cursor: "pointer",
        "&:last-child td, &:last-child th": { borderBottom: 0 },
        transition: "all 0.15s ease",
        backgroundColor: isRemoved
          ? "rgba(239, 68, 68, 0.03)"
          : user.isAlternateHousehold
          ? "#f1f5f9"
          : "#ffffff",
        borderTop: user.isFirstInHousehold ? "2px solid #cbd5e1" : "1px dashed #e2e8f0",
        "&:hover": {
          backgroundColor: isRemoved
            ? "rgba(239, 68, 68, 0.07) !important"
            : user.isAlternateHousehold
            ? "#e2e8f0 !important"
            : "#f8fafc !important",
        },
      }}
    >
      {/* 1. 성명 및 세대/주소 정보 (좌측 오렌지 바 제거 및 패딩 정돈) */}
      <TableCell
        sx={{
          py: 1.6,
          pl: 2.5,
          transition: "all 0.15s ease",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <Tooltip title={user.nameEn ? `영문명: ${user.nameEn}` : ""} disableHoverListener={!user.nameEn} arrow>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                color: isRemoved ? "#991b1b" : "#111827",
                textDecoration: isRemoved ? "line-through" : "none",
                fontSize: "0.95rem",
              }}
            >
              {user.name || "(이름 없음)"}
            </Typography>
          </Tooltip>

          {isRemoved ? (
            <Chip
              size="small"
              label="제적"
              sx={{
                height: 20,
                fontSize: "0.7rem",
                fontWeight: 700,
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                color: "#dc2626",
                border: "1px solid rgba(220, 38, 38, 0.3)",
              }}
            />
          ) : !user.isSingleHousehold && user.isHead ? (
            <Chip
              size="small"
              label="세대주"
              sx={{
                height: 20,
                fontSize: "0.68rem",
                fontWeight: 700,
                backgroundColor: "rgba(234, 88, 12, 0.12)",
                color: "#c2410c",
                border: "1px solid rgba(234, 88, 12, 0.3)",
              }}
            />
          ) : relLabel && !user.isSingleHousehold ? (
            <Chip
              size="small"
              label={relLabel}
              sx={{
                height: 20,
                fontSize: "0.68rem",
                fontWeight: 600,
                backgroundColor:
                  user.relationship === "SPOUSE"
                    ? "rgba(236, 72, 153, 0.08)"
                    : user.relationship === "CHILD"
                    ? "rgba(59, 130, 246, 0.08)"
                    : "#f3f4f6",
                color:
                  user.relationship === "SPOUSE"
                    ? "#be185d"
                    : user.relationship === "CHILD"
                    ? "#1d4ed8"
                    : "#4b5563",
                border:
                  user.relationship === "SPOUSE"
                    ? "1px solid rgba(236, 72, 153, 0.2)"
                    : user.relationship === "CHILD"
                    ? "1px solid rgba(59, 130, 246, 0.2)"
                    : "1px solid #e5e7eb",
              }}
            />
          ) : null}
        </Box>

        {/* 세대 주소 보조 정보 (세대 대표 행에만 깔끔하게 주소 칩 노출) */}
        {user.isFirstInHousehold && fullAddress && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 0.3, flexWrap: "wrap" }}>
            <Tooltip title={`세대 주소: ${fullAddress}`} arrow>
              <Chip
                icon={<HomeOutlinedIcon sx={{ fontSize: "0.9rem !important", color: "#666 !important" }} />}
                label={user.address || "주소 등록됨"}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.68rem",
                  maxWidth: 240,
                  color: "#555",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
                }}
              />
            </Tooltip>
          </Box>
        )}
      </TableCell>

      {/* 2. 직분 및 세례 신분 */}
      <TableCell align="center" sx={{ py: 1.8, whiteSpace: "nowrap" }}>
        <Stack direction="row" spacing={0.8} sx={{ justifyContent: "center", alignItems: "center" }}>

          {user.position === "교역자" ? (
            <Tooltip title="온교회 교역자">
              <Chip
                size="small"
                label="교역자"
                sx={{
                  height: 24,
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  backgroundColor: "rgba(147, 51, 234, 0.12)",
                  color: "#7e22ce",
                  border: "1px solid rgba(147, 51, 234, 0.3)",
                }}
              />
            </Tooltip>
          ) : (
            <Typography variant="body2" sx={{ color: "#444", fontWeight: 600, fontSize: "0.85rem" }}>
              {user.position || "성도"}
            </Typography>
          )}

          <Tooltip title={`세례 신분: ${baptismMeta.label}`}>
            <Chip
              size="small"
              label={baptismMeta.label}
              sx={{
                height: 22,
                fontSize: "0.72rem",
                fontWeight: 600,
                backgroundColor: baptismMeta.bg,
                color: baptismMeta.color,
                border: `1px solid ${baptismMeta.border}`,
              }}
            />
          </Tooltip>
        </Stack>
      </TableCell>

      {/* 3. 웹사이트 회원가입 여부 (핵심 요구사항) */}
      <TableCell align="center" sx={{ py: 1.8, whiteSpace: "nowrap" }}>
        {user.isRegistered ? (
          <Tooltip title="온교회 웹사이트 계정 생성 및 본인확인 완료" arrow>
            <Chip
              size="small"
              label="웹가입 완료"
              sx={{
                height: 25,
                fontSize: "0.75rem",
                fontWeight: 800,
                backgroundColor: "#f0fdf4",
                color: "#15803d",
                border: "1px solid #bbf7d0",
                px: 0.5,
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title="아직 웹사이트에 회원가입하지 않은 교적부 성도" arrow>
            <Chip
              size="small"
              label="미가입"
              sx={{
                height: 25,
                fontSize: "0.75rem",
                fontWeight: 600,
                backgroundColor: "#f3f4f6",
                color: "#6b7280",
                border: "1px solid #e5e7eb",
                px: 0.5,
              }}
            />
          </Tooltip>
        )}
      </TableCell>

      {/* 4. 연락처 */}
      <TableCell sx={{ py: 1.8, color: "#333", fontWeight: 500, whiteSpace: "nowrap" }}>
        <Typography
          component="span"
          sx={{
            display: "inline-block",
            color: "#222",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}
        >
          {formatPhoneNumber(user.phone)}
        </Typography>
      </TableCell>

      {/* 5. 소속 정원 */}
      <TableCell align="center" sx={{ py: 1.8, whiteSpace: "nowrap" }}>
        {user.gardenName || user.garden ? (
          <Chip
            label={user.gardenName || user.garden}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.8rem",
              height: 26,
              borderRadius: "8px",
              backgroundColor: "rgba(234, 88, 12, 0.08)",
              color: "#c2410c",
              border: "1px solid rgba(234, 88, 12, 0.25)",
            }}
          />
        ) : (
          <Typography variant="body2" sx={{ color: "#aaa" }}>
            미배정
          </Typography>
        )}
      </TableCell>

      {/* 6. 정원지기 역할 관리 */}
      <TableCell align="center" sx={{ py: 1.8, whiteSpace: "nowrap" }}>
        {isProcessing ? (
          <CircularProgress size={22} sx={{ color: "#ea580c" }} />
        ) : user.isStaff ? (
          <Tooltip title="온교회 교역자 / 스태프 (모든 소그룹 및 행정 권한 포함)">
            <Chip
              icon={<SupervisorAccountIcon sx={{ fontSize: "1.1rem !important", color: "inherit !important" }} />}
              label="스태프"
              sx={{
                fontWeight: 700,
                fontSize: "0.82rem",
                height: 30,
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
              icon={<ForestIcon sx={{ fontSize: "1.1rem !important", color: "inherit !important" }} />}
              label="정원지기"
              clickable
              onClick={(e) => {
                e.stopPropagation();
                onOpenRoleModal(user);
              }}
              sx={{
                fontWeight: 700,
                fontSize: "0.82rem",
                height: 30,
                borderRadius: "10px",
                backgroundColor: "rgba(234, 88, 12, 0.12)",
                color: "#ea580c",
                border: "1px solid rgba(234, 88, 12, 0.3)",
                cursor: "pointer",
                "&:hover": { backgroundColor: "rgba(234, 88, 12, 0.22)" },
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title="클릭하여 정원지기 임명 및 정원 배정">
            <Chip
              label="-"
              clickable
              onClick={(e) => {
                e.stopPropagation();
                onOpenRoleModal(user);
              }}
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
                height: 30,
                width: 50,
                borderRadius: "10px",
                backgroundColor: "#f3f4f6",
                color: "#9ca3af",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#e5e7eb", color: "#333" },
              }}
            />
          </Tooltip>
        )}
      </TableCell>

      {/* 7. 알림 수신 상태 */}
      <TableCell align="center" sx={{ py: 1.8, whiteSpace: "nowrap" }}>
        {user.hasNotification ? (
          <Tooltip title="주일 리마인더 및 교회 소식 푸시 알림 수신 가능" arrow>
            <Chip
              icon={<NotificationsActiveIcon sx={{ fontSize: "0.95rem !important", color: "#16a34a !important" }} />}
              label="수신중"
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                height: 26,
                borderRadius: "8px",
                backgroundColor: "#f0fdf4",
                color: "#16a34a",
                border: "1px solid #bbf7d0",
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title="등록된 알림 기기가 없습니다" arrow>
            <Chip
              icon={<NotificationsOffIcon sx={{ fontSize: "0.95rem !important", color: "#9ca3af !important" }} />}
              label="미등록"
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 26,
                borderRadius: "8px",
                backgroundColor: "#f3f4f6",
                color: "#6b7280",
                border: "1px solid #e5e7eb",
              }}
            />
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
};

MemberTableRow.propTypes = {
  user: PropTypes.object.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  onOpenRoleModal: PropTypes.func.isRequired,
  onOpenEditModal: PropTypes.func.isRequired,
};

export default MemberTableRow;
