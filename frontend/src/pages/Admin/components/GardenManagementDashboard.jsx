/**
 * @file GardenManagementDashboard.jsx
 * @description 온교회 정원 마스터 목록 관리 대시보드 (탭 전용 뷰)
 * - 4대 정원 요약 지표 카드 (전체 정원, 운영 중 정원, 배정 세대, 미배정 세대)
 * - 정원 목록 조회, 검색 및 필터링
 * - 팝업 모달 기반 신규 정원 등록 및 정보 수정 (스크롤 위치 무관 즉각 반응)
 * - 소속 세대 및 교인 명단 즉시 확인 (테이블 칩 클릭 시 전용 명단 모달 제공)
 * - '미배정' 기본 정원 보호 및 소속 가구 안전 삭제 가드
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  CircularProgress,
  Tooltip,
  Alert,
  Autocomplete,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableSortLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import ForestIcon from "@mui/icons-material/Forest";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import YardOutlinedIcon from "@mui/icons-material/YardOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {
  getAdminGardensWithStats,
  createGarden,
  updateGarden,
  deleteGarden,
  reorderGardens,
} from "../../../api/admin";
import { formatPhoneNumber } from "../utils/memberUtils";

const RELATIONSHIP_LABELS = {
  HEAD: "세대주",
  SPOUSE: "배우자",
  CHILD: "자녀",
  PARENT: "부모",
  OTHER: "기타",
};

const RELATIONSHIP_COLORS = {
  HEAD: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  SPOUSE: { bg: "#fdf2f8", color: "#be185d", border: "#fbcfe8" },
  CHILD: { bg: "#faf5ff", color: "#7e22ce", border: "#e9d5ff" },
  PARENT: { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  OTHER: { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" },
};

const BAPTISM_LABELS = {
  BAPTIZED: { label: "세례", bg: "rgba(37, 99, 235, 0.08)", color: "#1d4ed8" },
  INFANT: { label: "유아세례", bg: "rgba(13, 148, 136, 0.08)", color: "#0f766e" },
  CONFIRMATION: { label: "입교", bg: "rgba(124, 58, 237, 0.08)", color: "#6d28d9" },
  NONE: { label: "미세례", bg: "#f3f4f6", color: "#94a3b8" },
};

const GardenManagementDashboard = ({ users = [], onGardensUpdated, onOpenEditMemberModal }) => {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 드래그 앤 드롭 및 순서 재배치 상태
  const [draggedGardenId, setDraggedGardenId] = useState(null);
  const [dragOverGardenId, setDragOverGardenId] = useState(null);
  const [isReordering, setIsReordering] = useState(false);

  // 편집/추가 모달 상태 (기존 상단 인라인에서 팝업 모달로 전환하여 즉각 반응 보장)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGarden, setEditingGarden] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "ADULT",
    orderNum: 0,
    leaderMemberId: null,
    subLeaderMemberIds: [],
    isActive: true,
  });

  // 소속 세대 및 교인 명단 확인 모달
  const [viewingGarden, setViewingGarden] = useState(null);
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [modalSortBy, setModalSortBy] = useState("household"); // 'household', 'birthDate', 'name'
  const [modalSortOrder, setModalSortOrder] = useState("asc"); // 'asc', 'desc'

  // 모달 닫힘 시 검색어 및 정렬 기준 초기화
  useEffect(() => {
    if (!viewingGarden) {
      setModalSearchTerm("");
      setModalSortBy("household");
      setModalSortOrder("asc");
    }
  }, [viewingGarden]);

  // 모달 테이블 컬럼 정렬 토글 (오름차순 -> 내림차순 -> 세대별 기본 정렬 순환)
  const handleToggleModalSort = (column) => {
    if (modalSortBy === column) {
      if (modalSortOrder === "asc") {
        setModalSortOrder("desc");
      } else {
        setModalSortBy("household");
        setModalSortOrder("asc");
      }
    } else {
      setModalSortBy(column);
      setModalSortOrder("asc");
    }
  };

  // 삭제 확인 다이얼로그 대상
  const [gardenToDelete, setGardenToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // 실시간 users 데이터 기반 정원별 교인 매핑
  const gardenMembersMap = useMemo(() => {
    const map = {};
    (users || []).forEach((u) => {
      if (u.status === "REMOVED") return;
      const idKey = u.gardenId;
      const nameKey = u.gardenName;
      if (idKey) {
        if (!map[idKey]) map[idKey] = [];
        map[idKey].push(u);
      }
      if (nameKey && nameKey !== idKey) {
        if (!map[nameKey]) map[nameKey] = [];
        map[nameKey].push(u);
      }
    });
    return map;
  }, [users]);

  // 특정 정원의 소속 교인 목록 추출 (O(1) 캐시 조회)
  const getGardenMembers = useCallback(
    (g) => {
      if (!g) return [];
      const byId = g.id ? gardenMembersMap[g.id] : null;
      if (byId && byId.length > 0) return byId;
      const byName = g.name ? gardenMembersMap[g.name] : null;
      return byName || [];
    },
    [gardenMembersMap]
  );

  // 실시간 users 데이터 기반 정원별 세대 목록 매핑 (useMemo로 사전 그룹핑 및 정렬 1회 캐싱)
  const gardenHouseholdsMap = useMemo(() => {
    const map = {};
    const relOrder = { HEAD: 0, SPOUSE: 1, CHILD: 2, PARENT: 3, OTHER: 4 };

    Object.entries(gardenMembersMap).forEach(([key, members]) => {
      const householdMap = new Map();
      members.forEach((m) => {
        const hId = m.householdId || `temp-${m.id}`;
        if (!householdMap.has(hId)) {
          householdMap.set(hId, {
            id: hId,
            householdName: m.householdName || `${m.headName || m.name} 성도 가정`,
            headName: m.headName || (m.isHead ? m.name : "미지정"),
            address: m.address,
            addressDetail: m.addressDetail,
            city: m.city,
            province: m.province,
            postalCode: m.postalCode,
            members: [m],
          });
        } else {
          const item = householdMap.get(hId);
          if (m.isHead) {
            item.headName = m.name;
          }
          item.members.push(m);
        }
      });

      const households = Array.from(householdMap.values());
      households.forEach((h) => {
        h.members.sort((a, b) => {
          if (a.isHead && !b.isHead) return -1;
          if (!a.isHead && b.isHead) return 1;
          const aOrder = relOrder[a.relationship] ?? 5;
          const bOrder = relOrder[b.relationship] ?? 5;
          return aOrder - bOrder;
        });
      });

      map[key] = households;
    });

    return map;
  }, [gardenMembersMap]);

  // 특정 정원의 소속 세대 목록 추출 (O(1) 캐시 조회)
  const getGardenHouseholds = useCallback(
    (g) => {
      if (!g) return [];
      const byId = g.id ? gardenHouseholdsMap[g.id] : null;
      if (byId && byId.length > 0) return byId;
      const byName = g.name ? gardenHouseholdsMap[g.name] : null;
      return byName || [];
    },
    [gardenHouseholdsMap]
  );

  // 모달 내 세대별 정원 교인 명부 (가구 단위 지브라 패턴 적용, 검색 필터링 및 생년월일/성명 정렬 지원)
  const gardenRegistryMembers = useMemo(() => {
    if (!viewingGarden) return [];
    const households = getGardenHouseholds(viewingGarden);
    const list = [];
    households.forEach((h, hIdx) => {
      const fullAddress = [h.addressDetail, h.address, h.city, h.province, h.postalCode].filter(Boolean).join(" ");
      h.members.forEach((m, mIdx) => {
        list.push({
          ...m,
          householdId: h.id,
          householdName: h.householdName,
          headName: h.headName,
          householdAddress: fullAddress,
          householdIndex: hIdx,
          isZebra: hIdx % 2 === 1,
          isFirstInHousehold: mIdx === 0,
          householdMemberCount: h.members.length,
        });
      });
    });

    let filtered = list;
    if (modalSearchTerm.trim()) {
      const term = modalSearchTerm.trim().toLowerCase();
      filtered = list.filter((m) => {
        const inName = (m.name || "").toLowerCase().includes(term);
        const inPhone = (m.phone || "").replace(/\D/g, "").includes(term);
        const inPos = (m.position || "").toLowerCase().includes(term);
        const inRel = (RELATIONSHIP_LABELS[m.relationship] || "").toLowerCase().includes(term);
        const inBirth = (m.birthDate || "").includes(term);
        return inName || inPhone || inPos || inRel || inBirth;
      });
    }

    // 1. 생년월일 정렬 (오름차순: 연장자순 / 내림차순: 연소자순)
    if (modalSortBy === "birthDate") {
      const getDateStr = (val) => {
        if (!val) return "";
        const s = String(val).split("T")[0].trim();
        return s === "-" ? "" : s;
      };

      const sorted = [...filtered].sort((a, b) => {
        const dateA = getDateStr(a.birthDate);
        const dateB = getDateStr(b.birthDate);
        if (!dateA && !dateB) return (a.name || "").localeCompare(b.name || "", "ko");
        if (!dateA) return 1; // 생년월일 미등록자는 항상 맨 뒤로 배치
        if (!dateB) return -1;
        const cmp = dateA.localeCompare(dateB);
        if (cmp !== 0) {
          return modalSortOrder === "asc" ? cmp : -cmp;
        }
        return (a.name || "").localeCompare(b.name || "", "ko");
      });

      // 개별 정렬 시에는 행 단위 지브라 패턴 적용 및 가구 구분선 비활성화
      return sorted.map((m, idx) => ({
        ...m,
        isZebra: idx % 2 === 1,
        isFirstInHousehold: false,
      }));
    }

    // 2. 성명 가나다순 정렬
    if (modalSortBy === "name") {
      const sorted = [...filtered].sort((a, b) => {
        const cmp = (a.name || "").localeCompare(b.name || "", "ko");
        return modalSortOrder === "asc" ? cmp : -cmp;
      });

      return sorted.map((m, idx) => ({
        ...m,
        isZebra: idx % 2 === 1,
        isFirstInHousehold: false,
      }));
    }

    // 3. 기본 세대별 가구 묶음 정렬
    return filtered;
  }, [viewingGarden, modalSearchTerm, modalSortBy, modalSortOrder, gardens, users]);

  // 정원지기(리더) 후보 목록
  // 장년 정원: 해당 정원에 소속된 활동 교인만 선택 가능
  // 청년 정원: 청년부 전체 교인(department === '청년부' or 청년 정원 소속) 선택 가능
  const candidateLeaders = useMemo(() => {
    const isYoungAdult = formData.category === "YOUNG_ADULT";
    if (isYoungAdult) {
      return (users || [])
        .filter(
          (m) =>
            m.status !== "REMOVED" &&
            (m.department === "청년부" || m.gardenName === "나라" || m.gardenName === "새벽")
        )
        .map((m) => {
          const birthStr = m.birthDate ? String(m.birthDate).split("T")[0] : "생년월일 미등록";
          return {
            id: m.id,
            name: m.name,
            birthDate: m.birthDate,
            phone: m.phone,
            phoneClean: m.phoneClean,
            position: m.position,
            gardenName: m.gardenName || m.garden,
            label: `${m.name}${m.gardenName ? ` (${m.gardenName})` : ""} · ${birthStr}`,
          };
        });
    }

    if (!editingGarden) return [];
    const members = getGardenMembers(editingGarden);
    return members
      .filter((m) => m.status !== "REMOVED")
      .map((m) => {
        const birthStr = m.birthDate ? String(m.birthDate).split("T")[0] : "생년월일 미등록";
        const gardenTag = m.gardenName || editingGarden.name;
        return {
          id: m.id,
          name: m.name,
          birthDate: m.birthDate,
          phone: m.phone,
          phoneClean: m.phoneClean,
          position: m.position,
          gardenName: gardenTag,
          label: `${m.name}${gardenTag ? ` (${gardenTag})` : ""} · ${birthStr}`,
        };
      });
  }, [editingGarden, formData.category, users, gardenMembersMap]);

  // 부정원지기 후보 목록 (청년 정원 전용: 청년부 전체 교인 중 선택)
  const candidateSubLeaders = useMemo(() => {
    if (formData.category !== "YOUNG_ADULT") return [];
    return (users || [])
      .filter(
        (m) =>
          m.status !== "REMOVED" &&
          (m.department === "청년부" || m.gardenName === "나라" || m.gardenName === "새벽") &&
          m.id !== formData.leaderMemberId // 정원지기와 중복 방지
      )
      .map((m) => {
        const birthStr = m.birthDate ? String(m.birthDate).split("T")[0] : "생년월일 미등록";
        return {
          id: m.id,
          name: m.name,
          birthDate: m.birthDate,
          phone: m.phone,
          phoneClean: m.phoneClean,
          position: m.position,
          gardenName: m.gardenName || m.garden,
          label: `${m.name}${m.gardenName ? ` (${m.gardenName})` : ""} · ${birthStr}`,
        };
      });
  }, [formData.category, formData.leaderMemberId, users]);

  // 정원 통계 목록 불러오기
  const fetchGardensList = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await getAdminGardensWithStats();
      setGardens(res.gardens || []);
    } catch (err) {
      console.error("Failed to fetch gardens with stats:", err);
      setErrorMessage(err?.response?.data?.message || "정원 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGardensList();
  }, []);

  // 4대 통계 지표 계산 (users 실시간 데이터와 백엔드 통계 병합)
  const metrics = useMemo(() => {
    const totalGardens = gardens.length;
    const unassignedGarden = gardens.find((g) => g.id === 1);
    const unassignedHouseholds = unassignedGarden
      ? (unassignedGarden.householdCount ?? getGardenHouseholds(unassignedGarden).length)
      : 0;
    const totalAssignedHouseholds = gardens
      .filter((g) => g.id !== 1)
      .reduce((sum, g) => sum + (g.householdCount ?? getGardenHouseholds(g).length), 0);
    const totalAssignedMembers = gardens
      .filter((g) => g.id !== 1)
      .reduce((sum, g) => sum + (g.memberCount ?? getGardenMembers(g).length), 0);

    return {
      totalGardens,
      totalAssignedMembers,
      totalAssignedHouseholds,
      unassignedHouseholds,
    };
  }, [gardens, gardenMembersMap, gardenHouseholdsMap]);

  // 검색 필터링된 정원 목록
  const filteredGardens = useMemo(() => {
    if (!searchTerm.trim()) return gardens;
    const term = searchTerm.trim().toLowerCase();
    return gardens.filter(
      (g) =>
        (g.name || "").toLowerCase().includes(term) ||
        (g.leaderName || "").toLowerCase().includes(term) ||
        (g.subLeaderNames || "").toLowerCase().includes(term)
    );
  }, [gardens, searchTerm]);

  // 모달 열기 (신규 등록)
  const handleOpenCreateForm = () => {
    setEditingGarden(null);
    setFormData({
      name: "",
      category: "ADULT",
      orderNum: gardens.length > 0 ? Math.max(...gardens.map((g) => g.orderNum || 0)) + 1 : 1,
      leaderMemberId: null,
      subLeaderMemberIds: [],
      isActive: true,
    });
    setErrorMessage("");
    setSuccessMessage("");
    setIsFormOpen(true);
  };

  // 모달 열기 (기존 정원 수정)
  const handleOpenEditForm = (garden) => {
    setEditingGarden(garden);
    setFormData({
      name: garden.name,
      category: garden.category || (garden.name === "나라" || garden.name === "새벽" ? "YOUNG_ADULT" : "ADULT"),
      orderNum: garden.orderNum ?? 0,
      leaderMemberId: garden.leaderMemberId || null,
      subLeaderMemberIds: garden.subLeaderMemberIds || (garden.subLeaderMemberId ? [garden.subLeaderMemberId] : []),
      isActive: Boolean(garden.isActive),
    });
    setErrorMessage("");
    setSuccessMessage("");
    setIsFormOpen(true);
  };

  // 모달 닫기
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingGarden(null);
    setErrorMessage("");
  };

  // 폼 저장 제출
  const handleSubmitForm = async (e) => {
    e?.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage("정원 이름을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (editingGarden) {
        await updateGarden(editingGarden.id, {
          name: formData.name.trim(),
          category: formData.category,
          orderNum: Number(formData.orderNum) || 0,
          leaderMemberId: formData.leaderMemberId,
          subLeaderMemberIds: formData.category === "YOUNG_ADULT" ? formData.subLeaderMemberIds : [],
          isActive: formData.isActive,
        });
        setSuccessMessage(`[${formData.name}] 정원 정보가 수정되었습니다.`);
      } else {
        await createGarden({
          name: formData.name.trim(),
          category: formData.category,
          orderNum: Number(formData.orderNum) || 0,
          leaderMemberId: formData.leaderMemberId,
          subLeaderMemberIds: formData.category === "YOUNG_ADULT" ? formData.subLeaderMemberIds : [],
          isActive: formData.isActive,
        });
        setSuccessMessage(`[${formData.name}] 신규 정원이 등록되었습니다.`);
      }

      setIsFormOpen(false);
      setEditingGarden(null);
      await fetchGardensList();
      onGardensUpdated?.();
    } catch (err) {
      console.error("Save garden error:", err);
      setErrorMessage(err?.response?.data?.message || "정원 저장 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // 삭제 확정 처리
  const handleConfirmDelete = async () => {
    if (!gardenToDelete) return;
    setDeleting(true);
    try {
      await deleteGarden(gardenToDelete.id);
      setGardenToDelete(null);
      setSuccessMessage(`[${gardenToDelete.name}] 정원이 삭제되었습니다.`);
      await fetchGardensList();
      onGardensUpdated?.();
    } catch (err) {
      console.error("Delete garden error:", err);
      alert(err?.response?.data?.message || "정원 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  // 정원 순서 드래그 앤 드롭 및 순서 재배치 적용
  const applyReorder = async (sourceId, targetId) => {
    const fromIndex = gardens.findIndex((g) => g.id === sourceId);
    const toIndex = gardens.findIndex((g) => g.id === targetId);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

    const previousGardens = [...gardens];
    const updated = [...gardens];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    // 순서 번호(orderNum) 1부터 연속 재부여
    const reorderedWithNums = updated.map((item, idx) => ({
      ...item,
      orderNum: idx + 1,
    }));

    // 즉시 로컬 상태 반영 (낙관적 업데이트)
    setGardens(reorderedWithNums);
    setDraggedGardenId(null);
    setDragOverGardenId(null);

    try {
      setIsReordering(true);
      const orderedIds = reorderedWithNums.map((g) => g.id);
      await reorderGardens(orderedIds);
      setSuccessMessage("정원 순서가 성공적으로 저장되었습니다.");
      onGardensUpdated?.();
    } catch (err) {
      console.error("Failed to reorder gardens:", err);
      setErrorMessage(err?.response?.data?.message || "정원 순서 저장 중 오류가 발생했습니다.");
      setGardens(previousGardens); // 실패 시 원복
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragStart = (e, gardenId) => {
    if (searchTerm.trim() || isReordering) {
      e.preventDefault();
      return;
    }
    setDraggedGardenId(gardenId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", gardenId.toString());

    // 순서칸 드래그 시 전체 행을 고스트 프리뷰 이미지로 표시
    const rowEl = e.currentTarget.closest("tr");
    if (rowEl && e.dataTransfer.setDragImage) {
      e.dataTransfer.setDragImage(rowEl, 40, 20);
    }
  };

  const handleDragOver = (e, gardenId) => {
    e.preventDefault();
    if (!draggedGardenId || draggedGardenId === gardenId) return;
    e.dataTransfer.dropEffect = "move";
    if (dragOverGardenId !== gardenId) {
      setDragOverGardenId(gardenId);
    }
  };

  const handleDragLeave = (e, gardenId) => {
    if (dragOverGardenId === gardenId) {
      setDragOverGardenId(null);
    }
  };

  const handleDrop = async (e, targetGardenId) => {
    e.preventDefault();
    const sourceId = draggedGardenId;
    setDraggedGardenId(null);
    setDragOverGardenId(null);
    if (!sourceId || sourceId === targetGardenId) return;

    await applyReorder(sourceId, targetGardenId);
  };

  const handleDragEnd = () => {
    setDraggedGardenId(null);
    setDragOverGardenId(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* ========================================================= */}
      {/* 1. 상단 4대 정원 요약 지표 카드                           */}
      {/* ========================================================= */}
      <Grid container spacing={2}>
        {/* 총 정원수 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              backgroundColor: "#ffffff",
            }}
          >
            <CardContent sx={{ p: 2.2, "&:last-child": { pb: 2.2 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                    전체 정원
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mt: 0.3 }}>
                    {metrics.totalGardens}개
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "rgba(22, 163, 74, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <YardOutlinedIcon sx={{ color: "#16a34a", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 정원 배정 교인 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              backgroundColor: "#ffffff",
            }}
          >
            <CardContent sx={{ p: 2.2, "&:last-child": { pb: 2.2 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                    정원 배정 교인
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#16a34a", mt: 0.3 }}>
                    {metrics.totalAssignedMembers}명
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PeopleAltOutlinedIcon sx={{ color: "#16a34a", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 배정 완료 세대 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              backgroundColor: "#ffffff",
            }}
          >
            <CardContent sx={{ p: 2.2, "&:last-child": { pb: 2.2 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                    정원 배정 세대
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#2563eb", mt: 0.3 }}>
                    {metrics.totalAssignedHouseholds}가구
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "rgba(37, 99, 235, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HomeWorkOutlinedIcon sx={{ color: "#2563eb", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 미배정 세대 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              backgroundColor: "#ffffff",
            }}
          >
            <CardContent sx={{ p: 2.2, "&:last-child": { pb: 2.2 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                    미배정 세대
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      color: metrics.unassignedHouseholds > 0 ? "#ea580c" : "#64748b",
                      mt: 0.3,
                    }}
                  >
                    {metrics.unassignedHouseholds}가구
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: "rgba(234, 88, 12, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HelpOutlineIcon sx={{ color: "#ea580c", fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ========================================================= */}
      {/* 2. 메인 정원 관리 카드                                    */}
      {/* ========================================================= */}
      <Card
        sx={{
          borderRadius: "20px",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.04)",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        {/* 상단 툴바 */}
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            backgroundColor: "#fcfdfc",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <ForestIcon sx={{ color: "#16a34a", fontSize: 26 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#14532d" }}>
                온교회 정원 목록 및 소속 현황
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                소속 가구/교인수를 클릭하면 명단을 바로 확인할 수 있으며, 행을 드래그하여 순서를 바로 변경할 수 있습니다.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            {/* 순서 저장 중 인디케이터 */}
            {isReordering && (
              <Chip
                size="small"
                icon={<CircularProgress size={14} sx={{ color: "#16a34a" }} />}
                label="순서 저장 중..."
                sx={{ backgroundColor: "#f0fdf4", color: "#166534", fontWeight: 700 }}
              />
            )}

            {/* 검색창 */}
            <TextField
              size="small"
              placeholder="정원명, 정원지기 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: { xs: "100%", sm: 240 },
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#94a3b8", fontSize: "1.1rem" }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm("")}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
            />

            <Tooltip title="목록 새로고침">
              <IconButton size="small" onClick={fetchGardensList} disabled={loading}>
                <RefreshIcon fontSize="small" sx={{ color: "#64748b" }} />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateForm}
              sx={{
                borderRadius: "10px",
                backgroundColor: "#16a34a",
                "&:hover": { backgroundColor: "#15803d" },
                fontWeight: 700,
                px: 2.2,
                boxShadow: "0 2px 8px rgba(22, 163, 74, 0.25)",
              }}
            >
              새 정원 등록
            </Button>
          </Box>
        </Box>

        {/* 검색 중 안내 */}
        {searchTerm && (
          <Box sx={{ px: 3, pt: 1.5 }}>
            <Alert severity="info" sx={{ borderRadius: "10px", py: 0.5 }}>
              검색 필터가 적용된 상태에서는 순서 드래그 기능이 비활성화됩니다. 검색어를 지우면 전체 목록에서 순서를 자유롭게 드래그하여 변경할 수 있습니다.
            </Alert>
          </Box>
        )}

        {/* 피드백 메시지 */}
        {errorMessage && (
          <Box sx={{ px: 3, pt: 2 }}>
            <Alert severity="error" sx={{ borderRadius: "10px" }} onClose={() => setErrorMessage("")}>
              {errorMessage}
            </Alert>
          </Box>
        )}
        {successMessage && (
          <Box sx={{ px: 3, pt: 2 }}>
            <Alert severity="success" sx={{ borderRadius: "10px" }} onClose={() => setSuccessMessage("")}>
              {successMessage}
            </Alert>
          </Box>
        )}

        {/* 정원 목록 테이블 */}
        <TableContainer sx={{ minHeight: 360 }}>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ "& th": { backgroundColor: "#f8fafc", fontWeight: 700, color: "#475569", py: 1.5 } }}>
                <TableCell align="center" width="105">
                  <Tooltip title="행을 위아래로 드래그하여 순서를 바꿀 수 있습니다">
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "help" }}>
                      <DragIndicatorIcon sx={{ fontSize: 16, color: "#64748b" }} />
                      <span>순서</span>
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell width="220">정원명</TableCell>
                <TableCell width="220">정원지기 (리더)</TableCell>
                <TableCell align="center" width="150">소속 세대수</TableCell>
                <TableCell align="center" width="150">소속 교인수</TableCell>
                <TableCell align="center" width="120">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && gardens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={32} sx={{ color: "#16a34a" }} />
                  </TableCell>
                </TableRow>
              ) : filteredGardens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8, color: "#94a3b8" }}>
                    {searchTerm ? "검색 조건에 맞는 정원이 없습니다." : "등록된 정원이 없습니다."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredGardens.map((g, index) => {
                  const isUnassigned = g.id === 1;
                  const gMembers = getGardenMembers(g);
                  const gHouseholds = getGardenHouseholds(g);
                  const hCount = g.householdCount !== undefined && g.householdCount !== null ? g.householdCount : gHouseholds.length;
                  const mCount = g.memberCount !== undefined && g.memberCount !== null ? g.memberCount : gMembers.length;
                  const canDrag = !searchTerm.trim() && !isReordering;
                  const isBeingDragged = draggedGardenId === g.id;
                  const isDragOver = dragOverGardenId === g.id && draggedGardenId !== g.id;

                  return (
                    <TableRow
                      key={g.id}
                      hover
                      onDragOver={(e) => handleDragOver(e, g.id)}
                      onDragLeave={(e) => handleDragLeave(e, g.id)}
                      onDrop={(e) => handleDrop(e, g.id)}
                      onClick={() => {
                        setViewingGarden(g);
                        setModalSearchTerm("");
                      }}
                      sx={{
                        backgroundColor: isDragOver
                          ? "rgba(34, 197, 94, 0.08)"
                          : isBeingDragged
                          ? "#f1f5f9"
                          : "inherit",
                        opacity: isBeingDragged ? 0.35 : 1,
                        borderTop: isDragOver ? "3px solid #16a34a" : undefined,
                        borderBottom: isDragOver ? "3px solid #16a34a" : undefined,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: isDragOver ? "rgba(22, 163, 74, 0.08)" : "rgba(22, 163, 74, 0.04)",
                        },
                        transition: "background-color 0.15s ease, opacity 0.15s ease",
                      }}
                    >
                      {/* 순서 & 드래그 핸들 (순서 칸 또는 아이콘을 잡아당겨 순서 변경) */}
                      <TableCell
                        align="center"
                        draggable={canDrag}
                        onDragStart={(e) => handleDragStart(e, g.id)}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          color: "#64748b",
                          fontWeight: 700,
                          py: 1,
                          userSelect: "none",
                          cursor: canDrag ? "grab" : "default",
                          "&:active": {
                            cursor: canDrag ? "grabbing" : "default",
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.4 }}>
                          <Tooltip title={searchTerm ? "검색 중에는 드래그 순서 변경이 불가합니다" : "드래그하여 순서 변경 (위아래로 이동)"}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: searchTerm ? "#cbd5e1" : "#94a3b8",
                                p: 0.3,
                                borderRadius: "4px",
                                "&:hover": { color: searchTerm ? "#cbd5e1" : "#16a34a", backgroundColor: "rgba(22, 163, 74, 0.08)" },
                              }}
                            >
                              <DragIndicatorIcon fontSize="small" />
                            </Box>
                          </Tooltip>

                          <Typography variant="body2" sx={{ fontWeight: 800, minWidth: 20, textAlign: "center" }}>
                            {index + 1}
                          </Typography>

                          {!searchTerm && (
                            <Box sx={{ display: "flex", flexDirection: "column", ml: 0.2 }}>
                              <Tooltip title="한 칸 위로">
                                <span>
                                  <IconButton
                                    size="small"
                                    disabled={index === 0 || isReordering}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (index > 0) applyReorder(g.id, filteredGardens[index - 1].id);
                                    }}
                                    sx={{ p: 0.1, width: 18, height: 14, color: "#64748b", "&:hover": { color: "#16a34a" } }}
                                  >
                                    <KeyboardArrowUpIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <Tooltip title="한 칸 아래로">
                                <span>
                                  <IconButton
                                    size="small"
                                    disabled={index === filteredGardens.length - 1 || isReordering}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (index < filteredGardens.length - 1) applyReorder(g.id, filteredGardens[index + 1].id);
                                    }}
                                    sx={{ p: 0.1, width: 18, height: 14, color: "#64748b", "&:hover": { color: "#16a34a" } }}
                                  >
                                    <KeyboardArrowDownIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Box>
                          )}
                        </Box>
                      </TableCell>

                      {/* 정원명 */}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "8px",
                              backgroundColor: isUnassigned
                                ? "#f1f5f9"
                                : g.category === "YOUNG_ADULT"
                                ? "rgba(124, 58, 237, 0.08)"
                                : "rgba(22, 163, 74, 0.08)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <ForestIcon
                              sx={{
                                color: isUnassigned
                                  ? "#94a3b8"
                                  : g.category === "YOUNG_ADULT"
                                  ? "#7c3aed"
                                  : "#16a34a",
                                fontSize: 18,
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: "#1e293b", fontSize: "0.95rem" }}>
                            {g.name}
                          </Typography>
                          {g.category === "YOUNG_ADULT" ? (
                            <Chip
                              size="small"
                              label="청년"
                              sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                backgroundColor: "rgba(124, 58, 237, 0.1)",
                                color: "#7c3aed",
                                border: "1px solid rgba(124, 58, 237, 0.25)",
                              }}
                            />
                          ) : !isUnassigned && (
                            <Chip
                              size="small"
                              label="장년"
                              sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 600,
                                backgroundColor: "#f1f5f9",
                                color: "#64748b",
                              }}
                            />
                          )}
                          {isUnassigned && (
                            <Chip
                              size="small"
                              label="기본"
                              sx={{
                                height: 20,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                backgroundColor: "#e2e8f0",
                                color: "#475569",
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>

                      {/* 정원지기 및 부정원지기 */}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap" }}>
                          {g.leaderName ? (
                            <Chip
                              size="small"
                              label={g.leaderName}
                              sx={{
                                backgroundColor: "rgba(22, 163, 74, 0.08)",
                                color: "#16a34a",
                                fontWeight: 700,
                                height: 26,
                              }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                              미지정
                            </Typography>
                          )}

                          {(g.subLeaderNames || g.subLeaderName) && (
                            <Tooltip title="청년 정원 부정원지기 (주일 출석체크 및 실무 보조)">
                              <Chip
                                size="small"
                                label={`부지기: ${g.subLeaderNames || g.subLeaderName}`}
                                sx={{
                                  backgroundColor: "rgba(13, 148, 136, 0.08)",
                                  color: "#0f766e",
                                  border: "1px solid rgba(13, 148, 136, 0.25)",
                                  fontWeight: 700,
                                  height: 26,
                                }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>

                      {/* 소속 세대수 (클릭 시 정원 교인 명부 확인) */}
                      <TableCell align="center">
                        <Tooltip title="클릭하여 정원 교인 명부 확인">
                          <Chip
                            size="small"
                            icon={<HomeWorkOutlinedIcon style={{ fontSize: 15 }} />}
                            label={`${hCount}가구`}
                            onClick={() => {
                              setViewingGarden(g);
                              setModalSearchTerm("");
                            }}
                            variant="outlined"
                            sx={{
                              cursor: "pointer",
                              height: 26,
                              fontSize: "0.8rem",
                              borderColor: hCount > 0 ? "#94a3b8" : "#e2e8f0",
                              color: hCount > 0 ? "#1e293b" : "#94a3b8",
                              fontWeight: hCount > 0 ? 800 : 500,
                              backgroundColor: hCount > 0 ? "#f8fafc" : "transparent",
                              "&:hover": {
                                backgroundColor: "#e2e8f0",
                                borderColor: "#64748b",
                              },
                            }}
                          />
                        </Tooltip>
                      </TableCell>

                      {/* 소속 교인수 (클릭 시 정원 교인 명부 확인) */}
                      <TableCell align="center">
                        <Tooltip title="클릭하여 정원 교인 명부 확인">
                          <Chip
                            size="small"
                            icon={<PeopleAltOutlinedIcon style={{ fontSize: 15 }} />}
                            label={`${mCount}명`}
                            onClick={() => {
                              setViewingGarden(g);
                              setModalSearchTerm("");
                            }}
                            variant="outlined"
                            sx={{
                              cursor: "pointer",
                              height: 26,
                              fontSize: "0.8rem",
                              borderColor: mCount > 0 ? "#86efac" : "#e2e8f0",
                              backgroundColor: mCount > 0 ? "rgba(34, 197, 94, 0.08)" : "transparent",
                              color: mCount > 0 ? "#15803d" : "#94a3b8",
                              fontWeight: mCount > 0 ? 800 : 500,
                              "&:hover": {
                                backgroundColor: "rgba(34, 197, 94, 0.18)",
                                borderColor: "#22c55e",
                              },
                            }}
                          />
                        </Tooltip>
                      </TableCell>

                      {/* 관리 버튼 */}
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.8 }}>
                          <Tooltip title="정원 정보 수정 (팝업)">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEditForm(g)}
                              sx={{
                                color: "#3b82f6",
                                backgroundColor: "rgba(59, 130, 246, 0.06)",
                                "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.15)" },
                              }}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {isUnassigned ? (
                            <Tooltip title="기본 정원은 삭제할 수 없습니다">
                              <span>
                                <IconButton size="small" disabled sx={{ color: "#cbd5e1" }}>
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          ) : (
                            <Tooltip title="정원 삭제">
                              <IconButton
                                size="small"
                                onClick={() => setGardenToDelete(g)}
                                sx={{
                                  color: "#ef4444",
                                  backgroundColor: "rgba(239, 68, 68, 0.06)",
                                  "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.15)" },
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ========================================================= */}
      {/* 3. 정원 등록 및 정보 수정 모달 다이얼로그 (중앙 팝업)         */}
      {/* ========================================================= */}
      <Dialog
        open={isFormOpen}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
              boxShadow: "0 16px 48px rgba(0, 0, 0, 0.16)",
              p: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#15803d", display: "flex", alignItems: "center", gap: 1 }}>
          <ForestIcon sx={{ color: "#16a34a" }} />
          {editingGarden ? `[${editingGarden.name}] 정원 정보 수정` : "신규 정원 등록"}
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2.5 }}>
          {/* 수정 모드일 때: 소속 세대 및 교인 현황 요약 박스 */}
          {editingGarden && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2.5,
                borderRadius: "14px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#14532d", mb: 1 }}>
                🌱 [{editingGarden.name}] 소속 현황
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 1.5 }}>
                <Chip
                  icon={<HomeWorkOutlinedIcon style={{ fontSize: 16 }} />}
                  label={`소속 세대: ${editingGarden.householdCount ?? getGardenHouseholds(editingGarden).length}가구`}
                  sx={{ backgroundColor: "#dcfce7", color: "#166534", fontWeight: 700 }}
                />
                <Chip
                  icon={<PeopleAltOutlinedIcon style={{ fontSize: 16 }} />}
                  label={`소속 교인: ${editingGarden.memberCount ?? getGardenMembers(editingGarden).length}명`}
                  sx={{ backgroundColor: "#dcfce7", color: "#166534", fontWeight: 700 }}
                />
              </Box>

              {getGardenMembers(editingGarden).length > 0 && (
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", display: "block", mb: 0.6 }}>
                    소속 교인 명단 ({getGardenMembers(editingGarden).length}명):
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6, maxHeight: 110, overflowY: "auto" }}>
                    {getGardenMembers(editingGarden).map((m) => (
                      <Chip
                        key={m.id}
                        label={`${m.name}${m.isHead ? " (세대주)" : ""}`}
                        size="small"
                        sx={{
                          backgroundColor: m.isHead ? "#bbf7d0" : "#ffffff",
                          border: "1px solid #86efac",
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          )}

          {/* 입력 필드들 */}
          <Grid container spacing={2}>
            {/* 정원명 */}
            <Grid size={12}>
              <TextField
                fullWidth
                required
                size="small"
                label="정원 이름"
                placeholder="예: 에덴1정원, 가나안정원"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                disabled={editingGarden?.id === 1}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            {/* 정원 구분 (장년 / 청년) */}
            <Grid size={12}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b", mb: 0.8, display: "block" }}>
                정원 구분 (부서별 관리 규칙)
              </Typography>
              <ToggleButtonGroup
                value={formData.category}
                exclusive
                onChange={(e, newCategory) => {
                  if (!newCategory) return;
                  setFormData((prev) => ({
                    ...prev,
                    category: newCategory,
                    subLeaderMemberIds: newCategory === "ADULT" ? [] : prev.subLeaderMemberIds,
                  }));
                }}
                fullWidth
                size="small"
                disabled={editingGarden?.id === 1}
                sx={{
                  "& .MuiToggleButton-root": {
                    borderRadius: "10px",
                    py: 0.9,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  },
                  "& .Mui-selected": {
                    backgroundColor: formData.category === "YOUNG_ADULT" ? "rgba(124, 58, 237, 0.12) !important" : "rgba(22, 163, 74, 0.12) !important",
                    color: formData.category === "YOUNG_ADULT" ? "#7c3aed !important" : "#15803d !important",
                    borderColor: formData.category === "YOUNG_ADULT" ? "#7c3aed !important" : "#16a34a !important",
                  },
                }}
              >
                <ToggleButton value="ADULT">
                  장년 정원 (정원 소속만 리더 가능 · 부지기 X)
                </ToggleButton>
                <ToggleButton value="YOUNG_ADULT">
                  청년 정원 (청년 전체 리더 가능 · 부지기 O)
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            {/* 정원지기 선택 */}
            <Grid size={12}>
              {formData.category === "ADULT" && !editingGarden ? (
                <Alert severity="info" sx={{ borderRadius: "10px", fontSize: "0.85rem" }}>
                  장년 정원은 해당 정원에 소속된 성도 중에서만 정원지기를 지정할 수 있습니다. 신규 정원 등록 후 교인 관리에서 성도를 배치한 뒤 정원지기를 지정해 주세요.
                </Alert>
              ) : candidateLeaders.length === 0 ? (
                <Alert severity="warning" sx={{ borderRadius: "10px", fontSize: "0.85rem" }}>
                  {formData.category === "YOUNG_ADULT"
                    ? "등록된 활동 청년 교인이 없습니다."
                    : "현재 정원에 소속된 성도가 없습니다. 교인 관리에서 먼저 성도를 이 정원에 배치해 주세요."}
                </Alert>
              ) : (
                <Autocomplete
                  size="small"
                  options={candidateLeaders}
                  autoHighlight
                  getOptionLabel={(opt) => opt.label || ""}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={candidateLeaders.find((l) => l.id === formData.leaderMemberId) || null}
                  filterOptions={(options, { inputValue }) => {
                    const term = (inputValue || "").trim().toLowerCase();
                    if (!term) return options;
                    return options.filter(
                      (opt) =>
                        (opt.label || "").toLowerCase().includes(term) ||
                        (opt.phone || "").includes(term) ||
                        (opt.phoneClean || "").includes(term)
                    );
                  }}
                  onChange={(e, val) =>
                    setFormData((prev) => ({
                      ...prev,
                      leaderMemberId: val?.id || null,
                      subLeaderMemberIds: (prev.subLeaderMemberIds || []).filter((id) => id !== val?.id),
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={formData.category === "YOUNG_ADULT" ? "정원지기(리더) 선택 (청년부 전체 대상)" : "정원지기(리더) 선택 (소속 교인 중)"}
                      placeholder="교인 성명, 생년월일 또는 소속정원 검색..."
                      helperText={
                        formData.category === "YOUNG_ADULT"
                          ? "청년 정원은 청년부 전체 교인(타 청년 정원 소속 포함) 중에서 정원지기를 지정할 수 있습니다."
                          : "장년 정원은 해당 정원에 소속된 교인 중에서만 선택할 수 있습니다."
                      }
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  )}
                />
              )}
            </Grid>

            {/* 부정원지기 선택 (청년 정원 전용: 복수 선택 지원) */}
            {formData.category === "YOUNG_ADULT" && (
              <Grid size={12}>
                <Autocomplete
                  multiple
                  size="small"
                  options={candidateSubLeaders}
                  autoHighlight
                  getOptionLabel={(opt) => opt.label || ""}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={candidateSubLeaders.filter((l) => (formData.subLeaderMemberIds || []).includes(l.id))}
                  filterOptions={(options, { inputValue }) => {
                    const term = (inputValue || "").trim().toLowerCase();
                    if (!term) return options;
                    return options.filter(
                      (opt) =>
                        (opt.label || "").toLowerCase().includes(term) ||
                        (opt.phone || "").includes(term) ||
                        (opt.phoneClean || "").includes(term)
                    );
                  }}
                  onChange={(e, val) =>
                    setFormData((prev) => ({
                      ...prev,
                      subLeaderMemberIds: val.map((item) => item.id),
                    }))
                  }
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.id}
                        size="small"
                        label={option.name}
                        sx={{
                          backgroundColor: "rgba(13, 148, 136, 0.12)",
                          color: "#0f766e",
                          fontWeight: 700,
                          fontSize: "0.78rem",
                          height: 24,
                        }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="부정원지기 선택 (복수 선택 가능)"
                      placeholder="청년 교인 성명 검색..."
                      helperText="청년 정원의 주일 출석체크 및 소그룹 모임을 도울 부정원지기들을 지정합니다 (1명 이상 복수 지정 가능)."
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseForm} sx={{ color: "#64748b", borderRadius: "10px" }}>
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitForm}
            disabled={submitting}
            sx={{
              borderRadius: "10px",
              backgroundColor: "#16a34a",
              "&:hover": { backgroundColor: "#15803d" },
              fontWeight: 800,
              px: 3,
            }}
          >
            {submitting ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "저장하기"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================= */}
      {/* 4. 정원 교인 명부 모달 다이얼로그 (세대별 지브라 패턴 적용)      */}
      {/* ========================================================= */}
      <Dialog
        open={Boolean(viewingGarden)}
        onClose={() => setViewingGarden(null)}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
              boxShadow: "0 16px 48px rgba(0, 0, 0, 0.16)",
              overflow: "hidden",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: "#15803d",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1.5,
            pt: 2.2,
            px: 3,
            backgroundColor: "#fcfdfc",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                backgroundColor: "rgba(22, 163, 74, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ForestIcon sx={{ color: "#16a34a", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#14532d", lineHeight: 1.2 }}>
                [{viewingGarden?.name}] 정원 교인 명부
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                소속된 가구 및 교인 명단을 세대별 명부 형태로 조회합니다. 교인을 클릭하면 상세 정보를 수정할 수 있습니다.
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setViewingGarden(null)} sx={{ color: "#94a3b8" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* 상단 통계 요약 및 검색 필터 툴바 */}
        <Box
          sx={{
            px: 3,
            py: 1.6,
            backgroundColor: "#fcfdfc",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {/* 상단 정원 현황 요약 칩 */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
            {viewingGarden?.category === "YOUNG_ADULT" ? (
              <Chip
                label="청년 정원"
                sx={{
                  backgroundColor: "rgba(124, 58, 237, 0.1)",
                  color: "#7c3aed",
                  border: "1px solid rgba(124, 58, 237, 0.25)",
                  fontWeight: 700,
                  height: 28,
                }}
              />
            ) : viewingGarden?.id !== 1 && (
              <Chip
                label="장년 정원"
                sx={{ backgroundColor: "#f1f5f9", color: "#475569", fontWeight: 700, height: 28 }}
              />
            )}
            <Chip
              icon={<HomeWorkOutlinedIcon style={{ fontSize: 16 }} />}
              label={`총 ${viewingGarden?.householdCount ?? getGardenHouseholds(viewingGarden).length}가구`}
              sx={{ backgroundColor: "#eff6ff", color: "#1d4ed8", fontWeight: 700, height: 28 }}
            />
            <Chip
              icon={<PeopleAltOutlinedIcon style={{ fontSize: 16 }} />}
              label={`총 ${viewingGarden?.memberCount ?? getGardenMembers(viewingGarden).length}명 성도`}
              sx={{ backgroundColor: "#f0fdf4", color: "#15803d", fontWeight: 700, height: 28 }}
            />
            {viewingGarden?.leaderName ? (
              <Chip
                label={`정원지기: ${viewingGarden.leaderName}`}
                sx={{ backgroundColor: "#fef3c7", color: "#b45309", fontWeight: 700, height: 28 }}
              />
            ) : (
              <Chip
                label="정원지기: 미지정"
                sx={{ backgroundColor: "#f1f5f9", color: "#64748b", fontWeight: 600, height: 28 }}
              />
            )}
            {(viewingGarden?.subLeaderNames || viewingGarden?.subLeaderName) && (
              <Chip
                label={`부정원지기: ${viewingGarden.subLeaderNames || viewingGarden.subLeaderName}`}
                sx={{
                  backgroundColor: "rgba(13, 148, 136, 0.1)",
                  color: "#0f766e",
                  border: "1px solid rgba(13, 148, 136, 0.25)",
                  fontWeight: 700,
                  height: 28,
                }}
              />
            )}
            {modalSortBy !== "household" && (
              <Tooltip title="클릭하면 기본 세대(가구)별 정렬로 복귀합니다">
                <Chip
                  size="small"
                  label={`정렬: ${modalSortBy === "birthDate" ? (modalSortOrder === "asc" ? "생년월일 연장자순 ↑" : "생년월일 연소자순 ↓") : (modalSortOrder === "asc" ? "성명 가나다순 ↑" : "성명 역순 ↓")} (세대별 복귀 ✕)`}
                  onClick={() => {
                    setModalSortBy("household");
                    setModalSortOrder("asc");
                  }}
                  sx={{
                    backgroundColor: "#e0f2fe",
                    color: "#0369a1",
                    fontWeight: 700,
                    height: 28,
                    cursor: "pointer",
                    border: "1px solid #bae6fd",
                    "&:hover": { backgroundColor: "#bae6fd" },
                  }}
                />
              </Tooltip>
            )}
          </Box>

          {/* 모달 내 검색창 */}
          <TextField
            size="small"
            placeholder="성명, 직분, 생년월일, 가족관계, 연락처 검색..."
            value={modalSearchTerm}
            onChange={(e) => setModalSearchTerm(e.target.value)}
            sx={{
              width: { xs: "100%", sm: 280 },
              backgroundColor: "#fff",
              "& .MuiOutlinedInput-root": { borderRadius: "10px" },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8", fontSize: "1rem" }} />
                  </InputAdornment>
                ),
                endAdornment: modalSearchTerm ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setModalSearchTerm("")}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />
        </Box>

        {/* 다이얼로그 본문: 교인 명부 (세대별 지브라 패턴 적용) */}
        <DialogContent sx={{ p: 0, backgroundColor: "#ffffff", maxHeight: "65vh", minHeight: 320, overflowY: "auto" }}>
          {gardenRegistryMembers.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center", color: "#94a3b8" }}>
              <PeopleAltOutlinedIcon sx={{ fontSize: 44, color: "#cbd5e1", mb: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {modalSearchTerm ? "검색 조건에 일치하는 교인이 없습니다." : "정원에 소속된 교인이 없습니다."}
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 620, "& th, & td": { whiteSpace: "nowrap" } }}>
                <TableHead>
                  <TableRow sx={{ "& th": { backgroundColor: "#f1f5f9", fontWeight: 800, color: "#334155", py: 1.3, fontSize: "0.82rem", whiteSpace: "nowrap" } }}>
                    <TableCell sx={{ pl: 3, width: "15%" }}>
                      <TableSortLabel
                        active={modalSortBy === "name"}
                        direction={modalSortBy === "name" ? modalSortOrder : "asc"}
                        onClick={() => handleToggleModalSort("name")}
                        title="성명 순 정렬"
                        sx={{
                          fontWeight: 800,
                          color: modalSortBy === "name" ? "#1d4ed8 !important" : "inherit",
                          "& .MuiTableSortLabel-icon": { color: "#1d4ed8 !important" },
                        }}
                      >
                        성명
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center" sx={{ width: "11%" }}>가족관계</TableCell>
                    <TableCell align="center" sx={{ width: "10%" }}>직분</TableCell>
                    <TableCell align="center" sx={{ width: "18%" }}>
                      <TableSortLabel
                        active={modalSortBy === "birthDate"}
                        direction={modalSortBy === "birthDate" ? modalSortOrder : "asc"}
                        onClick={() => handleToggleModalSort("birthDate")}
                        title="생년월일 순 정렬 (오름차순: 연장자순 / 내림차순: 연소자순)"
                        sx={{
                          fontWeight: 800,
                          color: modalSortBy === "birthDate" ? "#1d4ed8 !important" : "inherit",
                          "& .MuiTableSortLabel-icon": { color: "#1d4ed8 !important" },
                        }}
                      >
                        생년월일
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center" sx={{ width: "11%" }}>세례구분</TableCell>
                    <TableCell sx={{ pr: 3, width: "35%" }}>연락처</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gardenRegistryMembers.map((m, index) => {
                    const relKey = m.relationship || (m.isHead ? "HEAD" : "OTHER");
                    const relMeta = RELATIONSHIP_COLORS[relKey] || RELATIONSHIP_COLORS.OTHER;
                    const relLabel = RELATIONSHIP_LABELS[relKey] || (m.isHead ? "세대주" : "-");
                    const isLeader = viewingGarden?.leaderMemberId === m.id || viewingGarden?.leaderName === m.name;
                    const isSubLeader = Boolean(
                      (viewingGarden?.subLeaderMemberIds && viewingGarden.subLeaderMemberIds.includes(m.id)) ||
                      (viewingGarden?.subLeaderNames && viewingGarden.subLeaderNames.split(", ").includes(m.name)) ||
                      viewingGarden?.subLeaderMemberId === m.id ||
                      viewingGarden?.subLeaderName === m.name
                    );

                    // 세대별 지브라 패턴 배경색 (가구 단위로 흰색/연회색 교차)
                    const rowBg = m.isZebra ? "#f8fafc" : "#ffffff";
                    const isNewHousehold = m.isFirstInHousehold && index > 0;

                    return (
                      <TableRow
                        key={m.id}
                        hover
                        onClick={() => {
                          if (onOpenEditMemberModal) {
                            const targetUser = (users || []).find((u) => u.id === m.id) || m;
                            onOpenEditMemberModal(targetUser);
                          }
                        }}
                        title={onOpenEditMemberModal ? "클릭하여 교인 상세 정보 수정" : undefined}
                        sx={{
                          cursor: onOpenEditMemberModal ? "pointer" : "default",
                          backgroundColor: rowBg,
                          borderTop: isNewHousehold ? "2px solid #cbd5e1" : "1px solid #f1f5f9",
                          transition: "background-color 0.15s ease",
                          "&:hover": {
                            backgroundColor: "rgba(37, 99, 235, 0.05)",
                          },
                        }}
                      >
                        {/* 교인 성명 및 리더 배지 */}
                        <TableCell sx={{ pl: 3, py: 1.1, verticalAlign: "middle", whiteSpace: "nowrap" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "nowrap" }}>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap" }}>
                              {m.name}
                            </Typography>
                            {isLeader && (
                              <Chip
                                size="small"
                                label="정원지기"
                                sx={{
                                  height: 20,
                                  fontSize: "0.68rem",
                                  fontWeight: 800,
                                  backgroundColor: "#fef3c7",
                                  color: "#b45309",
                                  border: "1px solid #fde68a",
                                  whiteSpace: "nowrap",
                                }}
                              />
                            )}
                            {isSubLeader && (
                              <Chip
                                size="small"
                                label="부정원지기"
                                sx={{
                                  height: 20,
                                  fontSize: "0.68rem",
                                  fontWeight: 800,
                                  backgroundColor: "rgba(13, 148, 136, 0.12)",
                                  color: "#0f766e",
                                  border: "1px solid rgba(13, 148, 136, 0.3)",
                                  whiteSpace: "nowrap",
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>

                        {/* 가족관계 */}
                        <TableCell align="center" sx={{ py: 1.1, verticalAlign: "middle", whiteSpace: "nowrap" }}>
                          <Chip
                            size="small"
                            label={relLabel}
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              backgroundColor: relMeta.bg,
                              color: relMeta.color,
                              border: `1px solid ${relMeta.border}`,
                              whiteSpace: "nowrap",
                            }}
                          />
                        </TableCell>

                        {/* 직분 */}
                        <TableCell align="center" sx={{ py: 1.1, verticalAlign: "middle", whiteSpace: "nowrap" }}>
                          <Chip
                            size="small"
                            label={m.position || "성도"}
                            sx={{ height: 20, fontSize: "0.72rem", backgroundColor: "#f1f5f9", color: "#334155", whiteSpace: "nowrap" }}
                          />
                        </TableCell>

                        {/* 생년월일 */}
                        <TableCell align="center" sx={{ py: 1.1, verticalAlign: "middle", whiteSpace: "nowrap" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.82rem",
                              color: m.birthDate ? "#334155" : "#cbd5e1",
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {m.birthDate ? String(m.birthDate).split("T")[0] : "-"}
                          </Typography>
                        </TableCell>

                        {/* 세례구분 */}
                        <TableCell align="center" sx={{ py: 1.1, verticalAlign: "middle", whiteSpace: "nowrap" }}>
                          {m.baptismStatus && m.baptismStatus !== "NONE" ? (
                            <Chip
                              size="small"
                              label={BAPTISM_LABELS[m.baptismStatus]?.label || m.baptismStatus}
                              sx={{
                                height: 18,
                                fontSize: "0.68rem",
                                backgroundColor: BAPTISM_LABELS[m.baptismStatus]?.bg || "#f8fafc",
                                color: BAPTISM_LABELS[m.baptismStatus]?.color || "#475569",
                                whiteSpace: "nowrap",
                              }}
                            />
                          ) : (
                            <Typography variant="caption" sx={{ color: "#cbd5e1" }}>
                              -
                            </Typography>
                          )}
                        </TableCell>

                        {/* 연락처 */}
                        <TableCell sx={{ pr: 3, py: 1.1, verticalAlign: "middle", whiteSpace: "nowrap" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.82rem",
                              color: m.phone ? "#334155" : "#cbd5e1",
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {m.phone ? formatPhoneNumber(m.phone) : "-"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 1.8, backgroundColor: "#fcfdfc", borderTop: "1px solid #f1f5f9", justifyContent: "space-between" }}>
          <Button
            size="small"
            startIcon={<EditOutlinedIcon />}
            onClick={() => {
              const target = viewingGarden;
              setViewingGarden(null);
              handleOpenEditForm(target);
            }}
            sx={{ color: "#16a34a", fontWeight: 700 }}
          >
            정원 정보 수정하기
          </Button>
          <Button
            onClick={() => setViewingGarden(null)}
            variant="contained"
            sx={{
              borderRadius: "10px",
              backgroundColor: "#16a34a",
              "&:hover": { backgroundColor: "#15803d" },
              fontWeight: 700,
              px: 3,
            }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================= */}
      {/* 5. 정원 삭제 확인 서브 다이얼로그                              */}
      {/* ========================================================= */}
      <Dialog
        open={Boolean(gardenToDelete)}
        onClose={() => setGardenToDelete(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "18px", p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#dc2626" }}>
          정원 삭제 확인
        </DialogTitle>
        <DialogContent>
          {(gardenToDelete?.householdCount ?? getGardenHouseholds(gardenToDelete).length) > 0 ? (
            <Box>
              <Alert severity="warning" sx={{ mb: 2, borderRadius: "10px" }}>
                현재 <strong>[{gardenToDelete?.name}]</strong>에 소속된 세대가 <strong>{gardenToDelete?.householdCount ?? getGardenHouseholds(gardenToDelete).length}가구</strong>(교인 {gardenToDelete?.memberCount ?? getGardenMembers(gardenToDelete).length}명) 있습니다.
              </Alert>
              <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                안전한 교적 관리를 위해, 소속 세대가 있는 정원은 직접 삭제할 수 없습니다.
                <br /><br />
                소속 가구를 다른 정원으로 먼저 이동시키거나, 해당 정원의 운영 상태를 <strong>[미운영(비활성)]</strong>으로 변경해 주세요.
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.6 }}>
              정말 <strong>[{gardenToDelete?.name}]</strong> 정원을 삭제하시겠습니까?
              <br />
              현재 소속된 세대가 없으므로 안전하게 영구 삭제됩니다.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button onClick={() => setGardenToDelete(null)} sx={{ color: "#64748b" }}>
            {(gardenToDelete?.householdCount ?? getGardenHouseholds(gardenToDelete).length) > 0 ? "확인" : "취소"}
          </Button>
          {(gardenToDelete?.householdCount ?? getGardenHouseholds(gardenToDelete).length) === 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              disabled={deleting}
              sx={{ borderRadius: "8px", fontWeight: 700 }}
            >
              {deleting ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "삭제 확정"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

GardenManagementDashboard.propTypes = {
  users: PropTypes.array,
  onGardensUpdated: PropTypes.func,
  onOpenEditMemberModal: PropTypes.func,
};

export default GardenManagementDashboard;
