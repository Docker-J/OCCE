/**
 * @file useMemberManagement.js
 * @description 교인 및 교적 관리 비즈니스 로직, 데이터 페칭, 필터링/검색, 풀 CRUD 및 모달 상태를 관리하는 커스텀 훅
 */

import { useState, useEffect, useRef, useDeferredValue } from "react";
import useAuthStore from "../../../store/useAuthStore";
import useSnackbar from "../../../util/useSnackbar";
import {
  getAdminUsers,
  createMember,
  updateMember,
  updateMemberStatus,
  deleteMember,
  importRosterFromDrive,
  getAdminGardens,
  getAdminHouseholds,
  bulkSaveHousehold,
  updateUserRole,
  deleteUser,
} from "../../../api/admin";

export const useMemberManagement = () => {
  const { openSnackbar } = useSnackbar();
  const authenticated = useAuthStore((state) => state.authenticated);
  const authInitialized = useAuthStore((state) => state.authInitialized);
  const admin = useAuthStore((state) => state.admin);

  // 데이터 상태
  const [users, setUsers] = useState([]);
  const [availableGardens, setAvailableGardens] = useState([]);
  const [availableHouseholds, setAvailableHouseholds] = useState([]);
  const [backendMetrics, setBackendMetrics] = useState(null);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [submittingMember, setSubmittingMember] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isFetchingRef = useRef(false);

  // 검색, 필터, 정렬, 페이지네이션
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const isSearchPending = searchTerm !== deferredSearchTerm;

  const [registrationFilter, setRegistrationFilter] = useState("all"); // 'all', 'registered', 'unregistered'
  const [roleFilter, setRoleFilter] = useState("all"); // 'all', 'pastor', 'keeper', 'staff', 'member'
  const [gardenFilter, setGardenFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active"); // 'active', 'all', 'removed'
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortDirection, setSortDirection] = useState("asc");

  // 모달 대상 상태
  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [memberForEdit, setMemberForEdit] = useState(null);
  const [userForRoleModal, setUserForRoleModal] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [actionLoadingUser, setActionLoadingUser] = useState(null);

  // 교인 데이터 및 메타데이터 페칭
  const fetchUsers = async (isManualRefresh = false) => {
    if (!authenticated || !admin || isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [usersData, gardensData, householdsData] = await Promise.all([
        getAdminUsers(),
        getAdminGardens().catch(() => ({ gardens: [] })),
        getAdminHouseholds().catch(() => ({ households: [] })),
      ]);

      const memberList = usersData?.members || usersData?.users || [];
      setUsers(memberList);

      setBackendMetrics({
        total: usersData?.total ?? memberList.length,
        householdCount: usersData?.householdCount ?? 0,
        registeredCount: usersData?.registeredCount ?? 0,
        notificationEnabled: usersData?.notificationEnabled ?? 0,
        staffCount: usersData?.staffCount ?? 0,
        keepers: usersData?.keepers ?? 0,
        clergyCount: usersData?.clergyCount ?? 0,
      });

      if (gardensData?.gardens?.length) {
        setAvailableGardens(gardensData.gardens);
      }
      if (householdsData?.households?.length) {
        setAvailableHouseholds(householdsData.households);
      }

      if (isManualRefresh) {
        openSnackbar("success", "교인 및 교적 목록을 새로고침했습니다.");
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      openSnackbar("error", error?.response?.data?.message ?? "교인 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFetchingRef.current = false;
    }
  };

  const refreshGardens = async () => {
    try {
      const gardensData = await getAdminGardens();
      if (gardensData?.gardens) {
        setAvailableGardens(gardensData.gardens);
      }
    } catch (e) {
      console.error("Failed to refresh gardens:", e);
    }
  };

  useEffect(() => {
    if (authInitialized && authenticated && admin) {
      fetchUsers();
    }
  }, [authInitialized, authenticated, admin]);

  // 필터 조건 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setPage(0);
  }, [
    deferredSearchTerm,
    registrationFilter,
    roleFilter,
    gardenFilter,
    statusFilter,
    notificationFilter,
    sortDirection,
  ]);

  // 1. 세대별 세대주 성명 및 구성원 수 맵 생성 (세대 묶음 정렬 및 단독 세대 판별 기준)
  const headNameMap = new Map();
  const householdMemberCountMap = new Map();
  users.forEach((u) => {
    if (u.householdId) {
      if (u.status !== "REMOVED") {
        householdMemberCountMap.set(
          u.householdId,
          (householdMemberCountMap.get(u.householdId) || 0) + 1
        );
      }
      if (u.isHead && (!headNameMap.has(u.householdId) || u.status !== "REMOVED")) {
        headNameMap.set(u.householdId, (u.name || "").trim());
      }
    }
  });
  users.forEach((u) => {
    if (u.householdId && !headNameMap.has(u.householdId)) {
      const fallback = (u.headName || u.householdName || u.name || "").replace(/(성도\s*가정|가정)/g, "").trim();
      headNameMap.set(u.householdId, fallback || u.name || "");
    }
  });

  const getRelationshipRank = (m) => {
    if (m.isHead) return 0;
    switch (m.relationship) {
      case "HEAD": return 0;
      case "SPOUSE": return 1;
      case "CHILD": return 2;
      case "PARENT": return 3;
      default: return 4;
    }
  };

  // 검색/필터링/정렬 (세대주 이름 기준 가정 묶음 정렬)
  const search = deferredSearchTerm.trim().toLowerCase();
  const filteredUsers = users
    .filter((u) => {
      // 1. 상태 필터 (ACTIVE / REMOVED)
      if (statusFilter === "active" && u.status === "REMOVED") return false;
      if (statusFilter === "removed" && u.status !== "REMOVED") return false;

      // 2. 검색어 (성명, 전화번호, 세대명, 주소, 세대주 성명)
      if (search) {
        const nameMatch = (u?.name ?? "").toLowerCase().includes(search);
        const nameEnMatch = (u?.nameEn ?? "").toLowerCase().includes(search);
        const phoneMatch = (u?.phone ?? "").replace(/\D/g, "").includes(search);
        const householdMatch = (u?.householdName ?? "").toLowerCase().includes(search);
        const addressMatch = ([u?.addressDetail, u?.address, u?.city, u?.postalCode].filter(Boolean).join(" ")).toLowerCase().includes(search);
        const headMatch = (headNameMap.get(u.householdId) ?? "").toLowerCase().includes(search);
        if (!nameMatch && !nameEnMatch && !phoneMatch && !householdMatch && !addressMatch && !headMatch) return false;
      }

      // 3. 웹 가입 여부 필터
      if (registrationFilter === "registered" && !u.isRegistered) return false;
      if (registrationFilter === "unregistered" && u.isRegistered) return false;

      // 4. 직분/부서 필터
      if (roleFilter === "pastor" && u.position !== "교역자") return false;
      if (roleFilter === "staff" && !u.isStaff) return false;
      if (roleFilter === "keeper" && !u.isGardenKeeper) return false;
      if (roleFilter === "member" && (u.isGardenKeeper || u.isStaff || u.position === "교역자" || (u.department && u.department !== "장년부"))) return false;
      if (roleFilter === "young_adult" && u.department !== "청년부") return false;
      if (roleFilter === "youth" && u.department !== "중고등부") return false;
      if (roleFilter === "elementary" && u.department !== "유초등부") return false;
      if (roleFilter === "kindergarten" && u.department !== "유치부") return false;

      // 5. 정원 필터
      if (gardenFilter !== "all") {
        const assignedGarden = u.gardenName || u.garden || "";
        if (!assignedGarden.includes(gardenFilter)) return false;
      }

      // 6. 알림 수신 필터
      if (notificationFilter === "enabled" && !u.hasNotification) return false;
      if (notificationFilter === "disabled" && u.hasNotification) return false;

      return true;
    })
    .sort((a, b) => {
      // 1차 정렬: 세대주 성명 기준 (가정 묶음)
      const headA = headNameMap.get(a.householdId) || a.headName || a.name || "";
      const headB = headNameMap.get(b.householdId) || b.headName || b.name || "";
      const headCmp = headA.localeCompare(headB, "ko");
      if (headCmp !== 0) {
        return sortDirection === "asc" ? headCmp : -headCmp;
      }

      // 2차 정렬: 동명이인 세대주 간 householdId 구분 유지
      if (a.householdId !== b.householdId) {
        return (a.householdId || 0) - (b.householdId || 0);
      }

      // 3차 정렬: 세대 내부 위계 (세대주 -> 배우자 -> 자녀 -> 부모 -> 기타)
      const rankA = getRelationshipRank(a);
      const rankB = getRelationshipRank(b);
      if (rankA !== rankB) {
        return rankA - rankB;
      }

      // 4차 정렬: 동일 관계일 경우 생년월일 또는 성명순
      if (a.birthDate && b.birthDate) {
        return a.birthDate.localeCompare(b.birthDate);
      }
      return (a.name || "").localeCompare(b.name || "", "ko");
    });

  // 세대별 지브라 스트라이프(교차 색상)를 위한 세대 그룹 인덱스 계산
  let currentGroup = 0;
  let lastHouseholdKey = null;

  const usersWithHouseholdIndex = filteredUsers.map((u, i) => {
    const householdKey = u.householdId ? `h_${u.householdId}` : `m_${u.id}`;
    if (i > 0 && householdKey !== lastHouseholdKey) {
      currentGroup += 1;
    }
    lastHouseholdKey = householdKey;
    return {
      ...u,
      householdGroupIndex: currentGroup,
      isAlternateHousehold: currentGroup % 2 === 1,
    };
  });

  // 세대(가정) 단위 그룹핑
  const householdGroups = [];
  let currentBlock = [];
  let currentBlockKey = null;

  usersWithHouseholdIndex.forEach((u) => {
    const key = u.householdId ? `h_${u.householdId}` : `m_${u.id}`;
    if (key !== currentBlockKey) {
      if (currentBlock.length > 0) {
        householdGroups.push(currentBlock);
      }
      currentBlock = [u];
      currentBlockKey = key;
    } else {
      currentBlock.push(u);
    }
  });
  if (currentBlock.length > 0) {
    householdGroups.push(currentBlock);
  }

  // 페이지네이션 없이 전체 세대/교인 연속 스크롤 렌더링
  const displayUsers = usersWithHouseholdIndex.map((u, idx) => {
    const prev = idx > 0 ? usersWithHouseholdIndex[idx - 1] : null;
    const isFirstInHousehold = !prev || prev.householdId !== u.householdId;
    const next = idx < usersWithHouseholdIndex.length - 1 ? usersWithHouseholdIndex[idx + 1] : null;
    const isLastInHousehold = !next || next.householdId !== u.householdId;
    const memberCount = u.householdId ? (householdMemberCountMap.get(u.householdId) || 0) : 1;
    const isSingleHousehold = !u.householdId || memberCount <= 1;
    return {
      ...u,
      isFirstInHousehold,
      isLastInHousehold,
      isSingleHousehold,
      householdMemberCount: memberCount,
    };
  });

  const activeUsers = users.filter((u) => u.status !== "REMOVED");
  const metrics = backendMetrics || {
    total: activeUsers.length,
    householdCount: new Set(activeUsers.map((u) => u.householdId).filter(Boolean)).size,
    registeredCount: activeUsers.filter((u) => u.isRegistered).length,
    notificationEnabled: activeUsers.filter((u) => u.hasNotification).length,
    staffCount: activeUsers.filter((u) => u.isStaff).length,
    keepers: activeUsers.filter((u) => u.isGardenKeeper).length,
    clergyCount: activeUsers.filter((u) => u.position === "교역자").length,
    removedCount: users.filter((u) => u.status === "REMOVED").length,
  };

  const handleRequestSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(0);
  };

  // 모달 열기 핸들러
  const handleOpenCreateModal = () => {
    setMemberForEdit(null);
    setMemberFormOpen(true);
  };

  const handleOpenEditModal = (member) => {
    setMemberForEdit(member);
    setMemberFormOpen(true);
  };

  // 신규 등록 및 수정 처리
  const handleSubmitMemberForm = async (payload) => {
    setSubmittingMember(true);
    try {
      console.log("[useMemberManagement] Submitting member form:", { editId: memberForEdit?.id, payload });
      if (payload.isBulk) {
        await bulkSaveHousehold(payload);
        openSnackbar("success", "세대 및 구성원 정보가 성공적으로 저장되었습니다.");
      } else if (memberForEdit?.id != null) {
        await updateMember(memberForEdit.id, payload);
        openSnackbar("success", `${payload.name}님의 정보가 성공적으로 수정되었습니다.`);
      } else {
        await createMember(payload);
        openSnackbar("success", `${payload.name}님이 새 교인으로 등록되었습니다.`);
      }
      setMemberFormOpen(false);
      setMemberForEdit(null);
      await fetchUsers(true);
    } catch (error) {
      console.error("Member submit failed:", error);
      openSnackbar("error", error?.response?.data?.message ?? "교인 정보 저장에 실패했습니다.");
    } finally {
      setSubmittingMember(false);
    }
  };

  // 세대 독립(분가) 처리
  const handleSeparateMember = async (memberId, separationData) => {
    setSubmittingMember(true);
    try {
      await updateMember(memberId, {
        isSeparateHousehold: true,
        ...separationData,
      });
      openSnackbar("success", `${separationData.name || "교인"}님이 새 가구로 성공적으로 분가되었습니다.`);
      setMemberFormOpen(false);
      setMemberForEdit(null);
      await fetchUsers(true);
    } catch (error) {
      console.error("Separation failed:", error);
      openSnackbar("error", error?.response?.data?.message ?? "세대 분가 처리에 실패했습니다.");
    } finally {
      setSubmittingMember(false);
    }
  };

  // 제적(REMOVED) 처리
  const handleConfirmRemoveStatus = async (options = {}) => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      if (userToDelete.id != null) {
        const res = await updateMemberStatus(userToDelete.id, "REMOVED", options);
        openSnackbar("success", res.message || `${userToDelete.name}님이 제적 처리되었습니다.`);
      }
      setUserToDelete(null);
      await fetchUsers(true);
    } catch (error) {
      console.error("Status remove failed:", error);
      openSnackbar("error", error?.response?.data?.message ?? "제적 처리에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  // 영구 삭제 처리
  const handleConfirmPermanentDelete = async (options = {}) => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      if (userToDelete.id != null) {
        const res = await deleteMember(userToDelete.id, options);
        openSnackbar("success", res.message || `${userToDelete.name}님의 데이터가 영구 삭제되었습니다.`);
      } else if (userToDelete.username) {
        await deleteUser(userToDelete.username);
        openSnackbar("success", `${userToDelete.name}님의 데이터가 영구 삭제되었습니다.`);
      }
      setUserToDelete(null);
      await fetchUsers(true);
    } catch (error) {
      console.error("Permanent delete failed:", error);
      openSnackbar("error", error?.response?.data?.message ?? "삭제 처리에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  // 구글 드라이브 교적 1회성 가져오기(Import)
  const handleImportFromDrive = async () => {
    setImporting(true);
    try {
      const res = await importRosterFromDrive();
      openSnackbar("success", res.message || "구글 드라이브 교적 데이터를 성공적으로 불러왔습니다.");
      await fetchUsers(true);
    } catch (error) {
      console.error("Drive import failed:", error);
      openSnackbar("error", error?.response?.data?.message ?? "구글 드라이브 교적 가져오기에 실패했습니다.");
    } finally {
      setImporting(false);
    }
  };

  // 정원지기 역할 및 정원 배정 저장/해제
  const handleSaveRoleAndGardens = async (actionToRun, selectedGardens) => {
    if (!userForRoleModal) return;
    const action = actionToRun || (userForRoleModal.isGardenKeeper ? "update_gardens" : "assign");

    if (action !== "remove" && selectedGardens.length === 0) {
      openSnackbar("error", "최소 1개 이상의 담당 정원을 선택해 주세요.");
      return;
    }

    setUpdatingRole(true);
    setActionLoadingUser(userForRoleModal.username);
    try {
      await updateUserRole(userForRoleModal.username, action, selectedGardens);
      const updatedGardenStr = action === "remove" ? "" : selectedGardens.join(", ");

      setUsers((prev) =>
        prev.map((u) =>
          u.username === userForRoleModal.username
            ? { ...u, isGardenKeeper: action !== "remove", garden: updatedGardenStr, gardenName: updatedGardenStr }
            : u
        )
      );

      openSnackbar(
        "success",
        action === "remove"
          ? `${userForRoleModal.name || "교인"}님의 정원지기 역할이 해제되었습니다.`
          : `${userForRoleModal.name || "교인"}님의 담당 정원이 [${updatedGardenStr}]으로 ${
              userForRoleModal.isGardenKeeper ? "수정" : "배정"
            }되었습니다.`
      );
      setUserForRoleModal(null);
    } catch (error) {
      console.error("Role update failed:", error);
      openSnackbar("error", error?.response?.data?.message ?? "역할/정원 변경 중 오류가 발생했습니다.");
    } finally {
      setUpdatingRole(false);
      setActionLoadingUser(null);
    }
  };

  return {
    state: {
      authInitialized,
      authenticated,
      admin,
      loading,
      refreshing,
      importing,
      submittingMember,
      searchTerm,
      isSearchPending,
      registrationFilter,
      roleFilter,
      gardenFilter,
      statusFilter,
      notificationFilter,
      page,
      rowsPerPage,
      sortDirection,
      availableGardens,
      availableHouseholds,
      actionLoadingUser,
      users,
      filteredUsers,
      paginatedUsers: displayUsers,
      displayUsers,
      totalHouseholds: householdGroups.length,
      metrics,
      memberFormOpen,
      memberForEdit,
      userForRoleModal,
      updatingRole,
      userToDelete,
      deleting,
    },
    actions: {
      setSearchTerm,
      setRegistrationFilter,
      setRoleFilter,
      setGardenFilter,
      setStatusFilter,
      setNotificationFilter,
      setPage,
      setRowsPerPage,
      setSortDirection,
      handleRequestSort,
      fetchUsers,
      handleOpenCreateModal,
      handleOpenEditModal,
      setMemberFormOpen,
      handleSubmitMemberForm,
      handleSeparateMember,
      setUserForRoleModal,
      handleSaveRoleAndGardens,
      setUserToDelete,
      handleConfirmRemoveStatus,
      handleConfirmPermanentDelete,
      handleImportFromDrive,
      setAvailableGardens,
      refreshGardens,
    },
  };
};
