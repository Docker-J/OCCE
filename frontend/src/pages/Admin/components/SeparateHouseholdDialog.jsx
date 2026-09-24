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
  Chip,
  InputAdornment,
} from "@mui/material";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AddressAutocompleteInput from "./AddressAutocompleteInput";

const DEPARTMENT_OPTIONS = [
  "장년부",
  "청년부",
  "중고등부",
  "유초등부",
  "유아유치부",
];

export default function SeparateHouseholdDialog({
  open,
  targetMember,
  onClose,
  onConfirm,
  availableGardens = [],
  initialHouseholdData = {},
}) {
  const [separateForm, setSeparateForm] = useState({
    gardenId: 1,
    department: "청년부",
    address: "",
    addressDetail: "",
    city: "Edmonton",
    province: "AB",
    postalCode: "",
    notes: "",
  });
  const [isAddressManualEdit, setIsAddressManualEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && targetMember) {
      setIsAddressManualEdit(false);
      setSeparateForm({
        gardenId: initialHouseholdData.gardenId || availableGardens[0]?.id || 1,
        department:
          targetMember.department === "유초등부" || targetMember.department === "중고등부"
            ? "청년부"
            : targetMember.department || "청년부",
        address: initialHouseholdData.address || "",
        addressDetail: "",
        city: initialHouseholdData.city || "Edmonton",
        province: initialHouseholdData.province || "AB",
        postalCode: initialHouseholdData.postalCode || "",
        notes: "",
      });
    }
  }, [open, targetMember, initialHouseholdData, availableGardens]);

  const handleSubmit = async () => {
    if (!targetMember || !onConfirm) return;
    try {
      setSubmitting(true);
      const payload = {
        name: targetMember.name,
        householdName: `${(targetMember.name || "교인").trim()} 성도 가정`,
        gardenId: separateForm.gardenId,
        department: separateForm.department,
        address: separateForm.address,
        addressDetail: separateForm.addressDetail,
        city: separateForm.city,
        province: separateForm.province,
        postalCode: separateForm.postalCode,
        householdNotes: separateForm.notes,
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
        <HomeWorkOutlinedIcon sx={{ color: "#2563eb", fontSize: "1.6rem" }} />
        [{targetMember?.name}] 성도 세대 독립(분가) 설정
      </DialogTitle>
      <DialogContent dividers sx={{ py: 2.5 }}>
        <Typography variant="body2" sx={{ color: "#475569", mb: 2.5, lineHeight: 1.5 }}>
          현재 세대에서 분리하여, <strong>[{targetMember?.name}]</strong> 성도를 독립된 신규 세대주로 등록합니다. 새로운 거주지 주소와 소속 정원을 지정해 주세요.
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="sep-garden-label">소속 정원</InputLabel>
              <Select
                labelId="sep-garden-label"
                value={separateForm.gardenId}
                label="소속 정원"
                onChange={(e) => setSeparateForm((prev) => ({ ...prev, gardenId: e.target.value }))}
                sx={{ borderRadius: "10px" }}
              >
                {availableGardens.map((g) => (
                  <MenuItem key={g.id || g.name} value={g.id || g.name}>
                    {g.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="sep-dept-label">소속 부서</InputLabel>
              <Select
                labelId="sep-dept-label"
                value={separateForm.department}
                label="소속 부서"
                onChange={(e) => setSeparateForm((prev) => ({ ...prev, department: e.target.value }))}
                sx={{ borderRadius: "10px" }}
              >
                {DEPARTMENT_OPTIONS.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={12}>
            <AddressAutocompleteInput
              onAddressSelect={({ address, city, province, postalCode }) => {
                setSeparateForm((prev) => ({
                  ...prev,
                  address: address || prev.address,
                  city: city || prev.city,
                  province: province || prev.province,
                  postalCode: postalCode || prev.postalCode,
                }));
                setIsAddressManualEdit(false);
              }}
              placeholder="새 거주 주소 검색 (이사/분가한 경우)"
            />
          </Grid>

          {/* 기본 도로명 주소 (Street Address) */}
          <Grid size={12}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.6 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", fontSize: "0.82rem" }}>
                기본 도로명 주소 (Street Address)
              </Typography>
              {separateForm.address ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  {!isAddressManualEdit ? (
                    <>
                      <Chip
                        size="small"
                        label="공인 주소"
                        color="success"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.68rem", fontWeight: 700 }}
                      />
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => setIsAddressManualEdit(true)}
                        sx={{ fontSize: "0.75rem", p: 0, minWidth: "auto", fontWeight: 700, color: "#2563eb" }}
                      >
                        직접 수정
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      color="warning"
                      onClick={() => setIsAddressManualEdit(false)}
                      sx={{ fontSize: "0.72rem", py: 0.2, px: 1, minWidth: "auto", fontWeight: 700, borderRadius: "6px" }}
                    >
                      수정 완료
                    </Button>
                  )}
                </Box>
              ) : null}
            </Box>
            <TextField
              fullWidth
              size="small"
              placeholder="상단 검색창에서 주소를 검색하여 선택하면 자동 입력됩니다"
              value={separateForm.address}
              onChange={(e) => setSeparateForm((prev) => ({ ...prev, address: e.target.value }))}
              slotProps={{
                input: {
                  readOnly: !isAddressManualEdit,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlinedIcon sx={{ color: separateForm.address ? "#16a34a" : "#94a3b8", fontSize: "1.2rem" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                backgroundColor: isAddressManualEdit ? "#fff" : "#f8fafc",
                "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              }}
            />
          </Grid>

          {/* 동/호수 상세 주소 */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="동/호수/유닛 (Unit/Apt)"
              placeholder="예: Apt 301"
              value={separateForm.addressDetail}
              onChange={(e) => setSeparateForm((prev) => ({ ...prev, addressDetail: e.target.value }))}
              sx={{
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              }}
            />
          </Grid>

          {/* 도시 (City) */}
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="도시 (City)"
              value={separateForm.city}
              onChange={(e) => setSeparateForm((prev) => ({ ...prev, city: e.target.value }))}
              slotProps={{ input: { readOnly: !isAddressManualEdit } }}
              sx={{
                backgroundColor: isAddressManualEdit ? "#fff" : "#f8fafc",
                "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              }}
            />
          </Grid>

          {/* 주 (Province) */}
          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="주 (Province)"
              value={separateForm.province}
              onChange={(e) => setSeparateForm((prev) => ({ ...prev, province: e.target.value }))}
              slotProps={{ input: { readOnly: !isAddressManualEdit } }}
              sx={{
                backgroundColor: isAddressManualEdit ? "#fff" : "#f8fafc",
                "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              }}
            />
          </Grid>

          {/* 우편번호 */}
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="우편번호 (Postal Code)"
              placeholder="예: T6W 0A1"
              value={separateForm.postalCode}
              onChange={(e) => setSeparateForm((prev) => ({ ...prev, postalCode: e.target.value.toUpperCase() }))}
              slotProps={{ input: { readOnly: !isAddressManualEdit } }}
              sx={{
                backgroundColor: isAddressManualEdit ? "#fff" : "#f8fafc",
                "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={submitting} sx={{ color: "#64748b", borderRadius: "10px" }}>
          취소
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{
            borderRadius: "10px",
            backgroundColor: "#2563eb",
            fontWeight: 800,
            px: 3,
          }}
        >
          {submitting ? "처리 중..." : "분가 확정하기"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SeparateHouseholdDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  targetMember: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  availableGardens: PropTypes.array,
  initialHouseholdData: PropTypes.object,
};
