import React, { useState } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import OCCEErrorBoundary, { OCCEFallbackCard } from "./OCCEErrorBoundary";

// Helper component that throws an error when shouldThrow is true
function BuggyChild({ shouldThrow, message = "Intentional render crash" }) {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div data-testid="healthy-child">Healthy Content</div>;
}

describe("OCCEErrorBoundary & OCCEFallbackCard", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    // React and react-error-boundary log uncaught errors to console.error.
    // Suppress them during error tests to keep test output clean.
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("Normal Child Rendering", () => {
    it("renders children normally when no error occurs", () => {
      render(
        <OCCEErrorBoundary>
          <BuggyChild shouldThrow={false} />
        </OCCEErrorBoundary>
      );

      expect(screen.getByTestId("healthy-child")).toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("Error Catching & Fallback Card Display", () => {
    it("catches child render error and renders OCCEFallbackCard", () => {
      render(
        <OCCEErrorBoundary>
          <BuggyChild shouldThrow={true} />
        </OCCEErrorBoundary>
      );

      // Child is not rendered
      expect(screen.queryByTestId("healthy-child")).not.toBeInTheDocument();

      // Fallback card is displayed with role="alert"
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();

      // Displays default Korean title and description
      expect(screen.getByText("모듈을 불러오는 중 오류가 발생했습니다")).toBeInTheDocument();
      expect(
        screen.getByText("일시적인 오류가 발생했습니다. 아래 버튼을 눌러 다시 시도해 주세요.")
      ).toBeInTheDocument();

      // Displays "다시 시도" retry button
      const retryBtn = screen.getByRole("button", { name: /다시 시도/i });
      expect(retryBtn).toBeInTheDocument();
    });

    it("renders custom title and actionText when provided", () => {
      render(
        <OCCEErrorBoundary
          title="PDF 뷰어 로드 실패"
          description="문서를 불러오지 못했습니다."
          actionText="다시 로드"
        >
          <BuggyChild shouldThrow={true} />
        </OCCEErrorBoundary>
      );

      expect(screen.getByText("PDF 뷰어 로드 실패")).toBeInTheDocument();
      expect(screen.getByText("문서를 불러오지 못했습니다.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /다시 로드/i })).toBeInTheDocument();
    });

    it("invokes onError callback with error object when child throws", () => {
      const handleError = vi.fn();
      render(
        <OCCEErrorBoundary onError={handleError}>
          <BuggyChild shouldThrow={true} message="Custom fatal exception" />
        </OCCEErrorBoundary>
      );

      expect(handleError).toHaveBeenCalledTimes(1);
      expect(handleError.mock.calls[0][0].message).toBe("Custom fatal exception");
    });
  });

  describe("Reset & Retry Mechanism", () => {
    it("resets error boundary on retry button click and recovers if error is resolved", () => {
      function StatefulParent() {
        const [hasError, setHasError] = useState(true);
        return (
          <OCCEErrorBoundary onReset={() => setHasError(false)}>
            <BuggyChild shouldThrow={hasError} />
          </OCCEErrorBoundary>
        );
      }

      render(<StatefulParent />);

      // Initially in error state
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.queryByTestId("healthy-child")).not.toBeInTheDocument();

      // Click "다시 시도" button
      const retryBtn = screen.getByRole("button", { name: /다시 시도/i });
      fireEvent.click(retryBtn);

      // Child should recover cleanly
      expect(screen.getByTestId("healthy-child")).toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("resets error boundary when resetKeys change", () => {
      function ResetKeysParent({ queryId }) {
        return (
          <OCCEErrorBoundary resetKeys={[queryId]}>
            <BuggyChild shouldThrow={queryId === 1} />
          </OCCEErrorBoundary>
        );
      }

      const { rerender } = render(<ResetKeysParent queryId={1} />);
      expect(screen.getByRole("alert")).toBeInTheDocument();

      // Change resetKeys (queryId: 1 -> 2)
      rerender(<ResetKeysParent queryId={2} />);

      // Child recovers automatically without button click
      expect(screen.getByTestId("healthy-child")).toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("Adversarial Forensic Audit & Edge Cases", () => {
    it("AUDIT: proves onReset is called once on retry button click without duplicate invocation", () => {
      const handleReset = vi.fn();

      render(
        <OCCEErrorBoundary onReset={handleReset}>
          <BuggyChild shouldThrow={true} />
        </OCCEErrorBoundary>
      );

      const retryBtn = screen.getByRole("button", { name: /다시 시도/i });
      fireEvent.click(retryBtn);

      // Empirically confirm that onReset is called exactly ONCE:
      // Invocation from react-error-boundary's resetErrorBoundary() (args: { reason: "imperative-api" })
      expect(handleReset).toHaveBeenCalledTimes(1);
      expect(handleReset.mock.calls[0][0]).toHaveProperty("reason", "imperative-api");
    });

    it("catches errors thrown inside onReset within standalone OCCEFallbackCard", () => {
      const faultyReset = vi.fn(() => {
        throw new Error("Failure inside onReset callback");
      });
      // In react-error-boundary, resetErrorBoundary() invokes props.onReset
      const mockResetBoundary = vi.fn(() => {
        faultyReset();
      });

      render(
        <OCCEFallbackCard
          onReset={faultyReset}
          resetErrorBoundary={mockResetBoundary}
        />
      );

      const retryBtn = screen.getByRole("button", { name: /다시 시도/i });
      // In OCCEFallbackCard, reset exceptions are safely caught by try/catch in handleReset
      expect(() => {
        fireEvent.click(retryBtn);
      }).not.toThrow();

      expect(faultyReset).toHaveBeenCalledTimes(1);
      expect(mockResetBoundary).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error during boundary reset callback:",
        expect.any(Error)
      );
    });

    it("renders fallbackLink as string and as object", () => {
      const { rerender } = render(
        <OCCEErrorBoundary fallbackLink="https://example.com/fallback">
          <BuggyChild shouldThrow={true} />
        </OCCEErrorBoundary>
      );

      const linkBtn = screen.getByRole("link", { name: /외부 링크로 보기/i });
      expect(linkBtn).toHaveAttribute("href", "https://example.com/fallback");
      expect(linkBtn).toHaveAttribute("target", "_blank");

      rerender(
        <OCCEErrorBoundary
          fallbackLink={{ label: "자세히 보기", url: "https://occe.ca/help" }}
        >
          <BuggyChild shouldThrow={true} />
        </OCCEErrorBoundary>
      );

      const customLinkBtn = screen.getByRole("link", { name: /자세히 보기/i });
      expect(customLinkBtn).toHaveAttribute("href", "https://occe.ca/help");
    });

    it("renders extraAction node alongside retry button", () => {
      render(
        <OCCEErrorBoundary
          extraAction={<button type="button" data-testid="extra-action-btn">고객센터 문의</button>}
        >
          <BuggyChild shouldThrow={true} />
        </OCCEErrorBoundary>
      );

      expect(screen.getByTestId("extra-action-btn")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /다시 시도/i })).toBeInTheDocument();
    });

    it("supports compact mode rendering", () => {
      render(
        <OCCEErrorBoundary compact={true}>
          <BuggyChild shouldThrow={true} />
        </OCCEErrorBoundary>
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("모듈을 불러오는 중 오류가 발생했습니다")).toBeInTheDocument();
    });

    it("supports custom fallbackRender prop", () => {
      render(
        <OCCEErrorBoundary
          fallbackRender={({ error }) => (
            <div data-testid="custom-fallback">Custom: {error.message}</div>
          )}
        >
          <BuggyChild shouldThrow={true} message="Custom error text" />
        </OCCEErrorBoundary>
      );

      expect(screen.getByTestId("custom-fallback")).toHaveTextContent("Custom: Custom error text");
      expect(screen.queryByText("모듈을 불러오는 중 오류가 발생했습니다")).not.toBeInTheDocument();
    });

    it("supports custom FallbackComponent prop", () => {
      function CustomFallback({ error }) {
        return <div data-testid="custom-component-fallback">FC: {error.message}</div>;
      }

      render(
        <OCCEErrorBoundary FallbackComponent={CustomFallback}>
          <BuggyChild shouldThrow={true} message="FC error text" />
        </OCCEErrorBoundary>
      );

      expect(screen.getByTestId("custom-component-fallback")).toHaveTextContent("FC: FC error text");
    });

    it("renders standalone OCCEFallbackCard without resetErrorBoundary safely (no retry button)", () => {
      render(<OCCEFallbackCard title="Standalone Card" />);
      expect(screen.getByText("Standalone Card")).toBeInTheDocument();
      // Retry button should NOT be rendered when resetErrorBoundary is not passed
      expect(screen.queryByRole("button", { name: /다시 시도/i })).not.toBeInTheDocument();
    });
  });
});
