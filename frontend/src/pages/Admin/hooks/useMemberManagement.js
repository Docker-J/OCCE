/**
 * @file useMemberManagement.js
 * @description 교인 관리 비즈니스 로직, 데이터 페칭, 검색/필터링 및 API 상태를 캡슐화한 커스텀 훅
 */

import { useState, useEffect, useRef, useDeferredValue, useOptimistic, startTransition } from "react";
import { useShallow } from "zustand/react/shallow";
import useAuthStore from "../../../store/useAuthStore";
import useSnackbar from "../../../util/useSnackbar";
import { getAdminUsers, updateUserRole, deleteUser } from "../../../api/admin";
import { getGardenNames } from "../../../api/attendance";

export const useMemberManagement = () => {
  const { openSnackbar } = useSnackbar();
  const { authenticated, authInitialized, admin } = useAuthStore(
    useShallow((state) => ({
      authenticated: state.authenticated,
      authInitialized: state.authInitialized,
      admin: state.admin,
    }))
  );

  // 데이터 상태
  const [users, setUsers] = useState([]);
  const [optimisticUsers, setOptimisticUsers] = useOptimistic(
    users,
    (state, update) => {
      if (update.type === "updateRole" || update.type === "update_role") {
        return state.map((u) =>
          u.username === update.username
            ? {
                ...u,
                role: update.role !== undefined ? update.role : u.role,
                isGardenKeeper:
                  update.isGardenKeeper !== undefined
                    ? update.isGardenKeeper
                    : update.role === "keeper",
                garden: update.garden !== undefined ? update.garden : u.garden,
              }
            : u
        );
      }
      if (update.type === "delete") {
        return state.filter((u) => u.username !== update.username);
      }
      return state;
    }
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFetchingRef = useRef(false);

  // 검색, 필터, 정렬, 페이지네이션
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const isSearchPending = searchTerm !== deferredSearchTerm;

  const [roleFilter, setRoleFilter] = useState("all");
  const [gardenFilter, setGardenFilter] = useState("all");
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortDirection, setSortDirection] = useState("asc");

  // 정원 목록 및 작업 상태
  const [availableGardens, setAvailableGardens] = useState([]);
  const [actionLoadingUser, setActionLoadingUser] = useState(null);

  // 모달 대상 유저 상태 (모달 내부 상태는 모달 컴포넌트로 국소화)
  const [userForRoleModal, setUserForRoleModal] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 교인 데이터 페칭
  const fetchUsers = async (isManualRefresh = false) => {
    if (!authenticated || !admin || isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getAdminUsers();
      setUsers(data?.users ?? []);
      if (isManualRefresh) {
        openSnackbar("success", "교인 목록을 새로고침했습니다.");
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

  // 초기 데이터 및 정원 목록 로드
  useEffect(() => {
    if (authInitialized && authenticated && admin) {
      fetchUsers();
      getGardenNames()
        .then((names) => {
          if (names?.length) setAvailableGardens([...names].sort());
        })
        .catch((err) => console.warn("Could not fetch gardens list:", err));
    }
  }, [authInitialized, authenticated, admin]);

  // 필터 조건 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setPage(0);
  }, [deferredSearchTerm, roleFilter, gardenFilter, notificationFilter, sortDirection]);

  // 검색/필터링/정렬 (React Compiler 자동 최적화)
  const search = deferredSearchTerm.trim().toLowerCase();
  const filteredUsers = optimisticUsers
    .filter((u) => {
      if (search) {
        const nameMatch = (u?.name ?? "").toLowerCase().includes(search);
        const phoneMatch = (u?.phone ?? "").replace(/\D/g, "").includes(search);
        if (!nameMatch && !phoneMatch) return false;
      }
      if (roleFilter === "staff" && !u.isStaff) return false;
      if (roleFilter === "keeper" && !u.isGardenKeeper) return false;
      if (roleFilter === "member" && (u.isGardenKeeper || u.isStaff)) return false;

      if (gardenFilter !== "all") {
        const assigned = (u?.garden ?? "").split(",").map((g) => g.trim()).filter(Boolean);
        if (!assigned.includes(gardenFilter)) return false;
      }

      if (notificationFilter === "enabled" && !u.hasNotification) return false;
      if (notificationFilter === "disabled" && u.hasNotification) return false;

      return true;
    })
    .sort((a, b) => {
      const nameA = (a?.name ?? "").trim();
      const nameB = (b?.name ?? "").trim();
      const cmp = nameA.localeCompare(nameB, "ko");
      return sortDirection === "asc" ? cmp : -cmp;
    });

  const start = page * rowsPerPage;
  const paginatedUsers = filteredUsers.slice(start, start + rowsPerPage);

  const metrics = {
    total: optimisticUsers.length,
    staffCount: optimisticUsers.filter((u) => u.isStaff).length,
    keepers: optimisticUsers.filter((u) => u.isGardenKeeper).length,
    notificationEnabled: optimisticUsers.filter((u) => u.hasNotification).length,
  };

  const handleRequestSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(0);
  };

  // 정원지기 역할 및 정원 저장/해제 (useOptimistic)
  const handleSaveRoleAndGardens = (actionToRun, selectedGardens) => {
    if (!userForRoleModal) return;
    const targetUser = userForRoleModal;
    const action = actionToRun || (targetUser.isGardenKeeper ? "update_gardens" : "assign");

    if (action !== "remove" && selectedGardens.length === 0) {
      openSnackbar("error", "최소 1개 이상의 담당 정원을 선택해 주세요.");
      return;
    }

    const updatedGardenStr = action === "remove" ? "" : selectedGardens.join(", ");
    const nextRole = action === "remove" ? "member" : "keeper";
    const nextIsKeeper = action !== "remove";

    setUserForRoleModal(null);
    setUpdatingRole(true);

    startTransition(async () => {
      setOptimisticUsers({
        type: "updateRole",
        username: targetUser.username,
        role: nextRole,
        isGardenKeeper: nextIsKeeper,
        garden: updatedGardenStr,
      });

      try {
        await updateUserRole(targetUser.username, action, selectedGardens);

        setUsers((prev) =>
          prev.map((u) =>
            u.username === targetUser.username
              ? { ...u, isGardenKeeper: nextIsKeeper, garden: updatedGardenStr, role: nextRole }
              : u
          )
        );

        openSnackbar(
          "success",
          action === "remove"
            ? `${targetUser.name || "교인"}님의 정원지기 역할이 해제되었습니다.`
            : `${targetUser.name || "교인"}님의 담당 정원이 [${updatedGardenStr}]으로 ${
                targetUser.isGardenKeeper ? "수정" : "배정"
              }되었습니다.`
        );
      } catch (error) {
        console.error("Role update failed:", error);
        openSnackbar("error", error?.response?.data?.message ?? "역할/정원 변경 중 오류가 발생했습니다.");
      } finally {
        setUpdatingRole(false);
      }
    });
  };

  // 계정 삭제 확정 (useOptimistic)
  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    const targetUser = userToDelete;
    setUserToDelete(null);
    setDeleting(true);

    startTransition(async () => {
      setOptimisticUsers({
        type: "delete",
        username: targetUser.username,
      });

      try {
        await deleteUser(targetUser.username);
        setUsers((prev) => prev.filter((u) => u.username !== targetUser.username));
        openSnackbar("success", `${targetUser.name || "교인"}님의 계정이 삭제되었습니다.`);
      } catch (error) {
        console.error("Delete user failed:", error);
        openSnackbar("error", error?.response?.data?.message ?? "교인 계정 삭제에 실패했습니다.");
      } finally {
        setDeleting(false);
      }
    });
  };

  return {
    state: {
      users: optimisticUsers,
      optimisticUsers,
      authInitialized,
      authenticated,
      admin,
      loading,
      refreshing,
      searchTerm,
      isSearchPending,
      roleFilter,
      gardenFilter,
      notificationFilter,
      page,
      rowsPerPage,
      sortDirection,
      availableGardens,
      actionLoadingUser,
      filteredUsers,
      paginatedUsers,
      metrics,
      userForRoleModal,
      updatingRole,
      userToDelete,
      deleting,
    },
    actions: {
      setSearchTerm,
      setRoleFilter,
      setGardenFilter,
      setNotificationFilter,
      setPage,
      setRowsPerPage,
      setSortDirection,
      handleRequestSort,
      fetchUsers,
      setUserForRoleModal,
      handleSaveRoleAndGardens,
      setUserToDelete,
      handleConfirmDelete,
      setAvailableGardens,
    },
  };
};

export default useMemberManagement;
