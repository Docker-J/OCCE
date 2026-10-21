import React, { useState } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import fs from "fs";
import path from "path";

// Card Components
import PostDetailCard from "../PostDetailCard";
import DepartmentClosingCard from "../DepartmentClosingCard";
import CustomCard, { CardContext, useCardContext } from "../../../common/CustomCard";

// Legacy Card Components currently imported by pages
import LegacyPostDetailCard from "../../News/common/PostDetailCard";
import LegacyDepartmentClosingCard from "../../../pages/NextGen/components/DepartmentClosingCard";

// Error Boundary & Fallback Card
import OCCEErrorBoundary, { OCCEFallbackCard } from "../../../common/OCCEErrorBoundary";

describe("Milestone 3 Empirical Challenger Test Suite", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    consoleErrorSpy.mockRestore();
  });

  /* =====================================================================
   * SUITE 1: PostDetailCard Compound Component & Slot Architecture (R4)
   * ===================================================================== */
  describe("R4: PostDetailCard Compound Component & Slot Architecture", () => {
    it("empirically verifies compound subcomponents are attached to PostDetailCard", () => {
      expect(PostDetailCard.Header).toBeDefined();
      expect(PostDetailCard.Body).toBeDefined();
      expect(PostDetailCard.Actions).toBeDefined();
      expect(PostDetailCard.Badge).toBeDefined();
      expect(PostDetailCard.Header).toBe(CustomCard.Header);
      expect(PostDetailCard.Body).toBe(CustomCard.Body);
      expect(PostDetailCard.Actions).toBe(CustomCard.Actions);
      expect(PostDetailCard.Badge).toBe(CustomCard.Badge);
    });

    it("renders PostDetailCard slots correctly with props (title, body, timestamp, actions)", () => {
      const mockAction = vi.fn();

      render(
        <PostDetailCard
          title="부활절 주일 예배 안내"
          body="<p>부활절 감사 예배가 오전 11시에 드려집니다.</p>"
          timestamp="2026-04-05T11:00:00.000Z"
          actions={<button onClick={mockAction}>공유하기</button>}
        />
      );

      // Verify title renders in heading
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("부활절 주일 예배 안내");

      // Verify timestamp formatting
      expect(screen.getByText(/2026년 4월 5일/)).toBeInTheDocument();

      // Verify sanitized body content
      expect(
        screen.getByText("부활절 감사 예배가 오전 11시에 드려집니다.")
      ).toBeInTheDocument();

      // Verify action button fires callback
      const actionBtn = screen.getByRole("button", { name: "공유하기" });
      expect(actionBtn).toBeInTheDocument();
      fireEvent.click(actionBtn);
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it("correctly renders pin badge when isPinned=true and omits when isPinned=false", () => {
      const { rerender } = render(
        <PostDetailCard
          title="고정 공지 테스트"
          body="내용"
          isPinned={true}
        />
      );

      expect(screen.getByText("고정 공지")).toBeInTheDocument();

      // Rerender with isPinned=false
      rerender(
        <PostDetailCard
          title="고정 공지 테스트"
          body="내용"
          isPinned={false}
        />
      );

      expect(screen.queryByText("고정 공지")).not.toBeInTheDocument();
    });

    it("verifies font size controller callbacks fire properly", () => {
      const handleIncrease = vi.fn();
      const handleDecrease = vi.fn();
      const handleReset = vi.fn();

      render(
        <PostDetailCard
          title="글자 크기 조정 테스트"
          body="본문"
          fontSize={18}
          onIncreaseFont={handleIncrease}
          onDecreaseFont={handleDecrease}
          onResetFont={handleReset}
        />
      );

      const decreaseBtn = screen.getByTitle("글자 줄이기");
      const increaseBtn = screen.getByTitle("글자 키우기");
      const resetBtn = screen.getByTitle("기본 크기로 초기화");

      fireEvent.click(increaseBtn);
      expect(handleIncrease).toHaveBeenCalledTimes(1);

      fireEvent.click(decreaseBtn);
      expect(handleDecrease).toHaveBeenCalledTimes(1);

      fireEvent.click(resetBtn);
      expect(handleReset).toHaveBeenCalledTimes(1);
    });

    it("verifies action buttons inside children slot also fire callbacks", () => {
      const handleEdit = vi.fn();
      const handleDelete = vi.fn();

      render(
        <PostDetailCard title="게시물" body="본문">
          <div>
            <button onClick={handleEdit}>수정</button>
            <button onClick={handleDelete}>삭제</button>
          </div>
        </PostDetailCard>
      );

      fireEvent.click(screen.getByRole("button", { name: "수정" }));
      expect(handleEdit).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole("button", { name: "삭제" }));
      expect(handleDelete).toHaveBeenCalledTimes(1);
    });

    it("sanitizes malicious script tags and event handlers in body", () => {
      const maliciousHtml = `
        <p>안전한 텍스트</p>
        <script>window.pwned = true;</script>
        <img src="invalid-image" onerror="alert('xss')" />
      `;

      const { container } = render(
        <PostDetailCard title="XSS 방어 테스트" body={maliciousHtml} />
      );

      // Verify script tag is stripped out
      expect(container.querySelector("script")).toBeNull();
      // Verify onerror attribute is sanitized away
      const img = container.querySelector("img");
      if (img) {
        expect(img.getAttribute("onerror")).toBeNull();
      }
      expect(screen.getByText("안전한 텍스트")).toBeInTheDocument();
    });

    it("renders PostDetailCard.Badge directly with custom props", () => {
      render(
        <PostDetailCard.Badge
          variant="solid"
          color="#FF6B00"
          label="스페셜 뱃지"
        />
      );

      expect(screen.getByText("스페셜 뱃지")).toBeInTheDocument();
    });

    it("renders PostDetailCard compound subcomponents declaratively within CustomCard", () => {
      const handleAction = vi.fn();

      render(
        <CustomCard variant="elevated">
          <PostDetailCard.Header
            title="선언적 헤더"
            subtitle="선언적 서브타이틀"
            action={<PostDetailCard.Badge label="공지" />}
          />
          <PostDetailCard.Body>
            <div data-testid="declarative-body">선언적 본문 내용입니다.</div>
          </PostDetailCard.Body>
          <PostDetailCard.Actions>
            <button onClick={handleAction}>선언적 액션</button>
          </PostDetailCard.Actions>
        </CustomCard>
      );

      expect(screen.getByText("선언적 헤더")).toBeInTheDocument();
      expect(screen.getByText("선언적 서브타이틀")).toBeInTheDocument();
      expect(screen.getByText("공지")).toBeInTheDocument();
      expect(screen.getByTestId("declarative-body")).toBeInTheDocument();

      const btn = screen.getByRole("button", { name: "선언적 액션" });
      fireEvent.click(btn);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  /* =====================================================================
   * SUITE 2: DepartmentClosingCard Compound Component & Slot Architecture (R4)
   * ===================================================================== */
  describe("R4: DepartmentClosingCard Compound Component & Slot Architecture", () => {
    it("empirically verifies compound subcomponents are attached to DepartmentClosingCard", () => {
      expect(DepartmentClosingCard.Header).toBeDefined();
      expect(DepartmentClosingCard.Body).toBeDefined();
      expect(DepartmentClosingCard.Actions).toBeDefined();
      expect(DepartmentClosingCard.Header).toBe(CustomCard.Header);
      expect(DepartmentClosingCard.Body).toBe(CustomCard.Body);
      expect(DepartmentClosingCard.Actions).toBe(CustomCard.Actions);
    });

    it("renders title, subtitle, scripture reference, and children in proper slots", () => {
      render(
        <DepartmentClosingCard
          bgColor="#f0f7ff"
          borderColor="#cce3ff"
          title="유스 그룹 사역 안내"
          titleColor="#004085"
          subtitle="하나님의 말씀으로 자라나는 세대"
          subtitleColor="#383d41"
          reference="잠언 22:6"
          referenceColor="#155724"
        >
          <div data-testid="dept-child">예배 시간: 매주 주일 오전 10시</div>
        </DepartmentClosingCard>
      );

      expect(screen.getByText("유스 그룹 사역 안내")).toBeInTheDocument();
      expect(screen.getByText("하나님의 말씀으로 자라나는 세대")).toBeInTheDocument();
      expect(screen.getByText("잠언 22:6")).toBeInTheDocument();
      expect(screen.getByTestId("dept-child")).toBeInTheDocument();
    });

    it("fires action button callback inside DepartmentClosingCard actions slot", () => {
      const handleRegister = vi.fn();

      render(
        <DepartmentClosingCard
          title="청년부 모임"
          actions={<button onClick={handleRegister}>수련회 신청하기</button>}
        />
      );

      const regBtn = screen.getByRole("button", { name: "수련회 신청하기" });
      expect(regBtn).toBeInTheDocument();
      fireEvent.click(regBtn);
      expect(handleRegister).toHaveBeenCalledTimes(1);
    });

    it("omits Header when neither title nor subtitle is provided", () => {
      render(
        <DepartmentClosingCard reference="로마서 8:28">
          <div data-testid="body-only">본문 전용 카드</div>
        </DepartmentClosingCard>
      );

      expect(screen.getByText("로마서 8:28")).toBeInTheDocument();
      expect(screen.getByTestId("body-only")).toBeInTheDocument();

      // Heading for title should not be rendered
      expect(screen.queryByText("유스 그룹 사역 안내")).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { level: 6, name: "유스 그룹 사역 안내" })).not.toBeInTheDocument();
    });

    it("omits Actions slot when actions prop is absent", () => {
      render(
        <DepartmentClosingCard title="공지 카드">
          <div>버튼 없는 카드 내용</div>
        </DepartmentClosingCard>
      );

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders DepartmentClosingCard compound subcomponents declaratively within CustomCard", () => {
      const handleMore = vi.fn();

      render(
        <CustomCard variant="flat">
          <DepartmentClosingCard.Header
            title="선언적 부서 타이틀"
            subtitle="선언적 부서 서브타이틀"
          />
          <DepartmentClosingCard.Body>
            <div data-testid="dept-body">부서 소개 내용</div>
          </DepartmentClosingCard.Body>
          <DepartmentClosingCard.Actions>
            <button onClick={handleMore}>더보기</button>
          </DepartmentClosingCard.Actions>
        </CustomCard>
      );

      expect(screen.getByText("선언적 부서 타이틀")).toBeInTheDocument();
      expect(screen.getByText("선언적 부서 서브타이틀")).toBeInTheDocument();
      expect(screen.getByTestId("dept-body")).toBeInTheDocument();

      const btn = screen.getByRole("button", { name: "더보기" });
      fireEvent.click(btn);
      expect(handleMore).toHaveBeenCalledTimes(1);
    });
  });

  /* =====================================================================
   * SUITE 3: R3 Error Boundary Fault Isolation & Encasement Recovery
   * ===================================================================== */
  describe("R3: Error Boundary Fault Isolation & Encasement Tests", () => {
    it("WeeklyUpdate PDF Failure: contains error, renders OCCEFallbackCard with retry, page survives", () => {
      let failPdf = true;

      function FlakyPdfReader() {
        if (failPdf) {
          throw new Error("PDF.js WebWorker crashed: Invalid PDF structure");
        }
        return <div data-testid="pdf-content">PDF Document Rendered Successfully</div>;
      }

      function SimulatedWeeklyUpdatePage() {
        return (
          <div data-testid="weekly-update-page">
            <header data-testid="page-header">주보 헤더 (정상 작동)</header>
            <div data-testid="date-toolbar">2026년 10월 25일 주보</div>

            {/* ErrorBoundary simulating WeeklyUpdate.jsx:76-91 */}
            <OCCEErrorBoundary
              title="주보 PDF를 불러오는 중 오류가 발생했습니다"
              onReset={() => {
                failPdf = false;
              }}
            >
              <FlakyPdfReader />
            </OCCEErrorBoundary>

            <footer data-testid="page-footer">관리자 도구 버튼 (정상 작동)</footer>
          </div>
        );
      }

      render(<SimulatedWeeklyUpdatePage />);

      // Verify the page tree did NOT crash
      expect(screen.getByTestId("weekly-update-page")).toBeInTheDocument();
      expect(screen.getByTestId("page-header")).toBeInTheDocument();
      expect(screen.getByTestId("date-toolbar")).toBeInTheDocument();
      expect(screen.getByTestId("page-footer")).toBeInTheDocument();

      // Verify localized OCCEFallbackCard rendered
      expect(
        screen.getByText("주보 PDF를 불러오는 중 오류가 발생했습니다")
      ).toBeInTheDocument();
      const retryBtn = screen.getByRole("button", { name: "다시 시도" });
      expect(retryBtn).toBeInTheDocument();

      // Click retry button -> recovery
      fireEvent.click(retryBtn);

      // Verify recovered child is displayed
      expect(screen.getByTestId("pdf-content")).toBeInTheDocument();
      expect(
        screen.queryByText("주보 PDF를 불러오는 중 오류가 발생했습니다")
      ).not.toBeInTheDocument();
    });

    it("Footer GoogleMap Failure: contains error in compact card with fallback external link", () => {
      let failMap = true;

      function FlakyGoogleMap() {
        if (failMap) {
          throw new Error("Google Maps API script blocked or failed to load");
        }
        return <div data-testid="map-content">Google Map Rendered</div>;
      }

      function SimulatedFooter() {
        return (
          <div data-testid="footer-container">
            <div data-testid="footer-slogan">온 맘 다해 하나님을 사랑하고</div>
            <div data-testid="social-icons">소셜 미디어 링크</div>

            {/* ErrorBoundary simulating Footer.jsx:64-75 */}
            <OCCEErrorBoundary
              title="지도를 불러올 수 없습니다"
              fallbackLink={{
                label: "Google 지도에서 보기",
                url: "https://goo.gl/maps/gqpiA88gJSvbjfDD9",
              }}
              compact
              onReset={() => {
                failMap = false;
              }}
            >
              <FlakyGoogleMap />
            </OCCEErrorBoundary>
          </div>
        );
      }

      render(<SimulatedFooter />);

      // Verify Footer slogans and social icons are preserved
      expect(screen.getByTestId("footer-slogan")).toBeInTheDocument();
      expect(screen.getByTestId("social-icons")).toBeInTheDocument();

      // Verify fallback card renders
      expect(screen.getByText("지도를 불러올 수 없습니다")).toBeInTheDocument();

      // Verify external link button
      const linkBtn = screen.getByRole("link", { name: "Google 지도에서 보기" });
      expect(linkBtn).toBeInTheDocument();
      expect(linkBtn).toHaveAttribute(
        "href",
        "https://goo.gl/maps/gqpiA88gJSvbjfDD9"
      );
      expect(linkBtn).toHaveAttribute("target", "_blank");
      expect(linkBtn).toHaveAttribute("rel", "noopener noreferrer");

      // Verify retry button recovers
      const retryBtn = screen.getByRole("button", { name: "다시 시도" });
      fireEvent.click(retryBtn);

      expect(screen.getByTestId("map-content")).toBeInTheDocument();
      expect(screen.queryByText("지도를 불러올 수 없습니다")).not.toBeInTheDocument();
    });

    it("AttendanceDashboard Chart Failure: chart fails, summary cards and navigator stay alive, onReset re-fetches data", () => {
      let failChart = true;
      const mockFetchData = vi.fn(() => {
        failChart = false;
      });

      function FlakyTrendChart() {
        if (failChart) {
          throw new Error("Recharts SVG viewBox dimension calculation error");
        }
        return <div data-testid="chart-content">Attendance Trend Chart Rendered</div>;
      }

      function SimulatedDashboard() {
        return (
          <div data-testid="dashboard-page">
            <div data-testid="week-navigator">주차 네비게이터</div>
            <div data-testid="summary-cards">상단 4대 요약 카드</div>

            {/* ErrorBoundary simulating AttendanceDashboard.jsx:110-120 */}
            <OCCEErrorBoundary
              title="출석 통계 차트를 불러오는 중 오류가 발생했습니다"
              onReset={mockFetchData}
            >
              <FlakyTrendChart />
            </OCCEErrorBoundary>

            <div data-testid="garden-table">정원별 출석 현황 테이블</div>
          </div>
        );
      }

      render(<SimulatedDashboard />);

      // Verify dashboard remains intact
      expect(screen.getByTestId("week-navigator")).toBeInTheDocument();
      expect(screen.getByTestId("summary-cards")).toBeInTheDocument();
      expect(screen.getByTestId("garden-table")).toBeInTheDocument();

      // Verify error boundary
      expect(
        screen.getByText("출석 통계 차트를 불러오는 중 오류가 발생했습니다")
      ).toBeInTheDocument();

      // Click retry
      const retryBtn = screen.getByRole("button", { name: "다시 시도" });
      fireEvent.click(retryBtn);

      expect(mockFetchData).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("chart-content")).toBeInTheDocument();
    });

    it("automatically recovers when resetKeys change without clicking retry", () => {
      function FlakyDocReader({ fileId }) {
        if (fileId === "bad-file") {
          throw new Error("Corrupted PDF file");
        }
        return <div data-testid="doc-content">Doc Loaded: {fileId}</div>;
      }

      function Host({ fileId }) {
        return (
          <OCCEErrorBoundary
            title="주보 PDF 오류"
            resetKeys={[fileId]}
          >
            <FlakyDocReader fileId={fileId} />
          </OCCEErrorBoundary>
        );
      }

      const { rerender } = render(<Host fileId="bad-file" />);
      expect(screen.getByText("주보 PDF 오류")).toBeInTheDocument();
      expect(screen.queryByTestId("doc-content")).not.toBeInTheDocument();

      // Change fileId to valid file -> error boundary automatically resets
      rerender(<Host fileId="good-file" />);
      expect(screen.queryByText("주보 PDF 오류")).not.toBeInTheDocument();
      expect(screen.getByTestId("doc-content")).toBeInTheDocument();
    });

    it("survives repetitive stress failures and retries without breaking parent state", () => {
      let shouldFail = true;
      let renderCount = 0;

      function FlakyChild() {
        renderCount++;
        if (shouldFail) {
          throw new Error(`Flaky failure iteration #${renderCount}`);
        }
        return <div data-testid="flaky-success">Success!</div>;
      }

      function ParentWrapper() {
        const [counter, setCounter] = useState(0);

        return (
          <div>
            <span data-testid="parent-counter">{counter}</span>
            <button
              onClick={() => setCounter((c) => c + 1)}
              data-testid="inc-counter"
            >
              Increment Parent
            </button>
            <OCCEErrorBoundary title="스트레스 테스트">
              <FlakyChild />
            </OCCEErrorBoundary>
          </div>
        );
      }

      render(<ParentWrapper />);

      // Check initial crash caught
      expect(screen.getByText("스트레스 테스트")).toBeInTheDocument();
      expect(screen.getByTestId("parent-counter")).toHaveTextContent("0");

      // Parent state updates smoothly even while child is crashed
      fireEvent.click(screen.getByTestId("inc-counter"));
      expect(screen.getByTestId("parent-counter")).toHaveTextContent("1");

      // Repeated retry clicks while child still fails
      const retryBtn = screen.getByRole("button", { name: "다시 시도" });
      fireEvent.click(retryBtn);
      expect(screen.getByText("스트레스 테스트")).toBeInTheDocument();

      // Resolve error and retry
      shouldFail = false;
      const retryBtn2 = screen.getByRole("button", { name: "다시 시도" });
      fireEvent.click(retryBtn2);

      expect(screen.getByTestId("flaky-success")).toBeInTheDocument();
      expect(screen.getByTestId("parent-counter")).toHaveTextContent("1");
    });
  });

  /* =====================================================================
   * SUITE 4: Architectural Integration & Consumer Wiring Forensic Audit
   * ===================================================================== */
  describe("Forensic Audit: Card Consumer Integration & Re-export Wiring", () => {
    it("empirically checks whether Announcement and Column import refactored PostDetailCard or legacy PostDetailCard", () => {
      const newsCommonIndex = fs.readFileSync(
        path.resolve(__dirname, "../../News/common/index.js"),
        "utf8"
      );

      // Verify what News/common exports
      const exportsLegacy = newsCommonIndex.includes('export { default as PostDetailCard } from "./PostDetailCard"');
      expect(exportsLegacy).toBe(true);

      // Verify that News/common/PostDetailCard is NOT using CustomCard
      const legacyCardContent = fs.readFileSync(
        path.resolve(__dirname, "../../News/common/PostDetailCard.jsx"),
        "utf8"
      );
      const isLegacyUnrefactored = !legacyCardContent.includes("CustomCard");
      expect(isLegacyUnrefactored).toBe(true);

      // Verify that components/Cards/PostDetailCard DOES use CustomCard
      const refactoredCardContent = fs.readFileSync(
        path.resolve(__dirname, "../PostDetailCard.jsx"),
        "utf8"
      );
      expect(refactoredCardContent.includes("CustomCard")).toBe(true);
    });

    it("empirically checks whether NextGen pages import refactored DepartmentClosingCard or legacy", () => {
      const nextGenIndex = fs.readFileSync(
        path.resolve(__dirname, "../../../../src/pages/NextGen/components/index.js"),
        "utf8"
      );

      // Verify what NextGen/components exports
      const exportsLegacy = nextGenIndex.includes('export { default as DepartmentClosingCard } from "./DepartmentClosingCard"');
      expect(exportsLegacy).toBe(true);

      // Verify that NextGen/components/DepartmentClosingCard is NOT using CustomCard
      const legacyDeptCard = fs.readFileSync(
        path.resolve(__dirname, "../../../../src/pages/NextGen/components/DepartmentClosingCard.jsx"),
        "utf8"
      );
      const isLegacyUnrefactored = !legacyDeptCard.includes("CustomCard");
      expect(isLegacyUnrefactored).toBe(true);

      // Verify that components/Cards/DepartmentClosingCard DOES use CustomCard
      const refactoredDeptCard = fs.readFileSync(
        path.resolve(__dirname, "../DepartmentClosingCard.jsx"),
        "utf8"
      );
      expect(refactoredDeptCard.includes("CustomCard")).toBe(true);
    });
  });
});
