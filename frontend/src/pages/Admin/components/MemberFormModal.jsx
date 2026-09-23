/**
 * @file MemberFormModal.jsx
 * @description 교인 신규 등록 및 정보 수정 통합 모달
 * Google Places Autocomplete를 통한 세대 주소 자동완성 지원
 */

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
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  CircularProgress,
  Divider,
  Paper,
  Autocomplete,
  Chip,
  InputAdornment,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AddressAutocompleteInput from "./AddressAutocompleteInput";
import { PatternFormat } from "react-number-format";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parseISO, isValid } from "date-fns";
import { GatheringDateButtonField } from "../../Community/GatheringPickerFields";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { getMemberCourses } from "../../../api/admin";

const RELATIONSHIP_OPTIONS = [
  { value: "HEAD", label: "세대주 (본인)" },
  { value: "SPOUSE", label: "배우자" },
  { value: "CHILD", label: "자녀" },
  { value: "PARENT", label: "부모" },
  { value: "OTHER", label: "기타 (동거인/친족)" },
];

const BAPTISM_OPTIONS = [
  { value: "BAPTIZED", label: "세례" },
  { value: "INFANT", label: "유아세례" },
  { value: "CONFIRMATION", label: "입교" },
  { value: "NONE", label: "미세례 (학습)" },
];

const DEPARTMENT_OPTIONS = [
  "장년부",
  "청년부",
  "중고등부",
  "유초등부",
  "유치부",
];

const POSITION_OPTIONS = [
  "성도",
  "교역자",
  "간사",
  "선교사",
];

const MemberFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  availableGardens = [],
  availableHouseholds = [],
  isSubmitting = false,
}) => {
  const isEdit = Boolean(initialData?.id);

  // Household type selection for create mode: 'new' or 'existing'
  const [householdMode, setHouseholdMode] = useState("new");
  const [isAddressManualEdit, setIsAddressManualEdit] = useState(false);
  const [isSeparateMode, setIsSeparateMode] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    // Member fields
    name: "",
    nameEn: "",
    relationship: "HEAD",
    isHead: true,
    phone: "",
    birthDate: "",
    gender: "M",
    position: "성도",
    department: "장년부",
    baptismStatus: "NONE",
    registrationDate: new Date().toISOString().slice(0, 10),
    status: "ACTIVE",
    // Household fields
    householdId: "",
    householdName: "",
    gardenId: 1,
    address: "",
    addressDetail: "",
    city: "Edmonton",
    province: "AB",
    postalCode: "",
    householdNotes: "",
  });

  const [memberCoursesList, setMemberCoursesList] = useState([]);
  const [loadingMemberCourses, setLoadingMemberCourses] = useState(false);

  useEffect(() => {
    setIsAddressManualEdit(false);
    setIsSeparateMode(false);
    if (initialData) {
      if (initialData.id) {
        setLoadingMemberCourses(true);
        getMemberCourses(initialData.id)
          .then((data) => setMemberCoursesList(data.courses || []))
          .catch(() => setMemberCoursesList([]))
          .finally(() => setLoadingMemberCourses(false));
      } else {
        setMemberCoursesList([]);
      }
      setFormData({
        name: initialData.name || "",
        nameEn: initialData.nameEn || "",
        relationship: initialData.relationship || "HEAD",
        isHead: initialData.isHead ?? (initialData.relationship === "HEAD"),
        phone: initialData.phone || "",
        birthDate: initialData.birthDate || "",
        gender: initialData.gender || "M",
        position: initialData.position || "성도",
        department: initialData.department || "장년부",
        baptismStatus: initialData.baptismStatus || "NONE",
        registrationDate: initialData.registrationDate || "",
        status: initialData.status === "REMOVED" ? "REMOVED" : "ACTIVE",
        householdId: initialData.householdId || "",
        householdName: initialData.householdName || "",
        gardenId: initialData.gardenId || 1,
        address: initialData.address || "",
        addressDetail: initialData.addressDetail || "",
        city: initialData.city || "Edmonton",
        province: initialData.province || "AB",
        postalCode: initialData.postalCode || "",
        householdNotes: initialData.householdNotes || "",
      });
      setHouseholdMode("existing");
    } else {
      setFormData({
        name: "",
        relationship: "HEAD",
        isHead: true,
        phone: "",
        birthDate: "",
        gender: "M",
        position: "성도",
        department: "장년부",
        baptismStatus: "NONE",
        registrationDate: new Date().toISOString().slice(0, 10),
        status: "ACTIVE",
        householdId: "",
        householdName: "",
        gardenId: availableGardens[0]?.id || 1,
        address: "",
        addressDetail: "",
        city: "Edmonton",
        province: "AB",
        postalCode: "",
        householdNotes: "",
      });
      setHouseholdMode("new");
    }
  }, [initialData, open, availableGardens]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-adjust isHead when relationship changes
      if (field === "relationship") {
        next.isHead = value === "HEAD";
      }
      // 청년은 정원(새벽, 나라)으로 구분하여 자동 반영
      if (field === "gardenId") {
        const foundG = availableGardens.find((g) => g.id === value || String(g.id) === String(value));
        const gName = foundG?.name || "";
        if (gName === "새벽" || gName === "나라") {
          if (prev.department === "장년부") {
            next.department = "청년부";
          }
        }
      }
      return next;
    });
  };

  const handleHouseholdSelect = (selectedId) => {
    const found = availableHouseholds.find((h) => String(h.id) === String(selectedId));
    if (found) {
      const gName = found.gardenName || (availableGardens.find((g) => g.id === found.gardenId)?.name) || "";
      const isYoungAdult = gName === "새벽" || gName === "나라";

      setFormData((prev) => ({
        ...prev,
        householdId: found.id,
        householdName: found.householdName,
        gardenId: found.gardenId || prev.gardenId,
        department: isYoungAdult && prev.department === "장년부" ? "청년부" : prev.department,
        address: found.address || "",
        addressDetail: found.addressDetail || "",
        city: found.city || "Edmonton",
        province: found.province || "AB",
        postalCode: found.postalCode || "",
      }));
    }
  };

  const handleAddressSelect = ({ address, city, province, postalCode }) => {
    setFormData((prev) => ({
      ...prev,
      address: address || prev.address,
      city: city || prev.city || "Edmonton",
      province: province || prev.province || "AB",
      postalCode: postalCode || prev.postalCode,
    }));
    setIsAddressManualEdit(false);
  };

  const handleStartIndependence = () => {
    setIsSeparateMode(true);
    setFormData((prev) => ({
      ...prev,
      relationship: "HEAD",
      isHead: true,
      householdName: `${(prev.name || initialData?.name || "").trim()} 성도 가정`,
      department:
        prev.department === "유초등부" || prev.department === "중고등부"
          ? "청년부"
          : prev.department,
    }));
  };

  const handleCancelIndependence = () => {
    setIsSeparateMode(false);
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        relationship: initialData.relationship || "CHILD",
        isHead: false,
        householdId: initialData.householdId || "",
        householdName: initialData.householdName || "",
        gardenId: initialData.gardenId || 1,
        address: initialData.address || "",
        addressDetail: initialData.addressDetail || "",
        city: initialData.city || "Edmonton",
        province: initialData.province || "AB",
        postalCode: initialData.postalCode || "",
        householdNotes: initialData.householdNotes || "",
        department: initialData.department || "장년부",
      }));
    }
  };

  const handleSubmit = (e) => {
    if (e) {
      if (typeof e.preventDefault === "function") e.preventDefault();
      if (typeof e.stopPropagation === "function") e.stopPropagation();
    }
    console.log("[MemberFormModal] handleSubmit invoked, formData:", formData);

    if (!formData.name || !formData.name.trim()) {
      alert("교인 성명(한글)은 필수 입력 항목입니다.");
      return;
    }

    const payload = {
      ...formData,
      isHead: formData.relationship === "HEAD",
      isNewHousehold: !isEdit && householdMode === "new",
      isSeparateHousehold: Boolean(isEdit && isSeparateMode),
      householdName:
        (!isEdit && householdMode === "new") || isSeparateMode
          ? `${formData.name.trim()} 성도 가정`
          : (formData.householdName || `${formData.name.trim()} 성도 가정`),
    };

    console.log("[MemberFormModal] Submitting payload:", payload);
    onSubmit(payload);
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      disableEnforceFocus
      disableRestoreFocus
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit,
          noValidate: true,
          autoComplete: "off",
          sx: {
            borderRadius: "20px",
            maxWidth: "960px",
            width: "100%",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        },
      }}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        noValidate: true,
        autoComplete: "off",
        sx: {
          borderRadius: "20px",
          maxWidth: "960px",
          width: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DialogTitle sx={{ pb: 1, px: 3, pt: 2.5, display: "flex", alignItems: "center", gap: 1.2, flexShrink: 0 }}>
        {isEdit ? (
          <EditNoteIcon sx={{ color: "#ea580c", fontSize: "1.8rem" }} />
        ) : (
          <PersonAddAlt1Icon sx={{ color: "#2563eb", fontSize: "1.8rem" }} />
        )}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#111" }}>
            {isEdit ? "교인 정보 및 세대 주소 수정" : "새 교인 및 세대 등록"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#666" }}>
            {isEdit
              ? `${formData.name || "교인"}님의 인적사항 및 세대 주소를 수정합니다.`
              : "온교회 교적부에 새 성도와 세대 정보를 등록합니다."}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2.5, px: 3, overflowY: "auto", flex: "1 1 auto" }}>
        {/* 1. 세대(가구) 및 거주 주소 정보 섹션 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <HomeOutlinedIcon sx={{ color: "#ea580c", fontSize: "1.3rem" }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#222" }}>
              1. 세대(가구) 및 거주 주소 정보
            </Typography>
          </Box>

          {/* 자녀/세대원 수정 시: 세대 독립 (분가) 안내 배너 카드 */}
          {isEdit && initialData && !initialData.isHead && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2.5,
                borderRadius: "14px",
                backgroundColor: isSeparateMode ? "#f0fdf4" : "#eff6ff",
                border: isSeparateMode ? "1.5px solid #86efac" : "1.5px solid #bfdbfe",
                transition: "all 0.2s ease",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
                <Box sx={{ flex: 1, minWidth: 260 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <HomeWorkOutlinedIcon sx={{ color: isSeparateMode ? "#16a34a" : "#2563eb", fontSize: "1.3rem" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isSeparateMode ? "#166534" : "#1e40af" }}>
                      {isSeparateMode ? "✓ 세대 독립(분가) 모드 설정됨" : "세대 독립 (새 가구로 분가)"}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: isSeparateMode ? "#15803d" : "#3b82f6", display: "block", mt: 0.4, lineHeight: 1.4 }}>
                    {isSeparateMode
                      ? `저장 시 [${formData.householdName || `${formData.name} 성도 가정`}]의 세대주로 신규 분가됩니다. 아래에서 거주 주소 및 사역 부서(청년부 등)를 설정할 수 있습니다.`
                      : `현재 [${initialData.householdName || "기존 가구"}]의 ${initialData.relationship === "CHILD" ? "자녀" : "세대원"}로 등록되어 있습니다. 청년 독립 또는 결혼으로 분가하려면 버튼을 누르세요.`}
                  </Typography>
                </Box>

                {isSeparateMode ? (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleCancelIndependence}
                    sx={{
                      borderRadius: "10px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#475569",
                      borderColor: "#cbd5e1",
                      backgroundColor: "#fff",
                      "&:hover": { backgroundColor: "#f8fafc", borderColor: "#94a3b8" },
                    }}
                  >
                    분가 취소 (기존 세대 유지)
                  </Button>
                ) : (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleStartIndependence}
                    sx={{
                      borderRadius: "10px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      backgroundColor: "#2563eb",
                      "&:hover": { backgroundColor: "#1d4ed8" },
                    }}
                  >
                    새 세대로 분가하기
                  </Button>
                )}
              </Box>
            </Paper>
          )}

          {!isEdit && (
            <Box sx={{ mb: 2 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: "0.82rem", fontWeight: 600 }}>
                  세대 배정 방식
                </FormLabel>
                <RadioGroup
                  row
                  value={householdMode}
                  onChange={(e) => setHouseholdMode(e.target.value)}
                >
                  <FormControlLabel
                    value="new"
                    control={<Radio size="small" />}
                    label="새로운 세대(가구) 생성"
                  />
                  <FormControlLabel
                    value="existing"
                    control={<Radio size="small" />}
                    label="기존 등록된 세대에 추가 (가족 편입)"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          )}

          {!isEdit && householdMode === "existing" && (
            <Box sx={{ mb: 2.5 }}>
              <Autocomplete
                fullWidth
                size="small"
                options={availableHouseholds}
                value={
                  availableHouseholds.find((h) => String(h.id) === String(formData.householdId)) || null
                }
                onChange={(event, selected) => {
                  if (selected) {
                    handleHouseholdSelect(selected.id);
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      householdId: "",
                      householdName: "",
                      address: "",
                      addressDetail: "",
                      postalCode: "",
                    }));
                  }
                }}
                getOptionLabel={(option) => {
                  if (typeof option === "string") return option;
                  return option.householdName || "";
                }}
                filterOptions={(options, state) => {
                  const q = state.inputValue.trim().toLowerCase();
                  if (!q) return options;
                  return options.filter((h) => {
                    const nameMatch = (h.householdName || "").toLowerCase().includes(q);
                    const addrMatch = (h.address || "").toLowerCase().includes(q);
                    const gardenMatch = (h.gardenName || "").toLowerCase().includes(q);
                    return nameMatch || addrMatch || gardenMatch;
                  });
                }}
                isOptionEqualToValue={(option, val) => String(option.id) === String(val?.id)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="소속될 기존 세대 검색 및 선택 (이름, 주소, 정원으로 검색)"
                    placeholder="세대명(예: 김철수 성도 가정), 주소, 또는 정원명으로 검색"
                    slotProps={{
                      ...params.slotProps,
                      htmlInput: {
                        ...params.slotProps?.htmlInput,
                        autoComplete: "off",
                      },
                    }}
                    sx={{
                      backgroundColor: "#fff",
                      "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  return (
                    <Box
                      key={key || option.id}
                      component="li"
                      {...optionProps}
                      sx={{
                        py: 1.2,
                        px: 2,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                        "&:last-child": { borderBottom: "none" },
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.3 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#111" }}>
                            {option.householdName}
                          </Typography>
                          {option.gardenName && (
                            <Chip
                              size="small"
                              label={option.gardenName}
                              sx={{
                                height: 20,
                                fontSize: "0.72rem",
                                backgroundColor: "#f0fdf4",
                                color: "#166534",
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Box>
                        {option.address && (
                          <Typography variant="caption" sx={{ color: "#666", display: "block" }}>
                            📍 {option.address} {option.addressDetail || ""} {option.postalCode ? `(${option.postalCode})` : ""}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                }}
                slotProps={{
                  popper: {
                    sx: {
                      zIndex: 1500,
                      "& .MuiAutocomplete-paper": {
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                        border: "1px solid rgba(0,0,0,0.08)",
                        mt: 1,
                      },
                      "& .MuiAutocomplete-listbox": {
                        maxHeight: "320px",
                        py: 0.5,
                      },
                    },
                  },
                }}
              />

              {/* 선택된 세대 미리보기 정보 카드 */}
              {formData.householdId && (
                <Paper
                  elevation={0}
                  sx={{
                    mt: 1.5,
                    p: 2,
                    borderRadius: "12px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#2563eb", fontWeight: 700, display: "block", mb: 0.5 }}>
                    ✓ 소속 확정 세대 정보
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    {formData.householdName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block", mt: 0.3 }}>
                    {formData.address
                      ? `거주 주소: ${formData.address} ${formData.addressDetail ? `${formData.addressDetail}, ` : ""}${formData.city || "Edmonton"}, ${formData.province || "AB"} ${formData.postalCode || ""}`
                      : "등록된 주소 없음"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#ea580c", display: "block", mt: 0.5, fontWeight: 500 }}>
                    ※ 해당 세대의 거주 주소 및 정원으로 자동 편입됩니다.
                  </Typography>
                </Paper>
              )}
            </Box>
          )}

            {(householdMode === "new" || isEdit) && (
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: "14px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  backgroundColor: "#fafafa",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <Grid container spacing={2}>
                  {/* 소속 정원 */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small" sx={{ backgroundColor: "#fff" }}>
                      <InputLabel id="modal-garden-label">소속 정원</InputLabel>
                      <Select
                        labelId="modal-garden-label"
                        value={formData.gardenId}
                        label="소속 정원"
                        onChange={(e) => handleChange("gardenId", e.target.value)}
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

                  {/* Google Places 주소 검색 전용 바 */}
                  <Grid size={12}>
                    <AddressAutocompleteInput
                      onAddressSelect={handleAddressSelect}
                      placeholder="도로명이나 번지수를 입력하여 공인 주소 검색 (예: 10405 Jasper Ave)"
                    />
                  </Grid>

                  {/* 자동 입력된 기본 도로명 주소 (Street Address) */}
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      size="medium"
                      label="기본 도로명 주소 (Street Address)"
                      placeholder="상단 검색창에서 주소를 검색하여 선택하면 자동 입력됩니다"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      slotProps={{
                        input: {
                          readOnly: !isAddressManualEdit,
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlinedIcon sx={{ color: formData.address ? "#16a34a" : "#94a3b8" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              {formData.address && !isAddressManualEdit ? (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                  <Chip
                                    size="small"
                                    label="공인 주소"
                                    color="success"
                                    variant="outlined"
                                    sx={{ height: 22, fontSize: "0.72rem", fontWeight: 700 }}
                                  />
                                  <Button
                                    size="small"
                                    variant="text"
                                    onClick={() => setIsAddressManualEdit(true)}
                                    sx={{ fontSize: "0.75rem", minWidth: "auto", px: 1, py: 0.2 }}
                                  >
                                    직접 수정
                                  </Button>
                                </Box>
                              ) : isAddressManualEdit ? (
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={() => setIsAddressManualEdit(false)}
                                  sx={{ fontSize: "0.75rem", minWidth: "auto", px: 1, py: 0.2 }}
                                >
                                  잠금
                                </Button>
                              ) : null}
                            </InputAdornment>
                          ),
                        },
                      }}
                      helperText={
                        !formData.address
                          ? "상단 [공인 주소 검색] 창에 주소를 검색하면 도로명, 도시, 주, 우편번호가 자동 완성됩니다."
                          : isAddressManualEdit
                          ? "직접 수정 모드 활성화됨 (오타에 주의하세요)."
                          : "구글 공인 주소로 안전하게 잠겨 있습니다 (수정이 필요하면 우측 [직접 수정]을 누르세요)."
                      }
                      sx={{
                        backgroundColor: isAddressManualEdit ? "#fff" : "#f8fafc",
                        "& .MuiOutlinedInput-root": { borderRadius: "12px", minHeight: "50px" },
                      }}
                    />
                  </Grid>

                  {/* 상세 호수, 도시, 주(Province), 우편번호 */}
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      size="medium"
                      label="상세 호수 (Unit / Suite #)"
                      placeholder="예: Unit 302, Apt 4B"
                      value={formData.addressDetail}
                      onChange={(e) => handleChange("addressDetail", e.target.value)}
                      sx={{
                        backgroundColor: "#fff",
                        "& .MuiOutlinedInput-root": { borderRadius: "12px", minHeight: "48px" },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                      fullWidth
                      size="medium"
                      label="도시 (City)"
                      placeholder="예: Edmonton"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      slotProps={{
                        input: {
                          readOnly: !isAddressManualEdit,
                        },
                      }}
                      sx={{
                        backgroundColor: isAddressManualEdit ? "#fff" : "#f8fafc",
                        "& .MuiOutlinedInput-root": { borderRadius: "12px", minHeight: "48px" },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                      fullWidth
                      size="medium"
                      label="주 (Province)"
                      placeholder="예: AB"
                      value={formData.province}
                      onChange={(e) => handleChange("province", e.target.value)}
                      slotProps={{
                        input: {
                          readOnly: !isAddressManualEdit,
                        },
                      }}
                      sx={{
                        backgroundColor: isAddressManualEdit ? "#fff" : "#f8fafc",
                        "& .MuiOutlinedInput-root": { borderRadius: "12px", minHeight: "48px" },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                      fullWidth
                      size="medium"
                      label="우편번호 (Postal Code)"
                      placeholder="예: T6W 0A1"
                      value={formData.postalCode}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        handleChange("postalCode", val);
                      }}
                      onBlur={(e) => {
                        const clean = (e.target.value || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
                        if (clean.length === 6) {
                          handleChange("postalCode", `${clean.slice(0, 3)} ${clean.slice(3)}`);
                        }
                      }}
                      slotProps={{
                        input: {
                          readOnly: !isAddressManualEdit,
                        },
                      }}
                      sx={{
                        backgroundColor: isAddressManualEdit ? "#fff" : "#f8fafc",
                        "& .MuiOutlinedInput-root": { borderRadius: "12px", minHeight: "48px" },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Box>

          <Divider sx={{ my: 2.5 }} />

          {/* 2. 교인 개인 인적사항 섹션 */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <BadgeOutlinedIcon sx={{ color: "#2563eb", fontSize: "1.3rem" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#222" }}>
                2. 교인 개인 인적사항
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="성명 (한글)"
                  placeholder="예: 홍길동"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="영문 이름 (English Name)"
                  placeholder="예: Gildong Hong"
                  value={formData.nameEn}
                  onChange={(e) => handleChange("nameEn", e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <PatternFormat
                  customInput={TextField}
                  fullWidth
                  size="small"
                  type="tel"
                  label="휴대전화 번호"
                  value={formData.phone}
                  format="(###) ###-####"
                  mask="_"
                  allowEmptyFormatting={false}
                  placeholder="(780) 123-4567"
                  onValueChange={(values) => {
                    handleChange("phone", values.value ? values.formattedValue : "");
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="relationship-label">세대주와의 가족 관계</InputLabel>
                  <Select
                    labelId="relationship-label"
                    value={formData.relationship}
                    label="세대주와의 가족 관계"
                    onChange={(e) => handleChange("relationship", e.target.value)}
                    sx={{ borderRadius: "10px" }}
                  >
                    {RELATIONSHIP_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <DatePicker
                  label="생년월일"
                  value={
                    formData.birthDate && isValid(parseISO(formData.birthDate))
                      ? parseISO(formData.birthDate)
                      : null
                  }
                  onChange={(newVal) => {
                    handleChange(
                      "birthDate",
                      newVal && isValid(newVal) ? format(newVal, "yyyy-MM-dd") : ""
                    );
                  }}
                  maxDate={new Date()}
                  slots={{
                    field: GatheringDateButtonField,
                  }}
                  slotProps={{
                    field: {
                      label: "생년월일",
                      placeholder: "생년월일 선택",
                      size: "small",
                      showDayOfWeek: false,
                      clearable: true,
                    },
                    popper: {
                      sx: { zIndex: 1400 },
                    },
                    layout: {
                      sx: {
                        ".MuiPickersDay-root.Mui-selected": {
                          backgroundColor: "#ea580c !important",
                          color: "#fff",
                        },
                        ".MuiPickersDay-root.Mui-selected:hover, .MuiPickersDay-root.Mui-selected:focus": {
                          backgroundColor: "#c2410c !important",
                        },
                        ".MuiPickersDay-root.MuiPickersDay-today": {
                          borderColor: "#ea580c !important",
                        },
                        ".MuiPickersCalendarHeader-label": {
                          fontWeight: 700,
                        },
                      },
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="gender-label">성별</InputLabel>
                  <Select
                    labelId="gender-label"
                    value={formData.gender}
                    label="성별"
                    onChange={(e) => handleChange("gender", e.target.value)}
                    sx={{ borderRadius: "10px" }}
                  >
                    <MenuItem value="M">남성 (Male)</MenuItem>
                    <MenuItem value="F">여성 (Female)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2.5 }} />

          {/* 3. 신앙 및 행정 정보 섹션 */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#222", mb: 1.5 }}>
              3. 신앙 및 행정 정보
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="position-label">직분</InputLabel>
                  <Select
                    labelId="position-label"
                    value={formData.position}
                    label="직분"
                    onChange={(e) => handleChange("position", e.target.value)}
                    sx={{ borderRadius: "10px" }}
                  >
                    {POSITION_OPTIONS.map((pos) => (
                      <MenuItem key={pos} value={pos}>
                        {pos}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="department-label">소속 부서</InputLabel>
                  <Select
                    labelId="department-label"
                    value={formData.department}
                    label="소속 부서"
                    onChange={(e) => handleChange("department", e.target.value)}
                    sx={{ borderRadius: "10px" }}
                  >
                    {DEPARTMENT_OPTIONS.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="baptism-label">세례 신분</InputLabel>
                  <Select
                    labelId="baptism-label"
                    value={formData.baptismStatus}
                    label="세례 신분"
                    onChange={(e) => handleChange("baptismStatus", e.target.value)}
                    sx={{ borderRadius: "10px" }}
                  >
                    {BAPTISM_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <DatePicker
                  label="교회 등록일"
                  value={
                    formData.registrationDate && isValid(parseISO(formData.registrationDate))
                      ? parseISO(formData.registrationDate)
                      : null
                  }
                  onChange={(newVal) => {
                    handleChange(
                      "registrationDate",
                      newVal && isValid(newVal) ? format(newVal, "yyyy-MM-dd") : ""
                    );
                  }}
                  slots={{
                    field: GatheringDateButtonField,
                  }}
                  slotProps={{
                    field: {
                      label: "교회 등록일",
                      placeholder: "등록일자 선택",
                      size: "small",
                      showDayOfWeek: false,
                      clearable: true,
                    },
                    popper: {
                      sx: { zIndex: 1400 },
                    },
                    layout: {
                      sx: {
                        ".MuiPickersDay-root.Mui-selected": {
                          backgroundColor: "#ea580c !important",
                          color: "#fff",
                        },
                        ".MuiPickersDay-root.Mui-selected:hover, .MuiPickersDay-root.Mui-selected:focus": {
                          backgroundColor: "#c2410c !important",
                        },
                        ".MuiPickersDay-root.MuiPickersDay-today": {
                          borderColor: "#ea580c !important",
                        },
                        ".MuiPickersCalendarHeader-label": {
                          fontWeight: 700,
                        },
                      },
                    },
                  }}
                />
              </Grid>

              {isEdit && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-label">교적 상태</InputLabel>
                    <Select
                      labelId="status-label"
                      value={formData.status === "REMOVED" ? "REMOVED" : "ACTIVE"}
                      label="교적 상태"
                      onChange={(e) => handleChange("status", e.target.value)}
                      sx={{ borderRadius: "10px" }}
                    >
                      <MenuItem value="ACTIVE">활동 (ACTIVE)</MenuItem>
                      <MenuItem value="REMOVED">제적 (REMOVED)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            {/* 3. 양육 및 교육과정(코스) 이수 현황 (수정 모드 전용) */}
            {isEdit && (
              <Box
                sx={{
                  mt: 3,
                  p: 2.2,
                  borderRadius: "14px",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <SchoolIcon sx={{ color: "#ea580c", fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#1e293b" }}>
                    양육 및 훈련 과정 이수 현황
                  </Typography>
                </Box>

                {loadingMemberCourses ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
                    <CircularProgress size={18} sx={{ color: "#ea580c" }} />
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      이수 내역 조회 중...
                    </Typography>
                  </Box>
                ) : memberCoursesList.length === 0 ? (
                  <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                    등록된 양육 및 훈련 과정 이수 내역이 없습니다. (양육·훈련 과정 관리 탭에서 수강생으로 등록할 수 있습니다)
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {memberCoursesList.map((mc) => {
                      const isCompleted = mc.status === "COMPLETED";
                      return (
                        <Chip
                          key={mc.enrollmentId}
                          size="small"
                          icon={
                            isCompleted ? (
                              <CheckCircleIcon sx={{ fontSize: "14px !important" }} />
                            ) : (
                              <HourglassEmptyIcon sx={{ fontSize: "14px !important" }} />
                            )
                          }
                          label={`${mc.courseName} ${mc.termName ? `(${mc.termName})` : ""} · ${
                            isCompleted ? (mc.completionDate ? `수료 (${mc.completionDate})` : "수료") : "수강중"
                          }`}
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            backgroundColor: isCompleted ? "rgba(22, 163, 74, 0.1)" : "rgba(234, 88, 12, 0.1)",
                            color: isCompleted ? "#16a34a" : "#ea580c",
                            border: `1px solid ${isCompleted ? "rgba(22, 163, 74, 0.3)" : "rgba(234, 88, 12, 0.3)"}`,
                            py: 0.5,
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, flexShrink: 0, borderTop: "1px solid rgba(0, 0, 0, 0.08)" }}>
          <Button onClick={onClose} disabled={isSubmitting} sx={{ borderRadius: "10px", color: "#666" }}>
            취소
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name?.trim()}
            sx={{
              borderRadius: "10px",
              backgroundColor: isEdit ? "#ea580c" : "#2563eb",
              px: 3,
              fontWeight: 700,
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : isEdit ? (
              "수정 완료"
            ) : (
              "등록하기"
            )}
          </Button>
        </DialogActions>
      </LocalizationProvider>
    </Dialog>
  );
};

MemberFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  availableGardens: PropTypes.array,
  availableHouseholds: PropTypes.array,
  isSubmitting: PropTypes.bool,
};

export default MemberFormModal;
