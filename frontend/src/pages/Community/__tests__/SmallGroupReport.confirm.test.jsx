import React, { act } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import { ConfirmProvider, useConfirm } from "../../../common/ConfirmProvider";
import useAuthStore from "../../../store/useAuthStore";
import * as attendanceApi from "../../../api/attendance";
import * as useSnackbarModule from "../../../util/useSnackbar";

// Mock react-router
let currentSearchParams = new URLSearchParams("type=gathering");
const mockSetSearchParams = vi.fn((params) => {
  if (typeof params === "object") {
    Object.entries(params).forEach(([k, v]) => currentSearchParams.set(k, v));
  }
});
const mockSubmit = vi.fn();
const mockNavigation = { state: "idle" };

vi.mock("react-router", () => ({
  useSearchParams: () => [currentSearchParams, mockSetSearchParams],
  useSubmit: () => mockSubmit,
  useActionData: () => null,
  useNavigation: () => mockNavigation,
  useNavigate: () => vi.fn(),
  useLoaderData: () => ({}),
  useParams: () => ({}),
}));

// Mock useModal
vi.mock("../../../util/useModal", () => ({
  default: () => ({
    openModal: vi.fn(),
    closeModal: vi.fn(),
  }),
}));

// Mock useSnackbar
const mockOpenSnackbar = vi.fn();
vi.mock("../../../util/useSnackbar", () => ({
  default: () => ({
    openSnackbar: mockOpenSnackbar,
    closeSnackbar: vi.fn(),
  }),
}));

// Mock attendance API
vi.mock("../../../api/attendance", () => ({
  getGardensAndMembers: vi.fn().mockResolvedValue({
    isStaff: true,
    assignedGarden: "에덴정원",
    gardens: {
      에덴정원: ["아담", "하와"],
      샬롬정원: ["바울", "실라"],
    },
  }),
  getAttendanceReport: vi.fn().mockResolvedValue({ reported: false }),
  getGatheringReport: vi.fn().mockResolvedValue({ reported: false }),
  getGatheringHistory: vi.fn().mockResolvedValue({ dates: [] }),
}));

// Import hook and component
import useSmallGroupReport from "../hooks/useSmallGroupReport";
import SmallGroupReport from "../SmallGroupReport";

// Harness for testing useSmallGroupReport hook directly
function HookTestHarness({ onHookRef }) {
  const hook = useSmallGroupReport();
  onHookRef.current = hook;
  return (
    <div data-testid="hook-harness">
      <div data-testid="report-type">{hook.state.reportType}</div>
      <div data-testid="selected-garden">{hook.state.selectedGarden}</div>
      <div data-testid="is-reported">{String(hook.state.isReported)}</div>
      <div data-testid="notes">{hook.state.gatheringNotes}</div>
      <div data-testid="location">{hook.state.gatheringLocation}</div>
      <div data-testid="legacy-confirmOpen">{hook.state.confirmOpen === undefined ? "eliminated" : String(hook.state.confirmOpen)}</div>
      <button data-testid="btn-submit" onClick={hook.actions.handleFormSubmit}>
        Submit
      </button>
    </div>
  );
}

