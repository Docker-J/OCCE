import React, { act } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Announcement from "../Announcement";
import useAuthStore from "../../../../store/useAuthStore";
import * as announcementsApi from "../../../../api/announcements";

// Mock router
let currentLoaderData = {
  id: "ann-101",
  title: "2026 부활절 특별 새벽기도회",
  body: "<p>부활절 특별 새벽기도회가 진행됩니다.</p>",
  timestamp: 1776510000000,
  pin: 0,
};

const mockNavigate = vi.fn();
const mockRevalidate = vi.fn(() => {
  currentLoaderData = {
    ...currentLoaderData,
    pin: currentLoaderData.pin === 1 ? 0 : 1,
  };
});

vi.mock("react-router", () => ({
  useLoaderData: () => currentLoaderData,
  useNavigate: () => mockNavigate,
  useRevalidator: () => ({ revalidate: mockRevalidate }),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock react-query
const mockInvalidateQueries = vi.fn();
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

// Mock snackbar
const mockOpenSnackbar = vi.fn();
vi.mock("../../../../util/useSnackbar", () => ({
  default: () => ({ openSnackbar: mockOpenSnackbar }),
}));

// Mock modal
const mockOpenModal = vi.fn();
vi.mock("../../../../util/useModal", () => ({
  default: () => ({ openModal: mockOpenModal }),
}));

// Mock announcements API
vi.mock("../../../../api/announcements", () => ({
  pinAnnouncement: vi.fn(),
  deleteAnnouncement: vi.fn(),
}));

// Helper to create a deferred promise
function createDeferredPromise() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("Empirical Challenger M2: Announcement useOptimistic Pinning Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Authenticate as Admin so PostAdminActions SpeedDial renders
    useAuthStore.setState({
      authenticated: true,
      authInitialized: true,
      admin: true,
      isLeader: true,
    });

    currentLoaderData = {
      id: "ann-101",
      title: "2026 부활절 특별 새벽기도회",
      body: "<p>부활절 특별 새벽기도회가 진행됩니다.</p>",
      timestamp: 1776510000000,
      pin: 0,
    };
  });

  afterEach(() => {
    cleanup();
  });

  // Helper to open SpeedDial and find action button
  const openSpeedDialAndGetAction = (actionName) => {
    const speedDialFab = screen.getByLabelText("Post admin actions");
    fireEvent.mouseEnter(speedDialFab);
    fireEvent.click(speedDialFab);
    return screen.queryByLabelText(actionName);
  };

  it("1. initially renders unpinned announcement without pin badge or FullScreenLoading", () => {
    currentLoaderData.pin = 0;
    render(<Announcement />);

    // Post title exists
    expect(screen.getByText("2026 부활절 특별 새벽기도회")).toBeInTheDocument();

    // Pin chip badge ("고정 공지") is NOT present
    expect(screen.queryByText("고정 공지")).toBeNull();

    // FullScreenLoading (role=progressbar) is strictly NOT rendered
    expect(screen.queryByRole("progressbar")).toBeNull();

    // SpeedDial action is "Pin"
    const pinAction = openSpeedDialAndGetAction("Pin");
    expect(pinAction).toBeInTheDocument();
  });

  describe("Optimistic Pin Toggle (0 -> 1)", () => {
    it("2. IMMEDIATELY displays '고정 공지' badge and changes action to 'Unpin' before API settles, WITHOUT FullScreenLoading", async () => {
      currentLoaderData.pin = 0;
      const deferred = createDeferredPromise();
      announcementsApi.pinAnnouncement.mockReturnValue(deferred.promise);

      render(<Announcement />);

      // Ensure initial unpinned state
      expect(screen.queryByText("고정 공지")).toBeNull();
      expect(screen.queryByRole("progressbar")).toBeNull();

      // Click "Pin" button
      const pinAction = openSpeedDialAndGetAction("Pin");
      expect(pinAction).toBeInTheDocument();

      act(() => {
        fireEvent.click(pinAction);
      });

      // Synchronously assert optimistic update BEFORE promise settles:
      // 1. "고정 공지" chip badge appears immediately
      expect(screen.getByText("고정 공지")).toBeInTheDocument();

      // 2. FullScreenLoading is STRICTLY NOT rendered
      expect(screen.queryByRole("progressbar")).toBeNull();

      // 3. SpeedDial action button label switched to "Unpin"
      const unpinAction = screen.getByLabelText("Unpin");
      expect(unpinAction).toBeInTheDocument();

      // Now resolve the API call
      await act(async () => {
        deferred.resolve({ success: true });
      });

      // Badge persists, queryClient invalidated, revalidated, snackbar shown
      expect(screen.getByText("고정 공지")).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).toBeNull();
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["announcements"] });
      expect(mockRevalidate).toHaveBeenCalled();
      expect(mockOpenSnackbar).toHaveBeenCalledWith(
        "success",
        "The announcement is successfully pinned"
      );
    });

    it("3. CLEANLY ROLLS BACK pin state when pinAnnouncement rejects (simulated 500 / network failure)", async () => {
      currentLoaderData.pin = 0;
      const deferred = createDeferredPromise();
      announcementsApi.pinAnnouncement.mockReturnValue(deferred.promise);

      render(<Announcement />);

      const pinAction = openSpeedDialAndGetAction("Pin");
      act(() => {
        fireEvent.click(pinAction);
      });

      // Optimistic update visible immediately
      expect(screen.getByText("고정 공지")).toBeInTheDocument();
      expect(screen.getByLabelText("Unpin")).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).toBeNull();

      // Reject API promise with network failure
      await act(async () => {
        deferred.reject(new Error("Network Error: 500 Connection Refused"));
      });

      // Verify automatic and clean rollback:
      // 1. "고정 공지" chip badge is removed
      expect(screen.queryByText("고정 공지")).toBeNull();

      // 2. Action switched back to "Pin"
      expect(screen.getByLabelText("Pin")).toBeInTheDocument();

      // 3. Error snackbar shown
      expect(mockOpenSnackbar).toHaveBeenCalledWith(
        "error",
        "Error Occured. Please contact to the administrator."
      );

      // 4. FullScreenLoading was NEVER rendered
      expect(screen.queryByRole("progressbar")).toBeNull();
    });
  });

  describe("Optimistic Unpin Toggle (1 -> 0)", () => {
    it("4. IMMEDIATELY hides '고정 공지' badge and changes action to 'Pin' before API settles", async () => {
      currentLoaderData.pin = 1;
      const deferred = createDeferredPromise();
      announcementsApi.pinAnnouncement.mockReturnValue(deferred.promise);

      render(<Announcement />);

      // Initial state is pinned
      expect(screen.getByText("고정 공지")).toBeInTheDocument();
      const unpinAction = openSpeedDialAndGetAction("Unpin");
      expect(unpinAction).toBeInTheDocument();

      // Click "Unpin"
      act(() => {
        fireEvent.click(unpinAction);
      });

      // Synchronously assert optimistic unpin update:
      // 1. "고정 공지" badge removed immediately
      expect(screen.queryByText("고정 공지")).toBeNull();

      // 2. Action button switches to "Pin"
      expect(screen.getByLabelText("Pin")).toBeInTheDocument();

      // 3. FullScreenLoading is NOT rendered
      expect(screen.queryByRole("progressbar")).toBeNull();

      // Resolve API
      await act(async () => {
        deferred.resolve({ success: true });
      });

      expect(screen.queryByText("고정 공지")).toBeNull();
      expect(mockOpenSnackbar).toHaveBeenCalledWith(
        "success",
        "The announcement is successfully unpinned"
      );
    });

    it("5. CLEANLY ROLLS BACK unpin state to pinned when pinAnnouncement rejects", async () => {
      currentLoaderData.pin = 1;
      const deferred = createDeferredPromise();
      announcementsApi.pinAnnouncement.mockReturnValue(deferred.promise);

      render(<Announcement />);

      expect(screen.getByText("고정 공지")).toBeInTheDocument();
      const unpinAction = openSpeedDialAndGetAction("Unpin");

      act(() => {
        fireEvent.click(unpinAction);
      });

      // Optimistically unpinned
      expect(screen.queryByText("고정 공지")).toBeNull();
      expect(screen.getByLabelText("Pin")).toBeInTheDocument();

      // Reject API
      await act(async () => {
        deferred.reject(new Error("500 Server Error"));
      });

      // Clean rollback: badge restored to visible!
      expect(screen.getByText("고정 공지")).toBeInTheDocument();
      expect(screen.getByLabelText("Unpin")).toBeInTheDocument();
      expect(mockOpenSnackbar).toHaveBeenCalledWith(
        "error",
        "Error Occured. Please contact to the administrator."
      );
    });
  });

  describe("FullScreenLoading Discrimination Verification", () => {
    it("6. verifies FullScreenLoading DOES render on destructive onDelete, confirming selective decoupling for onPin", async () => {
      currentLoaderData.pin = 0;
      const deferred = createDeferredPromise();
      announcementsApi.deleteAnnouncement.mockReturnValue(deferred.promise);

      render(<Announcement />);

      const deleteAction = openSpeedDialAndGetAction("Delete");
      expect(deleteAction).toBeInTheDocument();

      // Click Delete icon to open confirm dialog
      act(() => {
        fireEvent.click(deleteAction);
      });

      // Find confirm button in dialog and click
      const confirmButton = screen.getByRole("button", { name: "확인" });
      act(() => {
        fireEvent.click(confirmButton);
      });

      // FullScreenLoading (role=progressbar) IS rendered during onDelete!
      expect(screen.getByRole("progressbar", { hidden: true })).toBeInTheDocument();

      // Resolve delete
      await act(async () => {
        deferred.resolve({ success: true });
      });

      // Loading disappears and redirects
      expect(screen.queryByRole("progressbar", { hidden: true })).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith("/announcements");
    });
  });

  describe("Burst Stress & Rapid Sequential Interactions", () => {
    it("7. handles rapid sequential pin/unpin toggles without rendering FullScreenLoading or throwing unhandled errors", async () => {
      currentLoaderData.pin = 0;
      const deferred1 = createDeferredPromise();
      const deferred2 = createDeferredPromise();
      announcementsApi.pinAnnouncement
        .mockReturnValueOnce(deferred1.promise)
        .mockReturnValueOnce(deferred2.promise);

      render(<Announcement />);

      // First click: Pin -> Unpin
      const pinAction1 = openSpeedDialAndGetAction("Pin");
      act(() => {
        fireEvent.click(pinAction1);
      });

      expect(screen.getByText("고정 공지")).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).toBeNull();

      // Second rapid click before first resolves: Unpin -> Pin
      const unpinAction = openSpeedDialAndGetAction("Unpin");
      act(() => {
        fireEvent.click(unpinAction);
      });

      expect(screen.queryByText("고정 공지")).toBeNull();
      expect(screen.queryByRole("progressbar")).toBeNull();

      // Resolve both promises
      await act(async () => {
        deferred1.resolve({ success: true });
        deferred2.resolve({ success: true });
      });

      // No FullScreenLoading ever rendered
      expect(screen.queryByRole("progressbar")).toBeNull();
    });
  });
});
