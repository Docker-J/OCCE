import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

const TRANSFER_RELATIONSHIP_OPTIONS = [
  { value: "SPOUSE", label: "배우자 (결혼)" },
  { value: "CHILD", label: "자녀" },
  { value: "PARENT", label: "부모" },
  { value: "OTHER", label: "기타 (동거인/친족)" },
];

const RELATIONSHIP_OPTIONS = [
  { value: "HEAD", label: "세대주 (본인)" },
  { value: "SPOUSE", label: "배우자" },
  { value: "CHILD", label: "자녀" },
  { value: "PARENT", label: "부모" },
  { value: "OTHER", label: "기타 (동거인/친족)" },
];

export default function TransferHouseholdDialog({
  open,
  targetMember,
  onClose,
  onConfirm,
  candidateHouseholds = [],
  remainingMembers = [],
}) {
  const [transferForm, setTransferForm] = useState({
    destHouseholdId: "",
    relationship: "SPOUSE",
    successorMemberId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && targetMember) {
      setTransferForm({
        destHouseholdId: "",
        relationship: "SPOUSE",
        successorMemberId: remainingMembers[0]?.id || "",
      });
    }
  }, [open, targetMember, remainingMembers]);

  const handleSubmit = async () => {
    if (!targetMember || !onConfirm || !transferForm.destHouseholdId) return;
    try {
      setSubmitting(true);
      const payload = {
        name: targetMember.name,
        transferTargetHouseholdId: transferForm.destHouseholdId,
        relationship: transferForm.relationship,
        successorMemberId: targetMember.isHead ? transferForm.successorMemberId : undefined,
      };
      await onConfirm(targetMember.id, payload);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: "18px", p: 1 },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: "#1e40af", display: "flex", alignItems: "center", gap: 1 }}>
        <SwapHorizIcon sx={{ color: "#2563eb", fontSize: "1.6rem" }} />
        [{targetMember?.name}] 성도 다른 세대로 편입 (결혼/합가)
      </DialogTitle>
      <DialogContent dividers sx={{ py: 2.5 }}>
        <Box sx={{ mb: 2.5, p: 2, backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <Typography variant="body2" sx={{ color: "#334155", fontWeight: 600 }}>
            대상 교인: <span style={{ color: "#2563eb", fontWeight: 800 }}>{targetMember?.name}</span>
            {targetMember?.department ? ` (${targetMember.department})` : ""}
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748b", display: "block", mt: 0.5, lineHeight: 1.4 }}>
            결혼이나 합가 등으로 교인을 다른 가구로 이동시킵니다. 이동 후 대상 세대의 구성원으로 등록되며 대상 세대의 주소와 정원을 공유합니다.
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {/* 편입할 대상 세대 선택 */}
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              options={candidateHouseholds}
              getOptionLabel={(option) => {
                const headPart = option.headName ? `${option.headName} 세대` : "";
                const addrPart = option.address ? ` - ${[option.addressDetail, option.address].filter(Boolean).join(", ")}` : "";
                const gardenPart = option.gardenName ? ` [${option.gardenName}]` : "";
                return `${headPart || option.address || "세대"}${gardenPart}${addrPart}`;
              }}
              onChange={(_, val) => {
                setTransferForm((prev) => ({
                  ...prev,
                  destHouseholdId: val?.id || "",
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  size="small"
                  label="편입할 대상 세대 검색 및 선택"
                  placeholder="세대주 성명 또는 주소로 검색..."
                  helperText="교인이 합류할 기존 가구를 선택하세요."
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              )}
            />
          </Grid>

          {/* 새 세대에서의 관계 */}
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="transfer-rel-label">새 가구에서의 관계</InputLabel>
              <Select
                labelId="transfer-rel-label"
                value={transferForm.relationship}
                label="새 가구에서의 관계"
                onChange={(e) => setTransferForm((prev) => ({ ...prev, relationship: e.target.value }))}
                sx={{ borderRadius: "10px" }}
              >
                {TRANSFER_RELATIONSHIP_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* 세대주일 경우: 세대주 승계 후속자 지정 또는 1인 세대 안내 */}
          {targetMember?.isHead && (
            <Grid size={{ xs: 12 }}>
              {remainingMembers.length > 0 ? (
                <Box sx={{ p: 2, backgroundColor: "#fffbeb", borderRadius: "10px", border: "1px solid #fde68a" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#b45309", mb: 0.5 }}>
                    세대주 승계 안내
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#78350f", mb: 1.5, fontSize: "0.82rem" }}>
                    현재 교인은 기존 세대의 세대주입니다. 기존 세대에 남는 구성원 중 새로운 세대주를 지정해 주세요.
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel id="successor-select-label">새 세대주 선택</InputLabel>
                    <Select
                      labelId="successor-select-label"
                      value={transferForm.successorMemberId}
                      label="새 세대주 선택"
                      onChange={(e) => setTransferForm((prev) => ({ ...prev, successorMemberId: e.target.value }))}
                      sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
                    >
                      {remainingMembers.map((m) => (
                        <MenuItem key={m.id} value={m.id}>
                          {m.name} ({RELATIONSHIP_OPTIONS.find((r) => r.value === m.relationship)?.label || "세대원"})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ) : (
                <Box sx={{ p: 2, backgroundColor: "#f0fdf4", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#166534", mb: 0.5 }}>
                    1인 단독 세대 안내
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#15803d", fontSize: "0.82rem" }}>
                    현재 교인은 1인 단독 가구의 세대주입니다. 다른 세대로 편입 완료 시 기존 빈 가구는 자동으로 삭제 정리됩니다.
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={submitting} sx={{ color: "#64748b", borderRadius: "10px" }}>
          취소
        </Button>
        <Button
          variant="contained"
          disabled={!transferForm.destHouseholdId || submitting}
          onClick={handleSubmit}
          sx={{
            borderRadius: "10px",
            backgroundColor: "#2563eb",
            fontWeight: 800,
            px: 3,
          }}
        >
          {submitting ? "처리 중..." : "편입 확정하기"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

TransferHouseholdDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  targetMember: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  candidateHouseholds: PropTypes.array,
  remainingMembers: PropTypes.array,
};
