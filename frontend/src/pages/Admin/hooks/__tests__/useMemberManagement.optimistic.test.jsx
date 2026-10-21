import React, { act } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import useMemberManagement from "../useMemberManagement";
import useAuthStore from "../../../../store/useAuthStore";
import * as adminApi from "../../../../api/admin";
import * as attendanceApi from "../../../../api/attendance";
import * as useSnackbarModule from "../../../../util/useSnackbar";

// Mock APIs and snackbar
vi.mock("../../../../api/admin", () => ({
  getAdminUsers: vi.fn(),
  updateUserRole: vi.fn(),
  deleteUser: vi.fn(),
}));

vi.mock("../../../../api/attendance", () => ({
  getGardenNames: vi.fn(),
}));

const mockOpenSnackbar = vi.fn();
const mockCloseSnackbar = vi.fn();

vi.mock("../../../../util/useSnackbar", () => ({
  default: () => ({
    openSnackbar: mockOpenSnackbar,
    closeSnackbar: mockCloseSnackbar,
  }),
}));

// Test Harness Component
function MemberManagementTestHarness({ onHookRef }) {
  const hookResult = useMemberManagement();
  onHookRef.current = hookResult;

  const { users, metrics, updatingRole, deleting } = hookResult.state;

  return (
    <div data-testid="harness">
      <div data-testid="metrics-total">{metrics.total}</div>
      <div data-testid="metrics-keepers">{metrics.keepers}</div>
      <div data-testid="metrics-staff">{metrics.staffCount}</div>
      <div data-testid="status-updating">{updatingRole ? "updating" : "idle"}</div>
      <div data-testid="status-deleting">{deleting ? "deleting" : "idle"}</div>
      <ul data-testid="users-list">
        {users.map((u) => (
          <li key={u.username} data-testid={`user-row-${u.username}`}>
            <span data-testid={`role-${u.username}`}>{u.role}</span>
            <span data-testid={`isKeeper-${u.username}`}>{String(u.isGardenKeeper)}</span>
            <span data-testid={`garden-${u.username}`}>{u.garden}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Helper to create a deferred promise for testing pending optimistic states
function createDeferredPromise() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("Empirical Challenger M2: useMemberManagement useOptimistic Stress & Rollback Suite", () => {
  let hookRef;
  const initialUsers = [
    {
      username: "john_doe",
      name: "John Doe",
      role: "member",
      isGardenKeeper: false,
      isStaff: false,
      garden: "",
      hasNotification: true,
      phone: "1234567890",
    },
    {
      username: "keeper_jane",
      name: "Jane Keeper",
      role: "keeper",
      isGardenKeeper: true,
      isStaff: false,
      garden: "Peace",
      hasNotification: false,
      phone: "0987654321",
    },
    {
      username: "staff_mark",
      name: "Mark Staff",
      role: "staff",
      isGardenKeeper: false,
      isStaff: true,
      garden: "",
      hasNotification: true,
      phone: "5555555555",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    hookRef = { current: null };

    // Set up authenticated admin in auth store
    useAuthStore.setState({
      authenticated: true,
      authInitialized: true,
      admin: true,
      isLeader: true,
    });

    // Default API resolves
    adminApi.getAdminUsers.mockResolvedValue({ users: JSON.parse(JSON.stringify(initialUsers)) });
    attendanceApi.getGardenNames.mockResolvedValue(["Peace", "Love", "Joy", "Grace"]);
  });

  afterEach(() => {
    cleanup();
  });

  it("1. loads initial users and metrics correctly", async () => {
    await act(async () => {
      render(<MemberManagementTestHarness onHookRef={hookRef} />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("metrics-total")).toHaveTextContent("3");
    });

    expect(screen.getByTestId("metrics-keepers")).toHaveTextContent("1");
    expect(screen.getByTestId("metrics-staff")).toHaveTextContent("1");
    expect(screen.getByTestId("user-row-john_doe")).toBeInTheDocument();
    expect(screen.getByTestId("role-john_doe")).toHaveTextContent("member");
    expect(screen.getByTestId("isKeeper-john_doe")).toHaveTextContent("false");
  });

  describe("handleSaveRoleAndGardens Optimistic Lifecycle", () => {
    it("2. IMMEDIATELY updates optimisticUsers before updateUserRole resolves (0ms UI latency)", async () => {
      const deferred = createDeferredPromise();
      adminApi.updateUserRole.mockReturnValue(deferred.promise);

      await act(async () => {
        render(<MemberManagementTestHarness onHookRef={hookRef} />);
      });

      await waitFor(() => {
        expect(screen.getByTestId("metrics-total")).toHaveTextContent("3");
      });

      const target = hookRef.current.state.users.find((u) => u.username === "john_doe");
      act(() => {
        hookRef.current.actions.setUserForRoleModal(target);
      });

      // Trigger assign action
      act(() => {
        hookRef.current.actions.handleSaveRoleAndGardens("assign", ["Grace", "Joy"]);
      });

      // Synchronously assert that optimistic state has updated BEFORE promise settlement
      expect(screen.getByTestId("role-john_doe")).toHaveTextContent("keeper");
      expect(screen.getByTestId("isKeeper-john_doe")).toHaveTextContent("true");
      expect(screen.getByTestId("garden-john_doe")).toHaveTextContent("Grace, Joy");
      expect(screen.getByTestId("metrics-keepers")).toHaveTextContent("2");
      expect(screen.getByTestId("status-updating")).toHaveTextContent("updating");

      // Now resolve the API call
      await act(async () => {
        deferred.resolve({ message: "Role updated successfully" });
      });

      // Assert that state remains keeper and updatingRole resets
      expect(screen.getByTestId("role-john_doe")).toHaveTextContent("keeper");
      expect(screen.getByTestId("isKeeper-john_doe")).toHaveTextContent("true");
      expect(screen.getByTestId("metrics-keepers")).toHaveTextContent("2");
      expect(screen.getByTestId("status-updating")).toHaveTextContent("idle");
      expect(mockOpenSnackbar).toHaveBeenCalledWith(
        "success",
        expect.stringContaining("[Grace, Joy]으로 배정되었습니다")
      );
    });

    it("3. CLEANLY ROLLS BACK to previous state when updateUserRole rejects (500 / Network Error)", async () => {
      const deferred = createDeferredPromise();
      adminApi.updateUserRole.mockReturnValue(deferred.promise);

      await act(async () => {
        render(<MemberManagementTestHarness onHookRef={hookRef} />);
      });

      await waitFor(() => {
        expect(screen.getByTestId("metrics-keepers")).toHaveTextContent("1");
      });

      const target = hookRef.current.state.users.find((u) => u.username === "john_doe");
      act(() => {
        hookRef.current.actions.setUserForRoleModal(target);
      });

      // Trigger role update
      act(() => {
        hookRef.current.actions.handleSaveRoleAndGardens("assign", ["Grace"]);
      });

      // Verify optimistic update is visible immediately
      expect(screen.getByTestId("role-john_doe")).toHaveTextContent("keeper");
      expect(screen.getByTestId("metrics-keepers")).toHaveTextContent("2");

      // Reject API call with simulated 500 error
      await act(async () => {
        deferred.reject({
          response: { data: { message: "Internal Server Error 500: Database lock" } },
        });
      });

      // Assert automatic and clean rollback to base state
      expect(screen.getByTestId("role-john_doe")).toHaveTextContent("member");
      expect(screen.getByTestId("isKeeper-john_doe")).toHaveTextContent("false");
      expect(screen.getByTestId("garden-john_doe")).toHaveTextContent("");
      expect(screen.getByTestId("metrics-keepers")).toHaveTextContent("1");
      expect(screen.getByTestId("status-updating")).toHaveTextContent("idle");

      // Verify error snackbar received the error message
      expect(mockOpenSnackbar).toHaveBeenCalledWith(
        "error",
        "Internal Server Error 500: Database lock"
      );
    });

    it("4. handles optimistic role REMOVAL and cleanly rolls back on network failure", async () => {
      const deferred = createDeferredPromise();
      adminApi.updateUserRole.mockReturnValue(deferred.promise);

      await act(async () => {
        render(<MemberManagementTestHarness onHookRef={hookRef} />);
      });

      await waitFor(() => {
        expect(screen.getByTestId("metrics-keepers")).toHaveTextContent("1");
      });

      const keeper = hookRef.current.state.users.find((u) => u.username === "keeper_jane");
      act(() => {
        hookRef.current.actions.setUserForRoleModal(keeper);
      });

      // Trigger remove
      act(() => {
        hookRef.current.actions.handleSaveRoleAndGardens("remove", []);
      });

      // Optimistically removed
      expect(screen.getByTestId("role-keeper_jane")).toHaveTextContent("member");
      expect(screen.getByTestId("isKeeper-keeper_jane")).toHaveTextContent("false");
      expect(screen.getByTestId("garden-keeper_jane")).toHaveTextContent("");
      expect(screen.getByTestId("metrics-keepers")).toHaveTextContent("0");

      // Reject API call
      await act(async () => {
        deferred.reject(new Error("Network Failure"));
      });

      // Rollback to original keeper state
      expect(screen.getByTestId("role-keeper_jane")).toHaveTextContent("keeper");
      expect(screen.getByTestId("isKeeper-keeper_jane")).toHaveTextContent("true");
      expect(screen.getByTestId("garden-keeper_jane")).toHaveTextContent("Peace");
      expect(screen.getByTestId("metrics-keepers")).toHaveTextContent("1");
      expect(mockOpenSnackbar).toHaveBeenCalledWith(
        "error",
        "역할/정원 변경 중 오류가 발생했습니다."
      );
    });
  });

  describe("handleConfirmDelete Optimistic Lifecycle", () => {
    it("5. IMMEDIATELY removes user from optimisticUsers before deleteUser resolves", async () => {
      const deferred = createDeferredPromise();
      adminApi.deleteUser.mockReturnValue(deferred.promise);

      await act(async () => {
        render(<MemberManagementTestHarness onHookRef={hookRef} />);
      });

      await waitFor(() => {
        expect(screen.getByTestId("metrics-total")).toHaveTextContent("3");
      });

      const target = hookRef.current.state.users.find((u) => u.username === "john_doe");
      act(() => {
        hookRef.current.actions.setUserToDelete(target);
      });

      // Trigger delete
      act(() => {
        hookRef.current.actions.handleConfirmDelete();
      });

      // Optimistically deleted immediately before settlement
      expect(screen.queryByTestId("user-row-john_doe")).toBeNull();
      expect(screen.getByTestId("metrics-total")).toHaveTextContent("2");
      expect(screen.getByTestId("status-deleting")).toHaveTextContent("deleting");

      // Resolve API
      await act(async () => {
        deferred.resolve({ message: "User deleted" });
      });

      // Remains deleted and status reset
      expect(screen.queryByTestId("user-row-john_doe")).toBeNull();
      expect(screen.getByTestId("metrics-total")).toHaveTextContent("2");
      expect(screen.getByTestId("status-deleting")).toHaveTextContent("idle");
      expect(mockOpenSnackbar).toHaveBeenCalledWith(
        "success",
        expect.stringContaining("계정이 삭제되었습니다")
      );
    });

    it("6. CLEANLY ROLLS BACK deleted user when deleteUser API rejects", async () => {
      const deferred = createDeferredPromise();
      adminApi.deleteUser.mockReturnValue(deferred.promise);

      await act(async () => {
        render(<MemberManagementTestHarness onHookRef={hookRef} />);
      });

      await waitFor(() => {
        expect(screen.getByTestId("metrics-total")).toHaveTextContent("3");
      });

      const target = hookRef.current.state.users.find((u) => u.username === "keeper_jane");
      act(() => {
        hookRef.current.actions.setUserToDelete(target);
      });

      // Trigger delete
      act(() => {
        hookRef.current.actions.handleConfirmDelete();
      });

      // Optimistically gone
      expect(screen.queryByTestId("user-row-keeper_jane")).toBeNull();
      expect(screen.getByTestId("metrics-total")).toHaveTextContent("2");
      expect(screen.getByTestId("metrics-keepers")).toHaveTextContent("0");

      // Reject API
      await act(async () => {
        deferred.reject({
          response: { data: { message: "Cannot delete user with active commitments" } },
        });
      });

      // Automatic clean rollback
      expect(screen.getByTestId("user-row-keeper_jane")).toBeInTheDocument();
      expect(screen.getByTestId("metrics-total")).toHaveTextContent("3");
      expect(screen.getByTestId("metrics-keepers")).toHaveTextContent("1");
      expect(screen.getByTestId("status-deleting")).toHaveTextContent("idle");
      expect(mockOpenSnackbar).toHaveBeenCalledWith(
        "error",
        "Cannot delete user with active commitments"
      );
    });
  });

  describe("Validation & Adversarial Edge Cases", () => {
    it("7. validates empty gardens on role assign without triggering optimistic transition", async () => {
      await act(async () => {
        render(<MemberManagementTestHarness onHookRef={hookRef} />);
      });

      await waitFor(() => {
        expect(screen.getByTestId("metrics-total")).toHaveTextContent("3");
      });

      const target = hookRef.current.state.users.find((u) => u.username === "john_doe");
      act(() => {
        hookRef.current.actions.setUserForRoleModal(target);
      });

      // Attempt to assign with empty gardens
      act(() => {
        hookRef.current.actions.handleSaveRoleAndGardens("assign", []);
      });

      // Assert no transition occurred, validation error shown
      expect(mockOpenSnackbar).toHaveBeenCalledWith(
        "error",
        "최소 1개 이상의 담당 정원을 선택해 주세요."
      );
      expect(adminApi.updateUserRole).not.toHaveBeenCalled();
      expect(screen.getByTestId("role-john_doe")).toHaveTextContent("member");
    });

    it("8. gracefully ignores handleSaveRoleAndGardens if userForRoleModal is null", async () => {
      await act(async () => {
        render(<MemberManagementTestHarness onHookRef={hookRef} />);
      });

      act(() => {
        hookRef.current.actions.handleSaveRoleAndGardens("assign", ["Grace"]);
      });

      expect(adminApi.updateUserRole).not.toHaveBeenCalled();
      expect(mockOpenSnackbar).not.toHaveBeenCalled();
    });

    it("9. gracefully ignores handleConfirmDelete if userToDelete is null", async () => {
      await act(async () => {
        render(<MemberManagementTestHarness onHookRef={hookRef} />);
      });

      act(() => {
        hookRef.current.actions.handleConfirmDelete();
      });

      expect(adminApi.deleteUser).not.toHaveBeenCalled();
      expect(mockOpenSnackbar).not.toHaveBeenCalled();
    });

    it("10. filteredUsers immediately includes optimistically promoted keeper and rolls back on failure", async () => {
      const deferred = createDeferredPromise();
      adminApi.updateUserRole.mockReturnValue(deferred.promise);

      await act(async () => {
        render(<MemberManagementTestHarness onHookRef={hookRef} />);
      });

      // Filter by "keeper"
      act(() => {
        hookRef.current.actions.setRoleFilter("keeper");
      });

      expect(hookRef.current.state.filteredUsers).toHaveLength(1);
      expect(hookRef.current.state.filteredUsers[0].username).toBe("keeper_jane");

      // Promote john_doe to keeper
      const john = hookRef.current.state.users.find((u) => u.username === "john_doe");
      act(() => {
        hookRef.current.actions.setUserForRoleModal(john);
      });

      act(() => {
        hookRef.current.actions.handleSaveRoleAndGardens("assign", ["Grace"]);
      });

      // Immediately reflected in filteredUsers before API settles!
      expect(hookRef.current.state.filteredUsers).toHaveLength(2);
      expect(hookRef.current.state.filteredUsers.some((u) => u.username === "john_doe")).toBe(true);

      // Reject API
      await act(async () => {
        deferred.reject(new Error("500 Server Error"));
      });

      // Rollback: john_doe automatically removed from keeper-filtered view!
      expect(hookRef.current.state.filteredUsers).toHaveLength(1);
      expect(hookRef.current.state.filteredUsers[0].username).toBe("keeper_jane");
    });

    it("11. searchTerm filtering immediately excludes optimistically deleted user and rolls back on failure", async () => {
      const deferred = createDeferredPromise();
      adminApi.deleteUser.mockReturnValue(deferred.promise);

      await act(async () => {
        render(<MemberManagementTestHarness onHookRef={hookRef} />);
      });

      // Search for "Jane"
      act(() => {
        hookRef.current.actions.setSearchTerm("Jane");
      });

      expect(hookRef.current.state.filteredUsers).toHaveLength(1);
      expect(hookRef.current.state.filteredUsers[0].username).toBe("keeper_jane");

      // Delete keeper_jane
      const jane = hookRef.current.state.users.find((u) => u.username === "keeper_jane");
      act(() => {
        hookRef.current.actions.setUserToDelete(jane);
      });

      act(() => {
        hookRef.current.actions.handleConfirmDelete();
      });

      // Optimistically removed from filtered search results!
      expect(hookRef.current.state.filteredUsers).toHaveLength(0);

      // Reject API
      await act(async () => {
        deferred.reject(new Error("Network Error"));
      });

      // Rollback: keeper_jane restored to search results!
      expect(hookRef.current.state.filteredUsers).toHaveLength(1);
      expect(hookRef.current.state.filteredUsers[0].username).toBe("keeper_jane");
    });
  });
});
