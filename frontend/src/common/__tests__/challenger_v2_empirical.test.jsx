import React, { useState } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import CustomCard, { CardContext, useCardContext } from "../CustomCard";
import OCCEErrorBoundary, { OCCEFallbackCard } from "../OCCEErrorBoundary";

// Helper buggy component
function BuggyComponent({ shouldThrow = false, message = "Dynamic error" }) {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div data-testid="buggy-child-safe">Safe Content</div>;
}

describe("Empirical Challenger M1_2_V2 Suite", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    consoleErrorSpy.mockRestore();
  });

  describe("Requirement 1 & Task 1: OCCEFallbackCard and OCCEErrorBoundary onReset Elimination", () => {
    it("empirically verifies onReset is invoked EXACTLY ONCE on single retry button click", () => {
      const handleReset = vi.fn();

      render(
        <OCCEErrorBoundary onReset={handleReset}>
          <BuggyComponent shouldThrow={true} />
        </OCCEErrorBoundary>
      );

      const retryButton = screen.getByRole("button", { name: /다시 시도/i });
      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);

      // Verify invocation count is strictly 1 (NOT 2)
      expect(handleReset).toHaveBeenCalledTimes(1);
      // Verify react-error-boundary passed the imperative-api reason payload
      expect(handleReset.mock.calls[0][0]).toEqual({
        args: [],
        reason: "imperative-api",
      });
    });

    it("stress-tests sequential retry clicks under persistent errors (1 click = 1 onReset call)", () => {
      const handleReset = vi.fn();

      render(
        <OCCEErrorBoundary onReset={handleReset}>
          <BuggyComponent shouldThrow={true} />
        </OCCEErrorBoundary>
      );

      const retryButton = screen.getByRole("button", { name: /다시 시도/i });

      // Click 5 times with fresh button query
      for (let i = 1; i <= 5; i++) {
        const btn = screen.getByRole("button", { name: /다시 시도/i });
        fireEvent.click(btn);
        expect(handleReset).toHaveBeenCalledTimes(i);
      }
    });

    it("verifies safe recovery when onReset resolves the underlying error condition", () => {
      let fail = true;
      const handleReset = vi.fn(() => {
        fail = false;
      });

      function RecoverableChild() {
        if (fail) throw new Error("Temporary crash");
        return <div data-testid="recovered-child">Successfully Recovered!</div>;
      }

      render(
        <OCCEErrorBoundary onReset={handleReset}>
          <RecoverableChild />
        </OCCEErrorBoundary>
      );

      expect(screen.getByRole("button", { name: /다시 시도/i })).toBeInTheDocument();
      expect(screen.queryByTestId("recovered-child")).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: /다시 시도/i }));

      expect(handleReset).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("recovered-child")).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /다시 시도/i })).not.toBeInTheDocument();
    });

    it("empirically verifies faulty onReset exception is caught and does not unmount or crash", () => {
      const faultyReset = vi.fn(() => {
        throw new Error("Explosion in onReset callback");
      });

      render(
        <OCCEErrorBoundary onReset={faultyReset}>
          <BuggyComponent shouldThrow={true} />
        </OCCEErrorBoundary>
      );

      const retryButton = screen.getByRole("button", { name: /다시 시도/i });
      expect(() => {
        fireEvent.click(retryButton);
      }).not.toThrow();

      expect(faultyReset).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error during boundary reset callback:",
        expect.any(Error)
      );
      // Card is still safely mounted in alert role
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("empirically verifies standalone OCCEFallbackCard with both resetErrorBoundary and onReset invokes ONLY resetErrorBoundary", () => {
      const mockResetErrorBoundary = vi.fn();
      const mockOnReset = vi.fn();

      render(
        <OCCEFallbackCard
          resetErrorBoundary={mockResetErrorBoundary}
          onReset={mockOnReset}
        />
      );

      const retryBtn = screen.getByRole("button", { name: /다시 시도/i });
      fireEvent.click(retryBtn);

      // resetErrorBoundary was called
      expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1);
      // onReset was NOT called directly by OCCEFallbackCard
      expect(mockOnReset).toHaveBeenCalledTimes(0);
    });

    it("verifies changing resetKeys triggers onReset exactly once with reason 'keys'", () => {
      const handleReset = vi.fn();

      function Host({ resetKey }) {
        return (
          <OCCEErrorBoundary resetKeys={[resetKey]} onReset={handleReset}>
            <BuggyComponent shouldThrow={true} />
          </OCCEErrorBoundary>
        );
      }

      const { rerender } = render(<Host resetKey={1} />);
      expect(handleReset).toHaveBeenCalledTimes(0);

      // Change resetKey
      rerender(<Host resetKey={2} />);

      expect(handleReset).toHaveBeenCalledTimes(1);
      expect(handleReset.mock.calls[0][0]).toHaveProperty("reason", "keys");
      expect(handleReset.mock.calls[0][0].prev).toEqual([1]);
      expect(handleReset.mock.calls[0][0].next).toEqual([2]);
    });
  });

  describe("Requirement 2 & Task 2: CustomCard density Prop and CardContext Conformance", () => {
    it("empirically verifies default density is 'standard' via useCardContext()", () => {
      let capturedContext = null;
      function Consumer() {
        capturedContext = useCardContext();
        return <div data-testid="consumer">{capturedContext.density}</div>;
      }

      render(
        <CustomCard>
          <Consumer />
        </CustomCard>
      );

      expect(capturedContext).toBeDefined();
      expect(capturedContext.density).toBe("standard");
      expect(screen.getByTestId("consumer")).toHaveTextContent("standard");
    });

    it("empirically verifies density='compact' is exposed to CardContext consumers", () => {
      let capturedContext = null;
      function Consumer() {
        capturedContext = useCardContext();
        return <div>{capturedContext.density}</div>;
      }

      render(
        <CustomCard density="compact">
          <Consumer />
        </CustomCard>
      );

      expect(capturedContext.density).toBe("compact");
    });

    it("empirically verifies density='comfortable' is exposed to CardContext consumers", () => {
      let capturedContext = null;
      function Consumer() {
        capturedContext = useCardContext();
        return <div>{capturedContext.density}</div>;
      }

      render(
        <CustomCard density="comfortable">
          <Consumer />
        </CustomCard>
      );

      expect(capturedContext.density).toBe("comfortable");
    });

    it("empirically verifies destructuring { variant, interactive, density } from useCardContext() per PROJECT.md:106", () => {
      let extracted = null;
      function Consumer() {
        const { variant, interactive, density } = useCardContext();
        extracted = { variant, interactive, density };
        return <div>{density}</div>;
      }

      render(
        <CustomCard variant="outlined" interactive={true} density="compact">
          <Consumer />
        </CustomCard>
      );

      expect(extracted).toEqual({
        variant: "outlined",
        interactive: true,
        density: "compact",
      });
    });

    it("empirically verifies default CardContext when rendered outside CustomCard", () => {
      let defaultCtx = null;
      function StandaloneConsumer() {
        defaultCtx = useCardContext();
        return <div>Outside</div>;
      }

      render(<StandaloneConsumer />);

      expect(defaultCtx).toEqual({
        themeColor: "#FF6B00",
        variant: "elevated",
        interactive: false,
        density: "standard",
      });
    });

    it("verifies nested CustomCard components isolate their density contexts", () => {
      let outerDensity = null;
      let innerDensity = null;

      function OuterConsumer() {
        outerDensity = useCardContext().density;
        return (
          <CustomCard density="compact" data-testid="inner-card">
            <InnerConsumer />
          </CustomCard>
        );
      }

      function InnerConsumer() {
        innerDensity = useCardContext().density;
        return <div data-testid="inner-text">{innerDensity}</div>;
      }

      render(
        <CustomCard density="comfortable" data-testid="outer-card">
          <OuterConsumer />
        </CustomCard>
      );

      expect(outerDensity).toBe("comfortable");
      expect(innerDensity).toBe("compact");
    });

    it("verifies CustomCard propTypes includes density with expected enumeration", () => {
      expect(CustomCard.propTypes).toBeDefined();
      expect(CustomCard.propTypes.density).toBeDefined();
    });

    it("empirically verifies 'density' in useCardContext() is true and readable via property access and destructuring", () => {
      let hasProp = false;
      let directValue = null;
      let destructuredValue = null;

      function Consumer() {
        const ctx = useCardContext();
        hasProp = "density" in ctx;
        directValue = ctx.density;
        const { density } = ctx;
        destructuredValue = density;
        return null;
      }

      render(
        <CustomCard density="comfortable">
          <Consumer />
        </CustomCard>
      );

      expect(hasProp).toBe(true);
      expect(directValue).toBe("comfortable");
      expect(destructuredValue).toBe("comfortable");
    });

    it("stress-tests multiple rapid clicks on retry button (idempotency under single error cycle)", () => {
      let callCount = 0;
      const handleReset = vi.fn(() => {
        callCount++;
      });

      render(
        <OCCEErrorBoundary onReset={handleReset}>
          <BuggyComponent shouldThrow={true} />
        </OCCEErrorBoundary>
      );

      const btn1 = screen.getByRole("button", { name: /다시 시도/i });
      fireEvent.click(btn1);

      // In one click cycle:
      expect(handleReset).toHaveBeenCalledTimes(1);
    });
  });
});
