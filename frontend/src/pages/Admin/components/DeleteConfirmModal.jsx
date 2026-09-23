/**
 * @file DeleteConfirmModal.jsx
 * @description 교인 제적(REMOVED) 처리 및 영구 삭제 다이얼로그 (세대주 제적 시 세대 전체 제적 / 세대주 승계 옵션 지원)
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  InputLabel,
  Divider,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import { formatPhoneNumber } from "../utils/memberUtils";

const getRelationshipLabel = (rel) => {
  switch (rel) {
    case "SPOUSE":
      return "배우자";
    case "CHILD":
      return "자녀";
    case "PARENT":
      return "부모";
    default:
      return "가족";
  }
};

const DeleteConfirmModal = ({
  open,
  user,
  familyMembers = [],
  deleting,
  onClose,
  onConfirmRemoveStatus,
  onConfirmPermanentDelete,
}) => {
  const isMultiMemberHead = Boolean(user?.isHead && familyMembers.length > 0);

  // 'transfer': 세대주 승계 후 본인만 제적, 'cascade': 세대 전체 함께 제적
  const [headActionChoice, setHeadActionChoice] = useState("transfer");
  const [successorId, setSuccessorId] = useState("");

  useEffect(() => {
    if (familyMembers.length > 0) {
      setSuccessorId(familyMembers[0].id);
      setHeadActionChoice("transfer");
    }
  }, [user, familyMembers]);

  const handleRemove = () => {
    if (isMultiMemberHead) {
      if (headActionChoice === "cascade") {
        onConfirmRemoveStatus({ cascadeHousehold: true });
      } else {
        onConfirmRemoveStatus({ cascadeHousehold: false, successorMemberId: successorId });
      }
    } else {
      onConfirmRemoveStatus({});
    }
  };

  const handlePermanentDelete = () => {
    if (isMultiMemberHead && headActionChoice === "transfer") {
      onConfirmPermanentDelete({ successorMemberId: successorId });
    } else {
      onConfirmPermanentDelete({});
    }
  };

  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 200,
      }}
      slotProps={{
        paper: {
          sx: { borderRadius: "16px", p: 1, maxWidth: isMultiMemberHead ? "560px" : "480px", width: "100%" },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: "#dc2626", pb: 1 }}>
        교적 제적 또는 삭제 처리
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "#333", mb: 2, lineHeight: 1.6 }}>
          대상 교인: <strong>{user?.name || "교인"}</strong>
          {user?.phone ? ` (${formatPhoneNumber(user.phone)})` : ""}
          {user?.householdName ? ` · ${user.householdName}` : ""}
        </DialogContentText>

        {/* 다인 가구 세대주일 경우: 세대주 승계 vs 세대 전체 제적 선택 */}
        {isMultiMemberHead && (
          <Box
            sx={{
              p: 2.5,
              mb: 2.5,
              backgroundColor: "#fefce8",
              borderRadius: "14px",
              border: "1.5px solid #fef08a",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <SupervisorAccountIcon sx={{ color: "#ca8a04", fontSize: "1.3rem" }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#854d0e" }}>
                세대주 제적 시 가구 처리 옵션 선택
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#713f12", mb: 2, fontSize: "0.83rem", lineHeight: 1.5 }}>
              현재 세대에 남아있는 가족 <strong>{familyMembers.length}명</strong>이 있습니다.
              세대 전체를 함께 제적할지, 다른 가족에게 세대주를 승계시킬지 선택해 주세요.
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={headActionChoice}
                onChange={(e) => setHeadActionChoice(e.target.value)}
              >
                {/* 옵션 1: 세대주 승계 */}
                <Box
                  sx={{
                    p: 1.5,
                    mb: 1.5,
                    borderRadius: "10px",
                    backgroundColor: headActionChoice === "transfer" ? "#ffffff" : "transparent",
                    border: headActionChoice === "transfer" ? "1.5px solid #eab308" : "1px solid #fef08a",
                    transition: "all 0.15s ease",
                  }}
                >
                  <FormControlLabel
                    value="transfer"
                    control={<Radio size="small" sx={{ color: "#ca8a04", "&.Mui-checked": { color: "#ca8a04" } }} />}
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                          남은 가족에게 세대주 승계 (권장)
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          현재 세대주만 제적 처리되며, 지정한 가족이 새 세대주가 됩니다.
                        </Typography>
                      </Box>
                    }
                  />

                  {headActionChoice === "transfer" && (
                    <Box sx={{ mt: 1.5, pl: 3.8 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="successor-select-label">새 세대주 선택</InputLabel>
                        <Select
                          labelId="successor-select-label"
                          value={successorId}
                          label="새 세대주 선택"
                          onChange={(e) => setSuccessorId(e.target.value)}
                          sx={{ backgroundColor: "#f8fafc", borderRadius: "8px" }}
                        >
                          {familyMembers.map((m) => (
                            <MenuItem key={m.id} value={m.id}>
                              <strong>{m.name}</strong> ({getRelationshipLabel(m.relationship)})
                              {m.phone ? ` - ${formatPhoneNumber(m.phone)}` : ""}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  )}
                </Box>

                {/* 옵션 2: 세대 전체 함께 제적 */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "10px",
                    backgroundColor: headActionChoice === "cascade" ? "#ffffff" : "transparent",
                    border: headActionChoice === "cascade" ? "1.5px solid #ef4444" : "1px solid #fef08a",
                    transition: "all 0.15s ease",
                  }}
                >
                  <FormControlLabel
                    value="cascade"
                    control={<Radio size="small" sx={{ color: "#dc2626", "&.Mui-checked": { color: "#dc2626" } }} />}
                    label={
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                          <GroupRemoveIcon sx={{ fontSize: "1.1rem", color: "#dc2626" }} />
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#991b1b" }}>
                            세대 전체 함께 제적 (가족 전원 제적)
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          가족 전체 이주/이명 시 권장:{" "}
                          {familyMembers.map((m) => `${m.name}(${getRelationshipLabel(m.relationship)})`).join(", ")}{" "}
                          포함 총 {familyMembers.length + 1}명이 일괄 제적 처리됩니다.
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </RadioGroup>
            </FormControl>
          </Box>
        )}

        <Box
          sx={{
            p: 2,
            backgroundColor: "#fff7ed",
            borderRadius: "12px",
            border: "1px solid #ffedd5",
            mb: 1.5,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#c2410c", mb: 0.5 }}>
            💡 온교회 권장: 제적(REMOVED) 처리
          </Typography>
          <Typography variant="caption" sx={{ color: "#7c2d12", display: "block" }}>
            이명, 이주 등으로 교회를 떠난 경우 제적 처리하면 활동 교인 목록에서 제외되며,
            추후 재등록이나 과거 이력 조회가 안전하게 보존됩니다.
          </Typography>
        </Box>

        <Box
          sx={{
            p: 1.5,
            backgroundColor: "rgba(220, 38, 38, 0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(220, 38, 38, 0.2)",
          }}
        >
          <Typography variant="caption" sx={{ color: "#b91c1c", display: "block", fontWeight: 600 }}>
            ⚠️ 영구 삭제: 교적부에서 완전히 삭제되며, 복구가 불가능합니다.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: "space-between" }}>
        <Button onClick={onClose} disabled={deleting} sx={{ color: "#666", fontWeight: 600 }}>
          취소
        </Button>

        <Stack direction="row" spacing={1.5}>
          <Button
            onClick={handleRemove}
            variant="outlined"
            disabled={deleting}
            startIcon={<PersonOffOutlinedIcon />}
            sx={{
              color: "#ea580c",
              borderColor: "#ea580c",
              "&:hover": { borderColor: "#c2410c", backgroundColor: "rgba(234, 88, 12, 0.08)" },
              borderRadius: "10px",
              fontWeight: 700,
            }}
          >
            {isMultiMemberHead && headActionChoice === "cascade"
              ? "세대 전체 제적"
              : isMultiMemberHead
              ? "세대주 승계 및 제적"
              : "제적 처리"}
          </Button>

          <Button
            onClick={handlePermanentDelete}
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={18} color="inherit" /> : <DeleteOutlineIcon />}
            sx={{
              backgroundColor: "#dc2626",
              "&:hover": { backgroundColor: "#b91c1c" },
              borderRadius: "10px",
              fontWeight: 700,
            }}
          >
            {deleting ? "처리 중..." : "영구 삭제"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.object,
  familyMembers: PropTypes.array,
  deleting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirmRemoveStatus: PropTypes.func.isRequired,
  onConfirmPermanentDelete: PropTypes.func.isRequired,
};

export default DeleteConfirmModal;
