/**
 * @file MemberFormModal.jsx
 * @description 세대(가구) 기반 다중 세대원 탭(Tab) 등록 및 수정 통합 모달
 * - 세대 공통 정보(주소, 소속 정원, 세대명) 관리
 * - 세대원별 탭(Tab) 전환 및 [＋ 세대원 추가] 지원
 * - Google Places Autocomplete를 통한 세대 주소 자동완성 지원
 * - 세대원별 인적사항, 직분, 세례, 부서 및 양육·훈련 과정 이수 현황 조회
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
  Radio,
  RadioGroup,
  CircularProgress,
  Divider,
  Paper,
  Autocomplete,
  Chip,
  InputAdornment,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import ForestIcon from "@mui/icons-material/Forest";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PersonIcon from "@mui/icons-material/Person";

import AddressAutocompleteInput from "./AddressAutocompleteInput";
import { PatternFormat } from "react-number-format";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parseISO, isValid } from "date-fns";
import { GatheringDateButtonField } from "../../Community/GatheringPickerFields";
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

const createDefaultMember = (isFirst = false, hasSpouse = false) => {
  const nextRel = isFirst ? "HEAD" : (!hasSpouse ? "SPOUSE" : "CHILD");
  return {
    id: null,
    _tempKey: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: "",
    nameEn: "",
    relationship: nextRel,
    isHead: nextRel === "HEAD",
    phone: "",
    birthDate: "",
    gender: nextRel === "SPOUSE" ? "F" : "M",
    position: "성도",
    department: nextRel === "CHILD" ? "유초등부" : "장년부",
    baptismStatus: "NONE",
    registrationDate: new Date().toISOString().slice(0, 10),
    status: "ACTIVE",
    isRegistered: false,
    hasNotification: false,
    deviceCount: 0,
  };
};

const MemberFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  householdMembers = [],
  availableGardens = [],
  availableHouseholds = [],
  isSubmitting = false,
  onOpenDeleteDialog,
  onSeparateMember,
}) => {
  const isEdit = Boolean(initialData?.id);

  // Household type selection for create mode: 'new' or 'existing'
  const [householdMode, setHouseholdMode] = useState("new");
  const [isAddressManualEdit, setIsAddressManualEdit] = useState(false);
  const [isSeparateAddressManualEdit, setIsSeparateAddressManualEdit] = useState(false);

  // 세대 독립(분가) 모달 상태
  const [separateTargetMember, setSeparateTargetMember] = useState(null);
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

  // 공통 세대(가구) 정보
  const [householdData, setHouseholdData] = useState({
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

  // 세대원 목록 상태 (각 탭에 해당)
  const [membersList, setMembersList] = useState([]);
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);

  // 현재 활성화된 세대원의 교육/과정 이수 목록
  const [memberCoursesList, setMemberCoursesList] = useState([]);
  const [loadingMemberCourses, setLoadingMemberCourses] = useState(false);

  // 모달 열림 및 초기 데이터 변경 시 동기화
  useEffect(() => {
    setIsAddressManualEdit(false);

    if (initialData && initialData.id) {
      // 1. 공통 세대 정보 설정
      setHouseholdData({
        householdId: initialData.householdId || "",
        householdName: initialData.householdName || `${initialData.name || "성도"} 성도 가정`,
        gardenId: initialData.gardenId || 1,
        address: initialData.address || "",
        addressDetail: initialData.addressDetail || "",
        city: initialData.city || "Edmonton",
        province: initialData.province || "AB",
        postalCode: initialData.postalCode || "",
        householdNotes: initialData.householdNotes || "",
      });
      setHouseholdMode("existing");

      // 2. 세대원 목록 구성 (동일 세대 전체 멤버 또는 단독 교인)
      const sourceList = (householdMembers && householdMembers.length > 0)
        ? householdMembers
        : [initialData];

      const mapped = sourceList.map((m, idx) => ({
        id: m.id || null,
        _tempKey: m.id ? `mem_${m.id}` : `temp_${idx}_${Date.now()}`,
        name: m.name || "",
        nameEn: m.nameEn || "",
        relationship: m.relationship || (m.isHead ? "HEAD" : "CHILD"),
        isHead: Boolean(m.isHead ?? (m.relationship === "HEAD")),
        phone: m.phone || "",
        birthDate: m.birthDate || "",
        gender: m.gender || "M",
        position: m.position || "성도",
        department: m.department || "장년부",
        baptismStatus: m.baptismStatus || "NONE",
        registrationDate: m.registrationDate || "",
        status: m.status === "REMOVED" ? "REMOVED" : "ACTIVE",
        isRegistered: Boolean(m.isRegistered),
        hasNotification: Boolean(m.hasNotification),
        deviceCount: m.deviceCount || 0,
      }));

      setMembersList(mapped);

      // 클릭했던 교인의 탭을 기본 활성화
      const targetIdx = mapped.findIndex((m) => m.id === initialData.id);
      setActiveMemberIndex(targetIdx >= 0 ? targetIdx : 0);
    } else {
      // 신규 등록 모드
      setHouseholdData({
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

      setMembersList([createDefaultMember(true, false)]);
      setActiveMemberIndex(0);
    }
  }, [initialData, householdMembers, open, availableGardens]);

  // 현재 활성화된 세대원
  const currentMember = membersList[activeMemberIndex] || membersList[0] || {};

  // 활성 세대원의 교육과정 이수 내역 로드
  useEffect(() => {
    if (currentMember?.id) {
      setLoadingMemberCourses(true);
      getMemberCourses(currentMember.id)
        .then((data) => setMemberCoursesList(data.courses || []))
        .catch(() => setMemberCoursesList([]))
        .finally(() => setLoadingMemberCourses(false));
    } else {
      setMemberCoursesList([]);
    }
  }, [currentMember?.id]);

  // 공통 세대 필드 변경 핸들러
  const handleHouseholdChange = (field, value) => {
    setHouseholdData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "gardenId") {
        const foundG = availableGardens.find((g) => g.id === value || String(g.id) === String(value));
        const gName = foundG?.name || "";
        if (gName === "새벽" || gName === "나라") {
          setMembersList((mPrev) =>
            mPrev.map((m, idx) =>
              idx === activeMemberIndex && m.department === "장년부" ? { ...m, department: "청년부" } : m
            )
          );
        }
      }
      return next;
    });
  };

  // 기존 세대 선택 (신규 등록 모드에서 기존 세대 편입 시)
  const handleHouseholdSelect = (selectedId) => {
    const found = availableHouseholds.find((h) => String(h.id) === String(selectedId));
    if (found) {
      setHouseholdData({
        householdId: found.id,
        householdName: found.householdName,
        gardenId: found.gardenId || householdData.gardenId,
        address: found.address || "",
        addressDetail: found.addressDetail || "",
        city: found.city || "Edmonton",
        province: found.province || "AB",
        postalCode: found.postalCode || "",
        householdNotes: found.notes || "",
      });
    }
  };

  // Google Places 주소 자동완성 선택
  const handleAddressSelect = ({ address, city, province, postalCode }) => {
    setHouseholdData((prev) => ({
      ...prev,
      address: address || prev.address,
      city: city || prev.city || "Edmonton",
      province: province || prev.province || "AB",
      postalCode: postalCode || prev.postalCode,
    }));
    setIsAddressManualEdit(false);
  };

  // 활성 세대원 필드 변경 핸들러
  const handleActiveMemberChange = (field, value) => {
    setMembersList((prev) => {
      const next = [...prev];
      const target = { ...next[activeMemberIndex], [field]: value };

      if (field === "relationship") {
        if (value === "HEAD") {
          target.isHead = true;
          // 세대주는 1명만 허용: 다른 세대주의 HEAD 해제
          for (let i = 0; i < next.length; i++) {
            if (i !== activeMemberIndex && (next[i].isHead || next[i].relationship === "HEAD")) {
              next[i] = { ...next[i], isHead: false, relationship: "SPOUSE" };
            }
          }
        } else {
          target.isHead = false;
        }
      }

      next[activeMemberIndex] = target;
      return next;
    });
  };

  // 새 세대원 탭 추가
  const handleAddMemberTab = () => {
    const hasSpouse = membersList.some((m) => m.relationship === "SPOUSE");
    const newMember = createDefaultMember(false, hasSpouse);
    setMembersList((prev) => [...prev, newMember]);
    setActiveMemberIndex(membersList.length);
  };

  // 미저장 새 세대원 탭 삭제
  const handleRemoveMemberTab = (indexToRemove, e) => {
    if (e) e.stopPropagation();
    if (membersList.length <= 1) return;

    setMembersList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (activeMemberIndex >= indexToRemove && activeMemberIndex > 0) {
      setActiveMemberIndex((prev) => prev - 1);
    }
  };

  // 세대 독립(분가) 모달 열기
  const handleOpenSeparateDialog = (member) => {
    setSeparateTargetMember(member);
    setIsSeparateAddressManualEdit(false);
    setSeparateForm({
      gardenId: householdData.gardenId || availableGardens[0]?.id || 1,
      department:
        member.department === "유초등부" || member.department === "중고등부"
          ? "청년부"
          : member.department || "청년부",
      address: householdData.address || "",
      addressDetail: "",
      city: householdData.city || "Edmonton",
      province: householdData.province || "AB",
      postalCode: householdData.postalCode || "",
      notes: "",
    });
  };

  // 세대 독립(분가) 확정 처리
  const handleConfirmSeparate = async () => {
    if (!separateTargetMember || !onSeparateMember) return;
    const memberId = separateTargetMember.id;
    const separationPayload = {
      name: separateTargetMember.name,
      householdName: `${(separateTargetMember.name || "교인").trim()} 성도 가정`,
      gardenId: separateForm.gardenId,
      department: separateForm.department,
      address: separateForm.address,
      addressDetail: separateForm.addressDetail,
      city: separateForm.city,
      province: separateForm.province,
      postalCode: separateForm.postalCode,
      householdNotes: separateForm.notes,
    };
    setSeparateTargetMember(null);
    await onSeparateMember(memberId, separationPayload);
  };

  // 전체 저장 제출 핸들러
  const handleSubmit = (e) => {
    if (e) {
      if (typeof e.preventDefault === "function") e.preventDefault();
      if (typeof e.stopPropagation === "function") e.stopPropagation();
    }

    if (membersList.length === 0) return;

    // 모든 세대원의 성명 필수 검증
    const invalidIdx = membersList.findIndex((m) => !m.name || !m.name.trim());
    if (invalidIdx >= 0) {
      setActiveMemberIndex(invalidIdx);
      alert(`[세대원 ${invalidIdx + 1}] 성명을 입력해 주세요.`);
      return;
    }

    const firstHead = membersList.find((m) => m.isHead) || membersList[0];
    const computedHouseholdName =
      householdData.householdName || `${firstHead?.name?.trim() || "새 성도"} 성도 가정`;

    const payload = {
      isBulk: true,
      householdId: householdData.householdId || null,
      household: {
        householdName: computedHouseholdName,
        gardenId: householdData.gardenId || 1,
        address: (householdData.address || "").trim(),
        addressDetail: (householdData.addressDetail || "").trim(),
        city: (householdData.city || "Edmonton").trim(),
        province: (householdData.province || "AB").trim(),
        postalCode: householdData.postalCode || "",
        householdNotes: (householdData.householdNotes || "").trim(),
      },
      members: membersList.map((m) => ({
        id: m.id || null,
        name: m.name.trim(),
        nameEn: m.nameEn ? m.nameEn.trim() : null,
        relationship: m.relationship || (m.isHead ? "HEAD" : "CHILD"),
        isHead: Boolean(m.isHead),
        phone: m.phone || "",
        birthDate: m.birthDate || null,
        gender: m.gender || "M",
        baptismStatus: m.baptismStatus || "NONE",
        position: m.position || "성도",
        department: m.department || "장년부",
        registrationDate: m.registrationDate || null,
        status: m.status === "REMOVED" ? "REMOVED" : "ACTIVE",
      })),
    };

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
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        },
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DialogTitle sx={{ pb: 1, px: 3, pt: 2.5, display: "flex", alignItems: "center", gap: 1.2, flexShrink: 0 }}>
          {isEdit ? (
            <FamilyRestroomIcon sx={{ color: "#ea580c", fontSize: "1.8rem" }} />
          ) : (
            <PersonAddAlt1Icon sx={{ color: "#2563eb", fontSize: "1.8rem" }} />
          )}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#111" }}>
              {isEdit
                ? `${householdData.householdName || `${currentMember?.name || "교인"} 성도 가정`} 교적 및 세대원 관리`
                : "새 세대(가구) 및 교인 등록"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#666" }}>
              {isEdit
                ? `소속 세대원(${membersList.length}명)의 교적 정보와 공통 세대 주소를 확인하고 일괄 수정합니다.`
                : "공통 세대 주소를 등록하고 탭을 추가하여 온 가족을 한 번에 등록합니다."}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 2.5, px: 3, overflowY: "auto", flex: "1 1 auto" }}>
          {/* ========================================================= */}
          {/* 1. 세대(가구) 공통 및 거주 주소 정보 섹션                     */}
          {/* ========================================================= */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <HomeOutlinedIcon sx={{ color: "#ea580c", fontSize: "1.3rem" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#222" }}>
                  1. 세대(가구) 공통 및 거주 주소 정보
                </Typography>
              </Box>
              <Chip
                size="small"
                label="모든 세대원 공통 적용"
                sx={{
                  backgroundColor: "rgba(234, 88, 12, 0.08)",
                  color: "#ea580c",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                }}
              />
            </Box>

            {/* 신규 등록 모드: 새 세대 vs 기존 세대 편입 선택 */}
            {!isEdit && (
              <Box sx={{ mb: 2, p: 2, backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={householdMode}
                    onChange={(e) => setHouseholdMode(e.target.value)}
                  >
                    <FormControlLabel
                      value="new"
                      control={<Radio size="small" sx={{ color: "#ea580c", "&.Mui-checked": { color: "#ea580c" } }} />}
                      label={<Typography variant="body2" sx={{ fontWeight: 600 }}>새 세대(가구) 신규 생성</Typography>}
                    />
                    <FormControlLabel
                      value="existing"
                      control={<Radio size="small" sx={{ color: "#ea580c", "&.Mui-checked": { color: "#ea580c" } }} />}
                      label={<Typography variant="body2" sx={{ fontWeight: 600 }}>기존 세대에 세대원으로 편입</Typography>}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            )}

            {/* 기존 세대 편입 모드: 기존 가구 Autocomplete 검색 */}
            {!isEdit && householdMode === "existing" && (
              <Box sx={{ mb: 2 }}>
                <Autocomplete
                  options={availableHouseholds}
                  getOptionLabel={(option) => {
                    const addrPart = option.address ? ` - ${option.address}` : "";
                    const gardenPart = option.gardenName ? ` [${option.gardenName}]` : "";
                    return `${option.householdName || "무명 가구"}${gardenPart}${addrPart}`;
                  }}
                  onChange={(_, val) => handleHouseholdSelect(val?.id || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="편입할 기존 세대 검색 및 선택"
                      placeholder="세대명이나 주소로 검색..."
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  )}
                />
              </Box>
            )}

            {/* 세대 주소 및 정원 설정 카드 */}
            {(householdMode === "new" || isEdit) && (
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  borderRadius: "14px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  backgroundColor: "#fafafa",
                }}
              >
                <Grid container spacing={2}>
                  {/* 세대명 */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="세대명 (가구 명칭)"
                      placeholder="예: 홍길동 성도 가정"
                      value={householdData.householdName}
                      onChange={(e) => handleHouseholdChange("householdName", e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#fff" } }}
                    />
                  </Grid>

                  {/* 소속 정원 */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small" sx={{ backgroundColor: "#fff" }}>
                      <InputLabel id="modal-garden-label">소속 정원</InputLabel>
                      <Select
                        labelId="modal-garden-label"
                        value={householdData.gardenId}
                        label="소속 정원"
                        onChange={(e) => handleHouseholdChange("gardenId", e.target.value)}
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

                  {/* 기본 도로명 주소 (Street Address) */}
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      size="medium"
                      label="기본 도로명 주소 (Street Address)"
                      placeholder="상단 검색창에서 주소를 검색하여 선택하면 자동 입력됩니다"
                      value={householdData.address}
                      onChange={(e) => handleHouseholdChange("address", e.target.value)}
                      slotProps={{
                        input: {
                          readOnly: !isAddressManualEdit,
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlinedIcon sx={{ color: householdData.address ? "#16a34a" : "#94a3b8" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              {householdData.address && !isAddressManualEdit ? (
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
                                  완료
                                </Button>
                              ) : null}
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        backgroundColor: isAddressManualEdit ? "#fff" : "#f8fafc",
                        "& .MuiOutlinedInput-root": { borderRadius: "12px", minHeight: "48px" },
                      }}
                    />
                  </Grid>

                  {/* 동/호수 상세 주소 */}
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      size="medium"
                      label="동/호수/유닛 (Unit/Apt)"
                      placeholder="예: Apt 204, Unit B"
                      value={householdData.addressDetail}
                      onChange={(e) => handleHouseholdChange("addressDetail", e.target.value)}
                      sx={{
                        backgroundColor: "#fff",
                        "& .MuiOutlinedInput-root": { borderRadius: "12px", minHeight: "48px" },
                      }}
                    />
                  </Grid>

                  {/* 도시 */}
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                      fullWidth
                      size="medium"
                      label="도시 (City)"
                      value={householdData.city}
                      onChange={(e) => handleHouseholdChange("city", e.target.value)}
                      slotProps={{ input: { readOnly: !isAddressManualEdit } }}
                      sx={{
                        backgroundColor: isAddressManualEdit ? "#fff" : "#f8fafc",
                        "& .MuiOutlinedInput-root": { borderRadius: "12px", minHeight: "48px" },
                      }}
                    />
                  </Grid>

                  {/* 주 (Province) */}
                  <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                      fullWidth
                      size="medium"
                      label="주 (Province)"
                      value={householdData.province}
                      onChange={(e) => handleHouseholdChange("province", e.target.value)}
                      slotProps={{ input: { readOnly: !isAddressManualEdit } }}
                      sx={{
                        backgroundColor: isAddressManualEdit ? "#fff" : "#f8fafc",
                        "& .MuiOutlinedInput-root": { borderRadius: "12px", minHeight: "48px" },
                      }}
                    />
                  </Grid>

                  {/* 우편번호 */}
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                      fullWidth
                      size="medium"
                      label="우편번호 (Postal Code)"
                      placeholder="예: T6W 0A1"
                      value={householdData.postalCode}
                      onChange={(e) => handleHouseholdChange("postalCode", e.target.value.toUpperCase())}
                      slotProps={{ input: { readOnly: !isAddressManualEdit } }}
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

          <Divider sx={{ my: 3 }} />

          {/* ========================================================= */}
          {/* 2. 세대원 구성 탭 (Tabs Bar) & 개인 인적사항 섹션             */}
          {/* ========================================================= */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mb: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BadgeOutlinedIcon sx={{ color: "#2563eb", fontSize: "1.3rem" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#222" }}>
                  2. 세대원 구성 및 개인 교적 정보
                </Typography>
                <Chip
                  size="small"
                  label={`총 ${membersList.length}명`}
                  sx={{ backgroundColor: "#eff6ff", color: "#1d4ed8", fontWeight: 700, height: 22 }}
                />
              </Box>

              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddMemberTab}
                sx={{
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  borderColor: "#ea580c",
                  color: "#ea580c",
                  backgroundColor: "rgba(234, 88, 12, 0.05)",
                  "&:hover": { backgroundColor: "rgba(234, 88, 12, 0.12)", borderColor: "#c2410c" },
                  px: 1.8,
                  py: 0.6,
                }}
              >
                세대원 추가
              </Button>
            </Box>

            {/* 세대원 탭 네비게이션 바 */}
            <Box sx={{ borderBottom: "2px solid #e2e8f0", mb: 2.5 }}>
              <Tabs
                value={activeMemberIndex}
                onChange={(_, val) => setActiveMemberIndex(val)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTabs-indicator": { backgroundColor: "#ea580c", height: 3, borderRadius: "3px 3px 0 0" },
                  "& .MuiTab-root": {
                    minHeight: 46,
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "0.88rem",
                    color: "#64748b",
                    "&.Mui-selected": { color: "#ea580c", fontWeight: 800 },
                  },
                }}
              >
                {membersList.map((m, idx) => {
                  const relLabel =
                    m.isHead
                      ? "세대주"
                      : RELATIONSHIP_OPTIONS.find((r) => r.value === m.relationship)?.label || "세대원";

                  return (
                    <Tab
                      key={m._tempKey || m.id || idx}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                          <PersonIcon sx={{ fontSize: "1.1rem" }} />
                          <Typography variant="body2" sx={{ fontWeight: "inherit", fontSize: "0.9rem" }}>
                            {m.name || `세대원 ${idx + 1}`}
                          </Typography>
                          <Chip
                            size="small"
                            label={relLabel}
                            sx={{
                              height: 20,
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              backgroundColor: m.isHead ? "rgba(234, 88, 12, 0.14)" : "#f1f5f9",
                              color: m.isHead ? "#c2410c" : "#475569",
                              border: m.isHead ? "1px solid rgba(234, 88, 12, 0.3)" : "1px solid #e2e8f0",
                              pointerEvents: "none",
                            }}
                          />
                          {!m.id && membersList.length > 1 && (
                            <Tooltip title="이 추가 세대원 취소">
                              <IconButton
                                size="small"
                                onClick={(e) => handleRemoveMemberTab(idx, e)}
                                sx={{
                                  p: 0.2,
                                  ml: 0.2,
                                  color: "#94a3b8",
                                  "&:hover": { color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)" },
                                }}
                              >
                                <CloseIcon sx={{ fontSize: 13 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      }
                    />
                  );
                })}
              </Tabs>
            </Box>

            {/* 활성 세대원 프로필 요약 카드 배너 (수정 모드 또는 기존 등록 교인인 경우) */}
            {currentMember?.id && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2.5,
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      backgroundColor: currentMember.status === "REMOVED" ? "#fee2e2" : "#ffedd5",
                      color: currentMember.status === "REMOVED" ? "#dc2626" : "#ea580c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  >
                    {currentMember.name ? currentMember.name.charAt(0) : "교"}
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap" }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                        {currentMember.name || "(이름 없음)"}
                      </Typography>
                      {currentMember.nameEn && (
                        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                          ({currentMember.nameEn})
                        </Typography>
                      )}
                      {currentMember.status === "REMOVED" ? (
                        <Chip
                          size="small"
                          label="제적"
                          sx={{
                            height: 20,
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            backgroundColor: "rgba(220, 38, 38, 0.1)",
                            color: "#dc2626",
                          }}
                        />
                      ) : (
                        <Chip
                          size="small"
                          label={currentMember.isHead ? "세대주" : (RELATIONSHIP_OPTIONS.find((r) => r.value === currentMember.relationship)?.label || "세대원")}
                          sx={{
                            height: 20,
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            backgroundColor: currentMember.isHead ? "rgba(234, 88, 12, 0.12)" : "#e2e8f0",
                            color: currentMember.isHead ? "#c2410c" : "#475569",
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block", mt: 0.2 }}>
                      {currentMember.position || "성도"} · {BAPTISM_OPTIONS.find((b) => b.value === currentMember.baptismStatus)?.label || "세례"} · {currentMember.department || "장년부"}
                      {currentMember.registrationDate ? ` · 등록일: ${currentMember.registrationDate}` : ""}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap" }}>
                  {currentMember.isRegistered ? (
                    <Chip
                      size="small"
                      label="웹가입 완료"
                      sx={{ height: 24, fontSize: "0.72rem", fontWeight: 700, backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}
                    />
                  ) : (
                    <Chip
                      size="small"
                      label="웹 미가입"
                      sx={{ height: 24, fontSize: "0.72rem", fontWeight: 600, backgroundColor: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}
                    />
                  )}

                  {currentMember.hasNotification ? (
                    <Chip
                      icon={<NotificationsActiveIcon sx={{ fontSize: "13px !important", color: "#16a34a !important" }} />}
                      size="small"
                      label={`알림 수신중${currentMember.deviceCount ? ` (${currentMember.deviceCount}대)` : ""}`}
                      sx={{ height: 24, fontSize: "0.72rem", fontWeight: 700, backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}
                    />
                  ) : (
                    <Chip
                      icon={<NotificationsOffIcon sx={{ fontSize: "13px !important", color: "#94a3b8 !important" }} />}
                      size="small"
                      label="알림 미등록"
                      sx={{ height: 24, fontSize: "0.72rem", fontWeight: 600, backgroundColor: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}
                    />
                  )}
                </Box>
              </Paper>
            )}

            {/* 자녀/세대원 수정 시: 세대 독립 (분가) 안내 배너 카드 */}
            {isEdit && currentMember?.id && !currentMember.isHead && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2.5,
                  borderRadius: "14px",
                  backgroundColor: "#eff6ff",
                  border: "1.5px solid #bfdbfe",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1.5,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 260 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <HomeWorkOutlinedIcon sx={{ color: "#2563eb", fontSize: "1.3rem" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#1e40af" }}>
                      세대 독립 (새 가구로 분가)
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#3b82f6", display: "block", mt: 0.4, lineHeight: 1.4 }}>
                    현재 세대의 {currentMember.relationship === "CHILD" ? "자녀" : "세대원"}로 등록되어 있습니다.
                    결혼 또는 청년 독립으로 새 가구를 형성하려면 분가 버튼을 누르세요.
                  </Typography>
                </Box>

                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleOpenSeparateDialog(currentMember)}
                  sx={{
                    borderRadius: "10px",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    backgroundColor: "#2563eb",
                    "&:hover": { backgroundColor: "#1d4ed8" },
                    px: 2,
                    py: 0.8,
                  }}
                >
                  이 세대원 분가(독립)하기
                </Button>
              </Paper>
            )}

            {/* 선택된 세대원의 개인 인적사항 입력 폼 */}
            <Grid container spacing={2}>
              {/* 성명 (한글) */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="성명 (한글)"
                  placeholder="예: 홍길동"
                  value={currentMember.name || ""}
                  onChange={(e) => handleActiveMemberChange("name", e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              </Grid>

              {/* 영문 이름 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="영문 이름 (English Name)"
                  placeholder="예: Gildong Hong"
                  value={currentMember.nameEn || ""}
                  onChange={(e) => handleActiveMemberChange("nameEn", e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              </Grid>

              {/* 휴대전화 번호 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <PatternFormat
                  customInput={TextField}
                  fullWidth
                  size="small"
                  type="tel"
                  label="휴대전화 번호"
                  value={currentMember.phone || ""}
                  format="(###) ###-####"
                  mask="_"
                  allowEmptyFormatting={false}
                  placeholder="(780) 123-4567"
                  onValueChange={(values) => {
                    handleActiveMemberChange("phone", values.value ? values.formattedValue : "");
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              </Grid>

              {/* 세대 내 가족 관계 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="tab-relationship-label">세대주와의 가족 관계</InputLabel>
                  <Select
                    labelId="tab-relationship-label"
                    value={currentMember.relationship || "CHILD"}
                    label="세대주와의 가족 관계"
                    onChange={(e) => handleActiveMemberChange("relationship", e.target.value)}
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

              {/* 생년월일 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <DatePicker
                  label="생년월일"
                  value={
                    currentMember.birthDate && isValid(parseISO(currentMember.birthDate))
                      ? parseISO(currentMember.birthDate)
                      : null
                  }
                  onChange={(newVal) => {
                    handleActiveMemberChange(
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
                    popper: { sx: { zIndex: 1400 } },
                    layout: {
                      sx: {
                        ".MuiPickersDay-root.Mui-selected": {
                          backgroundColor: "#ea580c !important",
                          color: "#fff",
                        },
                      },
                    },
                  }}
                />
              </Grid>

              {/* 성별 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="tab-gender-label">성별</InputLabel>
                  <Select
                    labelId="tab-gender-label"
                    value={currentMember.gender || "M"}
                    label="성별"
                    onChange={(e) => handleActiveMemberChange("gender", e.target.value)}
                    sx={{ borderRadius: "10px" }}
                  >
                    <MenuItem value="M">남성 (Male)</MenuItem>
                    <MenuItem value="F">여성 (Female)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* 직분 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="tab-position-label">직분</InputLabel>
                  <Select
                    labelId="tab-position-label"
                    value={currentMember.position || "성도"}
                    label="직분"
                    onChange={(e) => handleActiveMemberChange("position", e.target.value)}
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

              {/* 소속 부서 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="tab-department-label">소속 부서</InputLabel>
                  <Select
                    labelId="tab-department-label"
                    value={currentMember.department || "장년부"}
                    label="소속 부서"
                    onChange={(e) => handleActiveMemberChange("department", e.target.value)}
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

              {/* 세례 신분 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="tab-baptism-label">세례 신분</InputLabel>
                  <Select
                    labelId="tab-baptism-label"
                    value={currentMember.baptismStatus || "NONE"}
                    label="세례 신분"
                    onChange={(e) => handleActiveMemberChange("baptismStatus", e.target.value)}
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

              {/* 등록일자 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <DatePicker
                  label="교회 등록일"
                  value={
                    currentMember.registrationDate && isValid(parseISO(currentMember.registrationDate))
                      ? parseISO(currentMember.registrationDate)
                      : null
                  }
                  onChange={(newVal) => {
                    handleActiveMemberChange(
                      "registrationDate",
                      newVal && isValid(newVal) ? format(newVal, "yyyy-MM-dd") : ""
                    );
                  }}
                  slots={{ field: GatheringDateButtonField }}
                  slotProps={{
                    field: {
                      label: "교회 등록일",
                      placeholder: "등록일자 선택",
                      size: "small",
                      showDayOfWeek: false,
                      clearable: true,
                    },
                    popper: { sx: { zIndex: 1400 } },
                  }}
                />
              </Grid>

              {/* 교적 상태 (수정 대상 교인만 노출) */}
              {currentMember.id && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="tab-status-label">교적 상태</InputLabel>
                    <Select
                      labelId="tab-status-label"
                      value={currentMember.status || "ACTIVE"}
                      label="교적 상태"
                      onChange={(e) => handleActiveMemberChange("status", e.target.value)}
                      sx={{ borderRadius: "10px" }}
                    >
                      <MenuItem value="ACTIVE">활동 (ACTIVE)</MenuItem>
                      <MenuItem value="REMOVED">제적 (REMOVED)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            {/* 활성 세대원의 양육 및 교육과정 이수 현황 (기존 교인 전용) */}
            {currentMember?.id && (
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
                    [{currentMember.name || "교인"}] 양육 및 훈련 과정 이수 현황
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

        {/* ========================================================= */}
        {/* 모달 하단 액션 바                                         */}
        {/* ========================================================= */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            flexShrink: 0,
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            display: "flex",
            justifyContent: currentMember?.id && onOpenDeleteDialog ? "space-between" : "flex-end",
            alignItems: "center",
          }}
        >
          {currentMember?.id && onOpenDeleteDialog && (
            <Button
              color="error"
              variant="outlined"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => onOpenDeleteDialog(currentMember)}
              disabled={isSubmitting}
              sx={{
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.85rem",
                borderColor: "rgba(239, 68, 68, 0.4)",
                color: "#dc2626",
                "&:hover": {
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  borderColor: "#dc2626",
                },
              }}
            >
              {currentMember?.status === "REMOVED" ? `[${currentMember.name}] 교적 영구 삭제` : `[${currentMember.name}] 제적 / 계정 삭제`}
            </Button>
          )}

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={onClose} disabled={isSubmitting} sx={{ borderRadius: "10px", color: "#666" }}>
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting || membersList.length === 0}
              sx={{
                borderRadius: "10px",
                backgroundColor: isEdit ? "#ea580c" : "#2563eb",
                px: 3.5,
                fontWeight: 800,
                fontSize: "0.92rem",
                boxShadow: isEdit ? "0 4px 14px rgba(234, 88, 12, 0.3)" : "0 4px 14px rgba(37, 99, 235, 0.3)",
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : isEdit ? (
                `세대 전체 저장 (${membersList.length}명)`
              ) : (
                `세대 등록하기 (${membersList.length}명)`
              )}
            </Button>
          </Box>
        </DialogActions>
      </LocalizationProvider>

      {/* ========================================================= */}
      {/* 세대 독립(분가) 전용 다이얼로그                            */}
      {/* ========================================================= */}
      <Dialog
        open={Boolean(separateTargetMember)}
        onClose={() => setSeparateTargetMember(null)}
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
          [{separateTargetMember?.name}] 성도 세대 독립(분가) 설정
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2.5 }}>
          <Typography variant="body2" sx={{ color: "#475569", mb: 2.5, lineHeight: 1.5 }}>
            현재 세대에서 분리하여, <strong>[{separateTargetMember?.name}]</strong> 성도를 독립된 신규 세대주로 등록합니다. 새로운 거주지 주소와 소속 정원을 지정해 주세요.
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
                  setIsSeparateAddressManualEdit(false);
                }}
                placeholder="새 거주 주소 검색 (이사/분가한 경우)"
              />
            </Grid>

            {/* 기본 도로명 주소 (Street Address) */}
            <Grid size={12}>
              <TextField
                fullWidth
                size="small"
                label="기본 도로명 주소 (Street Address)"
                placeholder="상단 검색창에서 주소를 검색하여 선택하면 자동 입력됩니다"
                value={separateForm.address}
                onChange={(e) => setSeparateForm((prev) => ({ ...prev, address: e.target.value }))}
                slotProps={{
                  input: {
                    readOnly: !isSeparateAddressManualEdit,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnOutlinedIcon sx={{ color: separateForm.address ? "#16a34a" : "#94a3b8", fontSize: "1.2rem" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {separateForm.address && !isSeparateAddressManualEdit ? (
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
                              onClick={() => setIsSeparateAddressManualEdit(true)}
                              sx={{ fontSize: "0.75rem", minWidth: "auto", px: 1, py: 0.2 }}
                            >
                              직접 수정
                            </Button>
                          </Box>
                        ) : isSeparateAddressManualEdit ? (
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => setIsSeparateAddressManualEdit(false)}
                            sx={{ fontSize: "0.75rem", minWidth: "auto", px: 1, py: 0.2 }}
                          >
                            완료
                          </Button>
                        ) : null}
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  backgroundColor: isSeparateAddressManualEdit ? "#fff" : "#f8fafc",
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
                slotProps={{ input: { readOnly: !isSeparateAddressManualEdit } }}
                sx={{
                  backgroundColor: isSeparateAddressManualEdit ? "#fff" : "#f8fafc",
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
                slotProps={{ input: { readOnly: !isSeparateAddressManualEdit } }}
                sx={{
                  backgroundColor: isSeparateAddressManualEdit ? "#fff" : "#f8fafc",
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
                slotProps={{ input: { readOnly: !isSeparateAddressManualEdit } }}
                sx={{
                  backgroundColor: isSeparateAddressManualEdit ? "#fff" : "#f8fafc",
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setSeparateTargetMember(null)} sx={{ color: "#64748b", borderRadius: "10px" }}>
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmSeparate}
            sx={{
              borderRadius: "10px",
              backgroundColor: "#2563eb",
              fontWeight: 800,
              px: 3,
            }}
          >
            분가 확정하기
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

MemberFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  householdMembers: PropTypes.array,
  availableGardens: PropTypes.array,
  availableHouseholds: PropTypes.array,
  isSubmitting: PropTypes.bool,
  onOpenDeleteDialog: PropTypes.func,
  onSeparateMember: PropTypes.func,
};

export default MemberFormModal;
