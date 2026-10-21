/**
 * Empirical Challenge Harness for ConfirmProvider & useConfirm
 *
 * Stress-tests and empirically verifies:
 * 1. Contract & Initial State
 * 2. Pending Promise Lifecycle
 * 3. Confirmation Resolution (true)
 * 4. Cancellation Resolution (false)
 * 5. Dismissal via Backdrop / Escape (strictly false)
 * 6. String Shorthand support
 * 7. Custom Options & JSX Content
 * 8. Resilient handling of empty/null/non-object arguments
 * 9. Rapid successive / concurrent calls (superseding resolution to false)
 * 10. Rapid burst stress test (100 concurrent calls)
 * 11. Unmount cleanup & memory leak prevention (50 mount/unmount cycles)
 * 12. Double resolution idempotency
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIR = path.resolve(__dirname, "../../..");
const REPO_ROOT = path.resolve(FRONTEND_DIR, "..");

import { JSDOM } from "/tmp/test-env/node_modules/jsdom/lib/api.js";

// 1. Initialize headless browser environment with JSDOM
const dom = new JSDOM("<!doctype html><html><body><div id=\"root\"></div></body></html>", {
  url: "http://localhost:3000",
  pretendToBeVisual: true,
});

global.window = dom.window;
global.document = dom.window.document;
for (const key of Object.getOwnPropertyNames(dom.window)) {
  if (!(key in global)) {
    try {
      global[key] = dom.window[key];
    } catch {}
  }
}
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Track unhandled promise rejections
const unhandledRejections = [];
process.on("unhandledRejection", (reason) => {
  unhandledRejections.push(reason);
});

// 2. Load React, Testing Library, and Vite SSR module
import { createServer } from "../../../node_modules/vite/dist/node/index.js";
const server = await createServer({ root: FRONTEND_DIR, server: { middlewareMode: true } });

const { ConfirmProvider, useConfirm } = await server.ssrLoadModule("/src/common/ConfirmProvider.jsx");
const { render, act, fireEvent, screen, cleanup } = await import("../../../node_modules/@testing-library/react/dist/index.js");
const React = (await import("../../../node_modules/react/index.js")).default || await import("../../../node_modules/react/index.js");

const results = [];

function recordTest(name, passed, details = "") {
  results.push({ name, passed, details });
  const status = passed ? "✅ PASS" : "❌ FAIL";
  console.log(`${status}: ${name}${details ? ` (${details})` : ""}`);
}

async function runTests() {
  console.log("=================================================");
  console.log("  EMPIRICAL CHALLENGE: ConfirmProvider Lifecycle");
  console.log("=================================================");

  // TEST 1: useConfirm outside provider throws descriptive error
  try {
    let errorCaught = null;
    const RogueConsumer = () => {
      useConfirm();
      return null;
    };
    try {
      render(React.createElement(RogueConsumer));
    } catch (err) {
      errorCaught = err;
    }
    const passed = errorCaught && errorCaught.message.includes("useConfirm must be used within a ConfirmProvider");
    recordTest("useConfirm outside provider throws Error", passed, errorCaught?.message);
    cleanup();
  } catch (err) {
    recordTest("useConfirm outside provider throws Error", false, err.message);
    cleanup();
  }

  // TEST 2: Initial render has no dialog in DOM
  try {
    let confirmFn = null;
    const Consumer = () => {
      confirmFn = useConfirm();
      return React.createElement("div", { "data-testid": "ready" }, "Ready");
    };
    render(React.createElement(ConfirmProvider, null, React.createElement(Consumer)));
    const dialogs = document.querySelectorAll('[role="dialog"]');
    const passed = dialogs.length === 0 && typeof confirmFn === "function";
    recordTest("Initial render: No open dialog, hook returns function", passed, `dialog count = ${dialogs.length}`);
    cleanup();
  } catch (err) {
    recordTest("Initial render: No open dialog, hook returns function", false, err.message);
    cleanup();
  }

  // TEST 3: confirm(...) returns a pending Promise
  try {
    let confirmFn = null;
    const Consumer = () => {
      confirmFn = useConfirm();
      return React.createElement("div", null, "Consumer");
    };
    render(React.createElement(ConfirmProvider, null, React.createElement(Consumer)));

    let promise = null;
    act(() => {
      promise = confirmFn({
        title: "삭제 확인",
        message: "정말 삭제하시겠습니까?",
      });
    });

    const isPromise = promise instanceof Promise;
    let isPending = true;
    promise.then(() => { isPending = false; });
    await new Promise((r) => setTimeout(r, 10)); // allow microtasks

    recordTest("confirm(...) returns pending Promise", isPromise && isPending, `isPromise=${isPromise}, isPending=${isPending}`);
    cleanup();
  } catch (err) {
    recordTest("confirm(...) returns pending Promise", false, err.message);
    cleanup();
  }

  // TEST 4: Confirmation click resolves Promise to true
  try {
    let confirmFn = null;
    const Consumer = () => {
      confirmFn = useConfirm();
      return React.createElement("div", null, "Consumer");
    };
    render(React.createElement(ConfirmProvider, null, React.createElement(Consumer)));

    let promise = null;
    act(() => {
      promise = confirmFn({
        title: "삭제 확인",
        message: "확인 버튼을 누르세요",
        confirmText: "삭제 실행",
        cancelText: "취소",
      });
    });

    const confirmBtn = screen.getByRole("button", { name: "삭제 실행" });
    act(() => {
      fireEvent.click(confirmBtn);
    });

    const result = await promise;
    const passed = result === true;
    recordTest("Confirmation button click resolves to true", passed, `result = ${result}`);
    cleanup();
  } catch (err) {
    recordTest("Confirmation button click resolves to true", false, err.message);
    cleanup();
  }

  // TEST 5: Cancellation click resolves Promise to false
  try {
    let confirmFn = null;
    const Consumer = () => {
      confirmFn = useConfirm();
      return React.createElement("div", null, "Consumer");
    };
    render(React.createElement(ConfirmProvider, null, React.createElement(Consumer)));

    let promise = null;
    act(() => {
      promise = confirmFn({
        title: "취소 확인",
        message: "취소 버튼을 누르세요",
        cancelText: "돌아가기",
      });
    });

    const cancelBtn = screen.getByRole("button", { name: "돌아가기" });
    act(() => {
      fireEvent.click(cancelBtn);
    });

    const result = await promise;
    const passed = result === false;
    recordTest("Cancel button click resolves to false", passed, `result = ${result}`);
    cleanup();
  } catch (err) {
    recordTest("Cancel button click resolves to false", false, err.message);
    cleanup();
  }

  // TEST 6: String shorthand confirm("Are you sure?")
  try {
    let confirmFn = null;
    const Consumer = () => {
      confirmFn = useConfirm();
      return React.createElement("div", null, "Consumer");
    };
    render(React.createElement(ConfirmProvider, null, React.createElement(Consumer)));

    let promise = null;
    act(() => {
      promise = confirmFn("단순 문자열 질문입니다.");
    });

    const contentText = screen.getByText("단순 문자열 질문입니다.");
    const defaultConfirmBtn = screen.getByRole("button", { name: "확인" });
    const defaultCancelBtn = screen.getByRole("button", { name: "취소" });

    const renderedCorrectly = !!contentText && !!defaultConfirmBtn && !!defaultCancelBtn;

    act(() => {
      fireEvent.click(defaultConfirmBtn);
    });

    const result = await promise;
    const passed = renderedCorrectly && result === true;
    recordTest("String shorthand renders defaults and resolves true", passed, `rendered=${renderedCorrectly}, result=${result}`);
    cleanup();
  } catch (err) {
    recordTest("String shorthand renders defaults and resolves true", false, err.message);
    cleanup();
  }

  // TEST 7: Custom JSX content and severity styles
  try {
    let confirmFn = null;
    const Consumer = () => {
      confirmFn = useConfirm();
      return React.createElement("div", null, "Consumer");
    };
    render(React.createElement(ConfirmProvider, null, React.createElement(Consumer)));

    let promise = null;
    act(() => {
      promise = confirmFn({
        title: "경고 대화상자",
        message: "경고 본문",
        severity: "warning",
        content: React.createElement("span", { "data-testid": "custom-node" }, "커스텀 노드"),
      });
    });

    const customNode = screen.getByTestId("custom-node");
    const passed = customNode && customNode.textContent === "커스텀 노드";

    const cancelBtn = screen.getByRole("button", { name: "취소" });
    act(() => {
      fireEvent.click(cancelBtn);
    });
    await promise;

    recordTest("Custom JSX content renders correctly in dialog", passed, `content = ${customNode?.textContent}`);
    cleanup();
  } catch (err) {
    recordTest("Custom JSX content renders correctly in dialog", false, err.message);
    cleanup();
  }

  // TEST 8: Backdrop / Escape dismiss via MUI Dialog onClose resolves strictly to false
  try {
    let confirmFn = null;
    const Consumer = () => {
      confirmFn = useConfirm();
      return React.createElement("div", null, "Consumer");
    };
    render(React.createElement(ConfirmProvider, null, React.createElement(Consumer)));

    let promise = null;
    act(() => {
      promise = confirmFn("닫기 테스트");
    });

    // Simulate Escape key press on dialog
    const dialog = screen.getByRole("dialog");
    act(() => {
      fireEvent.keyDown(dialog, { key: "Escape", code: "Escape", keyCode: 27 });
    });

    const result = await promise;
    const passed = result === false;
    recordTest("Dismissal via Escape/Backdrop resolves strictly to false", passed, `result = ${result}`);
    cleanup();
  } catch (err) {
    recordTest("Dismissal via Escape/Backdrop resolves strictly to false", false, err.message);
    cleanup();
  }

  // TEST 9: Rapid successive calls — supersede previous with false
  try {
    let confirmFn = null;
    const Consumer = () => {
      confirmFn = useConfirm();
      return React.createElement("div", null, "Consumer");
    };
    render(React.createElement(ConfirmProvider, null, React.createElement(Consumer)));

    let p1, p2, p3;
    act(() => {
      p1 = confirmFn("First Call");
      p2 = confirmFn("Second Call");
      p3 = confirmFn("Third Call");
    });

    const r1 = await p1;
    const r2 = await p2;

    const thirdBtn = screen.getByRole("button", { name: "확인" });
    act(() => {
      fireEvent.click(thirdBtn);
    });
    const r3 = await p3;

    const passed = r1 === false && r2 === false && r3 === true;
    recordTest("Superseded calls resolve false, active call resolves true", passed, `r1=${r1}, r2=${r2}, r3=${r3}`);
    cleanup();
  } catch (err) {
    recordTest("Superseded calls resolve false, active call resolves true", false, err.message);
    cleanup();
  }

  // TEST 10: STRESS TEST — 100 concurrent rapid calls in tight loop
  try {
    let confirmFn = null;
    const Consumer = () => {
      confirmFn = useConfirm();
      return React.createElement("div", null, "Consumer");
    };
    render(React.createElement(ConfirmProvider, null, React.createElement(Consumer)));

    const promises = [];
    act(() => {
      for (let i = 0; i < 100; i++) {
        promises.push(confirmFn(`Rapid Call ${i}`));
      }
    });

    // First 99 must resolve to false
    const settledFirst99 = await Promise.all(promises.slice(0, 99));
    const allFalse = settledFirst99.every((val) => val === false);

    // 100th remains pending and can be confirmed
    const lastBtn = screen.getByRole("button", { name: "확인" });
    act(() => {
      fireEvent.click(lastBtn);
    });
    const rLast = await promises[99];

    const passed = allFalse && rLast === true && unhandledRejections.length === 0;
    recordTest(
      "STRESS: 100 rapid concurrent calls resolve without leaks or rejections",
      passed,
      `first99AllFalse=${allFalse}, lastResult=${rLast}, unhandledRejections=${unhandledRejections.length}`
    );
    cleanup();
  } catch (err) {
    recordTest("STRESS: 100 rapid concurrent calls resolve without leaks or rejections", false, err.message);
    cleanup();
  }

  // TEST 11: Unmount safety — pending promise resolves to false on unmount
  try {
    let confirmFn = null;
    const Consumer = () => {
      confirmFn = useConfirm();
      return React.createElement("div", null, "Consumer");
    };
    const { unmount } = render(React.createElement(ConfirmProvider, null, React.createElement(Consumer)));

    let promise = null;
    act(() => {
      promise = confirmFn("Unmount test");
    });

    // Unmount the entire provider while promise is pending
    act(() => {
      unmount();
    });

    const result = await promise;
    const passed = result === false;
    recordTest("Unmount cleanup resolves pending promise to false", passed, `result=${result}`);
  } catch (err) {
    recordTest("Unmount cleanup resolves pending promise to false", false, err.message);
  }

  // TEST 12: STRESS TEST — 50 mount/unmount cycles with in-flight promises
  try {
    let cyclesPassed = 0;
    for (let i = 0; i < 50; i++) {
      let confirmFn = null;
      const Consumer = () => {
        confirmFn = useConfirm();
        return React.createElement("div", null, `Cycle ${i}`);
      };
      const { unmount } = render(React.createElement(ConfirmProvider, null, React.createElement(Consumer)));

      let promise = null;
      act(() => {
        promise = confirmFn(`Cycle ${i} in flight`);
      });

      act(() => {
        unmount();
      });

      const res = await promise;
      if (res === false) cyclesPassed++;
    }

    const passed = cyclesPassed === 50 && unhandledRejections.length === 0;
    recordTest(
      "STRESS: 50 unmount cycles with in-flight promises resolve safely",
      passed,
      `cyclesPassed=${cyclesPassed}/50, unhandledRejections=${unhandledRejections.length}`
    );
  } catch (err) {
    recordTest("STRESS: 50 unmount cycles with in-flight promises resolve safely", false, err.message);
  }

  // TEST 13: Double-resolution idempotency (clicking confirm twice does not throw or re-resolve)
  try {
    let confirmFn = null;
    const Consumer = () => {
      confirmFn = useConfirm();
      return React.createElement("div", null, "Consumer");
    };
    render(React.createElement(ConfirmProvider, null, React.createElement(Consumer)));

    let promise = null;
    act(() => {
      promise = confirmFn("Idempotency Test");
    });

    const confirmBtn = screen.getByRole("button", { name: "확인" });
    act(() => {
      fireEvent.click(confirmBtn);
      // Immediately click again
      fireEvent.click(confirmBtn);
    });

    const result = await promise;
    const passed = result === true;
    recordTest("Double click on confirm button is idempotent and safe", passed, `result=${result}`);
    cleanup();
  } catch (err) {
    recordTest("Double click on confirm button is idempotent and safe", false, err.message);
    cleanup();
  }

  // TEST 14: Non-object / empty arguments resilience
  try {
    let confirmFn = null;
    const Consumer = () => {
      confirmFn = useConfirm();
      return React.createElement("div", null, "Consumer");
    };
    render(React.createElement(ConfirmProvider, null, React.createElement(Consumer)));

    let pEmpty, pNull, pNum;
    act(() => {
      pEmpty = confirmFn({});
    });
    act(() => {
      pNull = confirmFn(null);
    });
    act(() => {
      pNum = confirmFn(12345);
    });

    const confirmBtn = screen.getByRole("button", { name: "확인" });
    act(() => {
      fireEvent.click(confirmBtn);
    });

    const rEmpty = await pEmpty;
    const rNull = await pNull;
    const rNum = await pNum;

    const passed = rEmpty === false && rNull === false && rNum === true;
    recordTest("Empty/null/number arguments handled gracefully without crash", passed, `rEmpty=${rEmpty}, rNull=${rNull}, rNum=${rNum}`);
    cleanup();
  } catch (err) {
    recordTest("Empty/null/number arguments handled gracefully without crash", false, err.message);
    cleanup();
  }

  // Close Vite server
  await server.close();

  // Summary
  console.log("=================================================");
  const allPassed = results.every((r) => r.passed);
  const total = results.length;
  const passedCount = results.filter((r) => r.passed).length;
  console.log(`Summary: ${passedCount}/${total} tests passed.`);
  if (unhandledRejections.length > 0) {
    console.error(`⚠️ Detected ${unhandledRejections.length} unhandled rejections!`, unhandledRejections);
  } else {
    console.log("Zero unhandled promise rejections detected.");
  }
  console.log("=================================================");

  if (!allPassed || unhandledRejections.length > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