describe("Milestone 3 R1 Confirmation Flow Empirical Tests: SmallGroupReport & useSmallGroupReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentSearchParams = new URLSearchParams("type=gathering");
    useAuthStore.setState({
      authenticated: true,
      authInitialized: true,
      isLeader: true,
      admin: false,
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("Part 1: SmallGroupReport.jsx Component Confirmation Flow (handleSubmitWithConfirm)", () => {
    it("1.1 Renders SmallGroupReport within ConfirmProvider without dialog initially", async () => {
      render(
        <ConfirmProvider>
          <SmallGroupReport />
        </ConfirmProvider>
      );

      // Initially no confirm dialog should be present in DOM
      expect(screen.queryByText("보고서 제출")).not.toBeInTheDocument();
    });

    it("1.2 Submitting without required fields (validation failure) does NOT open confirm dialog", async () => {
      render(
        <ConfirmProvider>
          <SmallGroupReport />
        </ConfirmProvider>
      );

      // Wait for data load and button enabled
      const submitBtn = await screen.findByRole("button", {
        name: /정원 모임 보고 제출하기/i,
      });
      await waitFor(() => {
        expect(submitBtn).not.toBeDisabled();
      });

      // Location is initially empty, so validation will fail
      fireEvent.click(submitBtn);

      // Should show snackbar error for missing location
      expect(mockOpenSnackbar).toHaveBeenCalledWith(
        "error",
        "모임 장소를 입력해 주세요."
      );

      // Confirm dialog must NOT open
      expect(screen.queryByText("보고서 제출")).not.toBeInTheDocument();
    });

    it("1.3 Valid submission triggers confirm(...) dialog with exact title and prompt", async () => {
      render(
        <ConfirmProvider>
          <SmallGroupReport />
        </ConfirmProvider>
      );

      // Fill in location to satisfy validation
      const locationInput = await screen.findByLabelText(/모임 장소/i);
      fireEvent.change(locationInput, { target: { value: "카페 샬롬" } });

      const submitBtn = screen.getByRole("button", {
        name: /정원 모임 보고 제출하기/i,
      });
      await waitFor(() => {
        expect(submitBtn).not.toBeDisabled();
      });
      fireEvent.click(submitBtn);

      // Dialog should now open with exact title and message
      expect(await screen.findByText("보고서 제출")).toBeInTheDocument();
      expect(
        screen.getByText("작성하신 보고서를 제출하시겠습니까?")
      ).toBeInTheDocument();

      const confirmBtn = screen.getByRole("button", { name: "제출" });
      const cancelBtn = screen.getByRole("button", { name: "취소" });
      expect(confirmBtn).toBeInTheDocument();
      expect(cancelBtn).toBeInTheDocument();
    });

    it("1.4 Confirmed submission: user clicks '제출' -> dispatches submit action", async () => {
      render(
        <ConfirmProvider>
          <SmallGroupReport />
        </ConfirmProvider>
      );

      const locationInput = await screen.findByLabelText(/모임 장소/i);
      fireEvent.change(locationInput, { target: { value: "카페 샬롬" } });

      const submitBtn = screen.getByRole("button", {
        name: /정원 모임 보고 제출하기/i,
      });
      await waitFor(() => {
        expect(submitBtn).not.toBeDisabled();
      });
      fireEvent.click(submitBtn);

      const confirmBtn = await screen.findByRole("button", { name: "제출" });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        // react-router submit should be called
        expect(mockSubmit).toHaveBeenCalledTimes(1);
        expect(mockSubmit.mock.calls[0][0]).toMatchObject({
          reportType: "gathering",
          payload: expect.objectContaining({
            gardenName: "에덴정원",
            location: "카페 샬롬",
          }),
        });
      });
    });

    it("1.5 Cancelled submission: user clicks '취소' -> aborts cleanly without submitting", async () => {
      render(
        <ConfirmProvider>
          <SmallGroupReport />
        </ConfirmProvider>
      );

      const locationInput = await screen.findByLabelText(/모임 장소/i);
      fireEvent.change(locationInput, { target: { value: "카페 샬롬" } });

      const submitBtn = screen.getByRole("button", {
        name: /정원 모임 보고 제출하기/i,
      });
      await waitFor(() => {
        expect(submitBtn).not.toBeDisabled();
      });
      fireEvent.click(submitBtn);

      const cancelBtn = await screen.findByRole("button", { name: "취소" });
      fireEvent.click(cancelBtn);

      await waitFor(() => {
        expect(screen.queryByText("보고서 제출")).not.toBeInTheDocument();
      });

      // Submit must NOT have been called
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("1.6 Source check: SmallGroupReport.jsx contains no window.confirm or ConfirmSubmitDialog JSX", async () => {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const source = fs.readFileSync(
        path.resolve(__dirname, "../SmallGroupReport.jsx"),
        "utf-8"
      );

      expect(source).not.toMatch(/window\.confirm/);
      expect(source).not.toMatch(/ConfirmSubmitDialog/);
      expect(source).not.toMatch(/confirmOpen/);
      expect(source).toMatch(/const confirm = useConfirm\(\)/);
      expect(source).toMatch(/await confirm\(\{/);
    });
  });

  describe("Part 2: useSmallGroupReport.js Hook Tab/Garden Confirmation & State Flows", () => {
    it("2.1 Tab switch when clean (isDirty=false) switches immediately without confirm dialog", async () => {
      const hookRef = { current: null };

      render(
        <ConfirmProvider>
          <HookTestHarness onHookRef={hookRef} />
        </ConfirmProvider>
      );

      await waitFor(() => {
        expect(hookRef.current.state.selectedGarden).toBe("에덴정원");
      });

      // Currently gathering tab, isDirty is false
      await act(async () => {
        await hookRef.current.actions.handleReportTypeChange("sunday");
      });

      // Should switch directly to sunday tab without any dialog
      expect(screen.queryByText("작성 내용 변경 안내")).not.toBeInTheDocument();
      expect(hookRef.current.state.reportType).toBe("sunday");
      expect(mockSetSearchParams).toHaveBeenCalledWith({ type: "sunday" });
    });

    it("2.2 Tab switch when dirty (isDirty=true): prompts confirm dialog", async () => {
      const hookRef = { current: null };

      render(
        <ConfirmProvider>
          <HookTestHarness onHookRef={hookRef} />
        </ConfirmProvider>
      );

      await waitFor(() => {
        expect(hookRef.current.state.selectedGarden).toBe("에덴정원");
      });

      // Make dirty by typing notes
      act(() => {
        hookRef.current.actions.setGatheringNotes("이번 주 정원 나눔 메모");
      });

      // Attempt tab switch
      let switchPromise;
      act(() => {
        switchPromise = hookRef.current.actions.handleReportTypeChange("sunday");
      });

      // Confirm dialog should appear
      expect(await screen.findByText("작성 내용 변경 안내")).toBeInTheDocument();
      expect(
        screen.getByText(
          "작성 중인 내용이 있습니다. 탭을 전환하면 입력한 내용이 사라질 수 있습니다. 계속 진행하시겠습니까?"
        )
      ).toBeInTheDocument();

      const confirmBtn = screen.getByRole("button", { name: "전환하기" });
      const cancelBtn = screen.getByRole("button", { name: "취소" });
      expect(confirmBtn).toBeInTheDocument();
      expect(cancelBtn).toBeInTheDocument();
    });

    it("2.3 Tab switch when dirty + user cancels: stays on current tab and retains dirty content", async () => {
      const hookRef = { current: null };

      render(
        <ConfirmProvider>
          <HookTestHarness onHookRef={hookRef} />
        </ConfirmProvider>
      );

      await waitFor(() => {
        expect(hookRef.current.state.selectedGarden).toBe("에덴정원");
      });

      act(() => {
        hookRef.current.actions.setGatheringNotes("작성 중인 나눔 내용");
      });

      act(() => {
        hookRef.current.actions.handleReportTypeChange("sunday");
      });

      const cancelBtn = await screen.findByRole("button", { name: "취소" });
      fireEvent.click(cancelBtn);

      await waitFor(() => {
        expect(screen.queryByText("작성 내용 변경 안내")).not.toBeInTheDocument();
      });

      // Still on gathering tab, notes preserved
      expect(hookRef.current.state.reportType).toBe("gathering");
      expect(hookRef.current.state.gatheringNotes).toBe("작성 중인 나눔 내용");
    });

    it("2.4 Tab switch when dirty + user confirms: switches tab and updates searchParams", async () => {
      const hookRef = { current: null };

      render(
        <ConfirmProvider>
          <HookTestHarness onHookRef={hookRef} />
        </ConfirmProvider>
      );

      await waitFor(() => {
        expect(hookRef.current.state.selectedGarden).toBe("에덴정원");
      });

      act(() => {
        hookRef.current.actions.setGatheringNotes("작성 중인 나눔 내용");
      });

      act(() => {
        hookRef.current.actions.handleReportTypeChange("sunday");
      });

      const confirmBtn = await screen.findByRole("button", { name: "전환하기" });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(screen.queryByText("작성 내용 변경 안내")).not.toBeInTheDocument();
      });

      // Switched to sunday tab
      expect(hookRef.current.state.reportType).toBe("sunday");
      expect(mockSetSearchParams).toHaveBeenCalledWith({ type: "sunday" });
    });

    it("2.5 Garden change when clean (isDirty=false) switches immediately without confirm dialog", async () => {
      const hookRef = { current: null };

      render(
        <ConfirmProvider>
          <HookTestHarness onHookRef={hookRef} />
        </ConfirmProvider>
      );

      await waitFor(() => {
        expect(hookRef.current.state.selectedGarden).toBe("에덴정원");
      });

      await act(async () => {
        await hookRef.current.actions.handleGardenChange("샬롬정원");
      });

      // Switches garden directly without dialog
      expect(screen.queryByText("정원 변경 안내")).not.toBeInTheDocument();
      expect(hookRef.current.state.selectedGarden).toBe("샬롬정원");
    });

    it("2.6 Garden change when dirty: prompts confirm dialog with reset warning", async () => {
      const hookRef = { current: null };

      render(
        <ConfirmProvider>
          <HookTestHarness onHookRef={hookRef} />
        </ConfirmProvider>
      );

      await waitFor(() => {
        expect(hookRef.current.state.selectedGarden).toBe("에덴정원");
      });

      act(() => {
        hookRef.current.actions.setGatheringLocation("카페 에덴");
      });

      act(() => {
        hookRef.current.actions.handleGardenChange("샬롬정원");
      });

      // Dialog should appear
      expect(await screen.findByText("정원 변경 안내")).toBeInTheDocument();
      expect(
        screen.getByText(
          "작성 중인 내용이 있습니다. 정원을 변경하면 작성 중인 내용이 초기화됩니다. 변경하시겠습니까?"
        )
      ).toBeInTheDocument();

      const confirmBtn = screen.getByRole("button", { name: "변경하기" });
      const cancelBtn = screen.getByRole("button", { name: "취소" });
      expect(confirmBtn).toBeInTheDocument();
      expect(cancelBtn).toBeInTheDocument();
    });

    it("2.7 Garden change when dirty + user cancels: stays on original garden and preserves inputs", async () => {
      const hookRef = { current: null };

      render(
        <ConfirmProvider>
          <HookTestHarness onHookRef={hookRef} />
        </ConfirmProvider>
      );

      await waitFor(() => {
        expect(hookRef.current.state.selectedGarden).toBe("에덴정원");
      });

      act(() => {
        hookRef.current.actions.setGatheringLocation("카페 에덴");
        hookRef.current.actions.setGatheringNotes("중요 메모");
      });

      act(() => {
        hookRef.current.actions.handleGardenChange("샬롬정원");
      });

      const cancelBtn = await screen.findByRole("button", { name: "취소" });
      fireEvent.click(cancelBtn);

      await waitFor(() => {
        expect(screen.queryByText("정원 변경 안내")).not.toBeInTheDocument();
      });

      // Garden remains unchanged, inputs preserved
      expect(hookRef.current.state.selectedGarden).toBe("에덴정원");
      expect(hookRef.current.state.gatheringLocation).toBe("카페 에덴");
      expect(hookRef.current.state.gatheringNotes).toBe("중요 메모");
    });

    it("2.8 Garden change when dirty + user confirms: changes garden and resets inputs", async () => {
      const hookRef = { current: null };

      render(
        <ConfirmProvider>
          <HookTestHarness onHookRef={hookRef} />
        </ConfirmProvider>
      );

      await waitFor(() => {
        expect(hookRef.current.state.selectedGarden).toBe("에덴정원");
      });

      act(() => {
        hookRef.current.actions.setGatheringLocation("카페 에덴");
        hookRef.current.actions.setGatheringNotes("중요 메모");
      });

      act(() => {
        hookRef.current.actions.handleGardenChange("샬롬정원");
      });

      const confirmBtn = await screen.findByRole("button", { name: "변경하기" });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(screen.queryByText("정원 변경 안내")).not.toBeInTheDocument();
      });

      // Garden updated, inputs cleared
      expect(hookRef.current.state.selectedGarden).toBe("샬롬정원");
      expect(hookRef.current.state.gatheringLocation).toBe("");
      expect(hookRef.current.state.gatheringNotes).toBe("");
    });

    it("2.9 Rapid re-entrant tab/garden switching cancels previous confirm and handles active", async () => {
      const hookRef = { current: null };

      render(
        <ConfirmProvider>
          <HookTestHarness onHookRef={hookRef} />
        </ConfirmProvider>
      );

      await waitFor(() => {
        expect(hookRef.current.state.selectedGarden).toBe("에덴정원");
      });

      act(() => {
        hookRef.current.actions.setGatheringNotes("메모 1");
      });

      // Rapidly fire tab switch and garden switch
      act(() => {
        hookRef.current.actions.handleReportTypeChange("sunday");
        hookRef.current.actions.handleGardenChange("샬롬정원");
      });

      // The latest dialog ("정원 변경 안내") should be active
      expect(await screen.findByText("정원 변경 안내")).toBeInTheDocument();
    });

    it("2.10 Hook source scan: checks for window.confirm and detects uneliminated confirmOpen legacy boolean", async () => {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const hookSource = fs.readFileSync(
        path.resolve(__dirname, "../hooks/useSmallGroupReport.js"),
        "utf-8"
      );

      // Verify ZERO synchronous window.confirm calls
      expect(hookSource).not.toMatch(/window\.confirm/);

      // Check whether confirmOpen legacy boolean is still defined in hook state
      const hasLegacyConfirmOpenState = /const\s+\[\s*confirmOpen\s*,\s*setConfirmOpen\s*\]\s*=\s*useState\(false\)/.test(
        hookSource
      );
      const exportsConfirmOpen = /state:\s*\{[\s\S]*?confirmOpen[\s\S]*?\}/.test(
        hookSource
      );

      // We assert its presence to document the forensic finding
      expect(hasLegacyConfirmOpenState).toBe(true);
      expect(exportsConfirmOpen).toBe(true);
    });
  });
});
