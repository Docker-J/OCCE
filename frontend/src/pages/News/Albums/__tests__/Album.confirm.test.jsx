import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import Album from "../Album";
import { ConfirmProvider } from "../../../../common/ConfirmProvider";
import useAuthStore from "../../../../store/useAuthStore";
import * as albumsApi from "../../../../api/albums";
import * as useSnackbarModule from "../../../../util/useSnackbar";

// Mock react-router
const mockNavigate = vi.fn();
const mockParams = { albumID: "album-test-123" };
const mockLoaderData = {
  title: "2026 봄 소풍 앨범",
  images: {
    img1: "hash_image_1",
    img2: "hash_image_2",
  },
};

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
  useLoaderData: () => mockLoaderData,
}));

// Mock useModal
const mockOpenModal = vi.fn();
vi.mock("../../../../util/useModal", () => ({
  default: () => ({
    openModal: mockOpenModal,
    closeModal: vi.fn(),
  }),
}));

// Mock deleteAlbum API
vi.mock("../../../../api/albums", () => ({
  deleteAlbum: vi.fn(),
}));

// Mock useSnackbar
const mockOpenSnackbar = vi.fn();
vi.mock("../../../../util/useSnackbar", () => ({
  default: () => ({
    openSnackbar: mockOpenSnackbar,
    closeSnackbar: vi.fn(),
  }),
}));

describe("Album.jsx R1 Confirmation Flow Empirical Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    // Enable admin mode so AdminComponent renders the Delete Fab
    useAuthStore.setState({ admin: true, authenticated: true });
    albumsApi.deleteAlbum.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    cleanup();
  });

  it("1. Renders delete button for admin and does not show dialog initially", () => {
    render(
      <ConfirmProvider>
        <Album />
      </ConfirmProvider>
    );

    // Delete Fab should be rendered
    const deleteFab = screen.getByRole("button");
    expect(deleteFab).toBeInTheDocument();

    // Confirm dialog should NOT be open
    expect(screen.queryByText("앨범 삭제")).not.toBeInTheDocument();
  });

  it("2. Clicking delete Fab triggers confirm(...) with exact title, message, and error severity", async () => {
    render(
      <ConfirmProvider>
        <Album />
      </ConfirmProvider>
    );

    const deleteFab = screen.getByRole("button");
    fireEvent.click(deleteFab);

    // Dialog title & message should now appear in the DOM
    expect(await screen.findByText("앨범 삭제")).toBeInTheDocument();
    expect(
      screen.getByText(
        "정말로 이 앨범을 삭제하시겠습니까? 삭제된 사진은 복구할 수 없습니다."
      )
    ).toBeInTheDocument();

    // Verify confirm and cancel buttons
    const confirmBtn = screen.getByRole("button", { name: "삭제" });
    const cancelBtn = screen.getByRole("button", { name: "취소" });
    expect(confirmBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
  });

  it("3. Confirmed path: Resolves true -> proceeds with deleteAlbum, clears session, shows snackbar, navigates", async () => {
    sessionStorage.setItem("albums", "cached-album-data");

    render(
      <ConfirmProvider>
        <Album />
      </ConfirmProvider>
    );

    const deleteFab = screen.getByRole("button");
    fireEvent.click(deleteFab);

    const confirmBtn = await screen.findByRole("button", { name: "삭제" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      // 1. deleteAlbum called with correct albumID
      expect(albumsApi.deleteAlbum).toHaveBeenCalledTimes(1);
      expect(albumsApi.deleteAlbum).toHaveBeenCalledWith("album-test-123");

      // 2. sessionStorage "albums" cache cleared
      expect(sessionStorage.getItem("albums")).toBeNull();

      // 3. Success snackbar displayed
      expect(mockOpenSnackbar).toHaveBeenCalledWith(
        "success",
        "The album deleted successfully"
      );

      // 4. Navigated to /albums
      expect(mockNavigate).toHaveBeenCalledWith("/albums");
    });
  });

  it("4. Cancelled path: Resolves false -> aborts deletion cleanly with zero side effects", async () => {
    sessionStorage.setItem("albums", "cached-album-data");

    render(
      <ConfirmProvider>
        <Album />
      </ConfirmProvider>
    );

    const deleteFab = screen.getByRole("button");
    fireEvent.click(deleteFab);

    const cancelBtn = await screen.findByRole("button", { name: "취소" });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      // Dialog closes
      expect(screen.queryByText("앨범 삭제")).not.toBeInTheDocument();
    });

    // Zero side effects
    expect(albumsApi.deleteAlbum).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("albums")).toBe("cached-album-data");
    expect(mockOpenSnackbar).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("5. Backdrop / Escape dismissal resolves false cleanly", async () => {
    sessionStorage.setItem("albums", "cached-album-data");

    render(
      <ConfirmProvider>
        <Album />
      </ConfirmProvider>
    );

    const deleteFab = screen.getByRole("button");
    fireEvent.click(deleteFab);

    expect(await screen.findByText("앨범 삭제")).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape", code: "Escape", keyCode: 27 });

    await waitFor(() => {
      expect(screen.queryByText("앨범 삭제")).not.toBeInTheDocument();
    });

    // Zero side effects
    expect(albumsApi.deleteAlbum).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("albums")).toBe("cached-album-data");
    expect(mockOpenSnackbar).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("6. Rapid re-entrant clicks: supersedes earlier confirm call without double execution", async () => {
    render(
      <ConfirmProvider>
        <Album />
      </ConfirmProvider>
    );

    const deleteFab = screen.getByRole("button");
    // Click twice rapidly
    fireEvent.click(deleteFab);
    fireEvent.click(deleteFab);

    const confirmBtn = await screen.findByRole("button", { name: "삭제" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      // Only 1 delete call executed
      expect(albumsApi.deleteAlbum).toHaveBeenCalledTimes(1);
    });
  });

  it("7. Source verification: No window.confirm or deleteConfirmDialog boolean state in Album.jsx", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const albumSource = fs.readFileSync(
      path.resolve(__dirname, "../Album.jsx"),
      "utf-8"
    );

    expect(albumSource).not.toMatch(/window\.confirm/);
    expect(albumSource).not.toMatch(/deleteConfirmDialog/);
    expect(albumSource).not.toMatch(/CustomConfirmDialog/);
    expect(albumSource).toMatch(/const confirm = useConfirm\(\)/);
    expect(albumSource).toMatch(/await confirm\(\{/);
  });
});
