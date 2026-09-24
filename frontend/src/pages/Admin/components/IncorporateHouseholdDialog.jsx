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
import GroupAddIcon from "@mui/icons-material/GroupAdd";

const TRANSFER_RELATIONSHIP_OPTIONS = [
  { value: "SPOUSE", label: "배우자 (결혼)" },
  { value: "CHILD", label: "자녀" },
  { value: "PARENT", label: "부모" },
  { value: "OTHER", label: "기타 (동거인/친족)" },
];

export default function IncorporateHouseholdDialog({
  open,
  onClose,
  onConfirm,
  currentHouseholdSummary = "",
  candidateMembers = [],
}) {
  const [incorporateForm, setIncorporateForm] = useState({
    memberId: "",
    relationship: "SPOUSE",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setIncorporateForm({
        memberId: "",
        relationship: "SPOUSE",
      });
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!incorporateForm.memberId || !onConfirm) return;
    try {
      setSubmitting(true);
      await onConfirm(incorporateForm.memberId, {
        relationship: incorporateForm.relationship,
      });
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
        <GroupAddIcon sx={{ color: "#2563eb", fontSize: "1.6rem" }} />
        기존 등록 교인 세대 편입
      </DialogTitle>
      <DialogContent dividers sx={{ py: 2.5 }}>
        <Box sx={{ mb: 2.5, p: 2, backgroundColor: "#eff6ff", borderRadius: "12px", border: "1px solid #bfdbfe" }}>
          <Typography variant="body2" sx={{ color: "#1e40af", fontWeight: 700 }}>
            현재 대상 세대: {currentHouseholdSummary || "가구"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#3b82f6", display: "block", mt: 0.5, lineHeight: 1.4 }}>
            결혼 또는 합가로 교적에 이미 등록되어 있는 교인을 이 세대로 불러와 합칩니다.
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {/* 편입할 교인 검색 및 선택 */}
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              options={candidateMembers}
              getOptionLabel={(option) => {
                const dept = option.department || "부서미정";
                const pos = option.position || "성도";
                const phoneStr = option.phone ? ` · ${option.phone}` : "";
                const currentHead = option.headName ? ` (현재: ${option.headName} 세대)` : "";
                return `${option.name} [${dept} / ${pos}${phoneStr}]${currentHead}`;
              }}
              onChange={(_, val) => {
                setIncorporateForm((prev) => ({
                  ...prev,
                  memberId: val?.id || "",
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  size="small"
                  label="편입할 교인 검색 및 선택"
                  placeholder="성명, 부서, 연락처 등으로 검색..."
                  helperText="이 세대로 합류할 등록 교인을 선택하세요."
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              )}
            />
          </Grid>

          {/* 현재 세대에서의 관계 */}
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="incorp-rel-label">이 가구에서의 관계</InputLabel>
              <Select
                labelId="incorp-rel-label"
                value={incorporateForm.relationship}
                label="이 가구에서의 관계"
                onChange={(e) => setIncorporateForm((prev) => ({ ...prev, relationship: e.target.value }))}
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

          <Grid size={{ xs: 12 }}>
            <Box sx={{ p: 2, backgroundColor: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <Typography variant="caption" sx={{ color: "#64748b", display: "block", lineHeight: 1.5 }}>
                💡 편입된 교인은 현재 세대의 주소와 소속 정원을 함께 사용하게 되며, 기존에 1인 단독 가구였던 경우 이전 빈 가구는 자동으로 삭제 정리됩니다.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={submitting} sx={{ color: "#64748b", borderRadius: "10px" }}>
          취소
        </Button>
        <Button
          variant="contained"
          disabled={!incorporateForm.memberId || submitting}
          onClick={handleSubmit}
          sx={{
            borderRadius: "10px",
            backgroundColor: "#2563eb",
            fontWeight: 800,
            px: 3,
          }}
        >
          {submitting ? "처리 중..." : "이 세대로 편입하기"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

IncorporateHouseholdDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  currentHouseholdSummary: PropTypes.string,
  candidateMembers: PropTypes.array,
};
