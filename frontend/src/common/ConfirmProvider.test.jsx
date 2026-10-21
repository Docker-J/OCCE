import React from "react";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { ConfirmProvider, useConfirm } from "./ConfirmProvider";

describe("ConfirmProvider & useConfirm Promise Lifecycle", () => {
  afterEach(() => {
    cleanup();
  });

  test("throws an error when useConfirm is called outside ConfirmProvider", () => {
    const RogueComponent = () => {
      useConfirm();
      return null;
    };
    expect(() => render(<RogueComponent />)).toThrow(
      "useConfirm must be used within a ConfirmProvider"
    );
  });

  test("renders children without displaying dialog initially", () => {
    const Consumer = () => {
      useConfirm();
      return <div data-testid="child">Active Child</div>;
    };
    render(
      <ConfirmProvider>
        <Consumer />
      </ConfirmProvider>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("returns pending Promise that resolves true upon confirmation", async () => {
    let confirmFn;
    const Consumer = () => {
      confirmFn = useConfirm();
      return null;
    };
    render(
      <ConfirmProvider>
        <Consumer />
      </ConfirmProvider>
    );

    let promise;
    act(() => {
      promise = confirmFn({
        title: "삭제 확인",
        message: "계속 진행하시겠습니까?",
        confirmText: "확인 완료",
      });
    });

    expect(promise).toBeInstanceOf(Promise);

    const confirmButton = screen.getByRole("button", { name: "확인 완료" });
    act(() => {
      fireEvent.click(confirmButton);
    });

    const result = await promise;
    expect(result).toBe(true);
  });

  test("resolves false upon cancel button click", async () => {
    let confirmFn;
    const Consumer = () => {
      confirmFn = useConfirm();
      return null;
    };
    render(
      <ConfirmProvider>
        <Consumer />
      </ConfirmProvider>
    );

    let promise;
    act(() => {
      promise = confirmFn({
        title: "작업 취소",
        message: "취소 테스트",
        cancelText: "취소하기",
      });
    });

    const cancelButton = screen.getByRole("button", { name: "취소하기" });
    act(() => {
      fireEvent.click(cancelButton);
    });

    const result = await promise;
    expect(result).toBe(false);
  });

  test("handles string shorthand properly", async () => {
    let confirmFn;
    const Consumer = () => {
      confirmFn = useConfirm();
      return null;
    };
    render(
      <ConfirmProvider>
        <Consumer />
      </ConfirmProvider>
    );

    let promise;
    act(() => {
      promise = confirmFn("정말 진행하시겠습니까?");
    });

    expect(screen.getByText("정말 진행하시겠습니까?")).toBeInTheDocument();
    const defaultConfirmButton = screen.getByRole("button", { name: "확인" });

    act(() => {
      fireEvent.click(defaultConfirmButton);
    });

    const result = await promise;
    expect(result).toBe(true);
  });

  test("unmount cleanup resolves pending promise to false without memory leak", async () => {
    let confirmFn;
    const Consumer = () => {
      confirmFn = useConfirm();
      return null;
    };
    const { unmount } = render(
      <ConfirmProvider>
        <Consumer />
      </ConfirmProvider>
    );

    let promise;
    act(() => {
      promise = confirmFn("Unmount test");
    });

    act(() => {
      unmount();
    });

    const result = await promise;
    expect(result).toBe(false);
  });

  test("rapid successive calls supersede earlier promises with false", async () => {
    let confirmFn;
    const Consumer = () => {
      confirmFn = useConfirm();
      return null;
    };
    render(
      <ConfirmProvider>
        <Consumer />
      </ConfirmProvider>
    );

    let p1, p2;
    act(() => {
      p1 = confirmFn("First Call");
      p2 = confirmFn("Second Call");
    });

    const r1 = await p1;
    expect(r1).toBe(false);

    const confirmButton = screen.getByRole("button", { name: "확인" });
    act(() => {
      fireEvent.click(confirmButton);
    });

    const r2 = await p2;
    expect(r2).toBe(true);
  });
});
