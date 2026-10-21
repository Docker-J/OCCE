# Project: Modern React 19 Architectural Migration

## Architecture
This project refactors legacy/boilerplate React patterns in the OCCE church management web platform to cutting-edge React 19, Zustand 5, and modern component architectural patterns.

### Key Architectural Pillars:
1. **Imperative Promise Dialog Pattern (`useConfirm`)**:
   - Centralized `ConfirmProvider` and `useConfirm()` hook under `frontend/src/common/`.
   - Replaces manual boolean state management (`const [open, setOpen] = useState(false)`), ad-hoc modal JSX boilerplate, and synchronous browser `window.confirm` calls.
   - Operates imperatively: `const confirm = useConfirm(); if (await confirm({ title, message, ... })) { ... }`.
   - Cleans up pending promises on unmount to prevent memory leaks and state updates on unmounted components.

2. **React 19 Optimistic Updates (`useOptimistic`)**:
   - Utilizes React 19's `useOptimistic` hook paired with `startTransition` for instantaneous optimistic UI updates across interactive workflows.
   - In `useMemberManagement.js`, updates user roles and removes deleted users immediately in the table and summary metrics; automatically rolls back upon API rejection.
   - In `Announcement.jsx`, toggles pinned state immediately without intrusive full-screen blocking spinners (`<FullScreenLoading />`), rolling back if the network request fails.
   - In `useSmallGroupReport.js`, provides optimistic feedback on report submission.

3. **Resilient Error Boundaries with Reset Mechanism (`react-error-boundary`)**:
   - Employs `react-error-boundary` (v6.1.6) for localized fault isolation.
   - Introduces `OCCEFallbackCard` adhering to OCCE theme tokens (`#FF6B00` brand color, NanumSquare font, 16px radius, "다시 시도" retry button) and `OCCEErrorBoundary`.
   - Encases high-risk dynamic third-party dependencies:
     - `PDFReader` (PDF.js / react-pdf WebWorker) in `WeeklyUpdate.jsx`
     - `TextEditor` (CKEditor 5) in `AnnouncementPostModal.jsx` and `ColumnPostModal.jsx`
     - `GoogleMap` (@vis.gl/react-google-maps) in `Footer.jsx`
     - Dashboard visualization widgets in `AttendanceDashboard.jsx`
   - Features a localized retry/reset action via `resetErrorBoundary()` and `resetKeys` without requiring full-page reload.

4. **Compound Component Architecture (`CustomCard`)**:
   - Implements `<CustomCard>` compound components in `frontend/src/common/CustomCard.jsx` sharing internal React Context (`CardContext`).
   - Provides composable subcomponents: `CustomCard.Header`, `CustomCard.Body`, `CustomCard.Actions`, `CustomCard.Media`, and `CustomCard.Badge`.
   - Replaces rigid cards accepting 10+ props (`PostDetailCard` [10 props], `DepartmentClosingCard` [11 props]) with flexible, declarative slot composition.
   - Includes backward-compatibility props adapter to ensure existing card usages continue functioning seamlessly.

5. **Zustand 5 Selector Optimization (`useShallow`)**:
   - Optimizes multi-property subscriptions from the single global store (`useAuthStore`) using `useShallow` from `zustand/react/shallow`.
   - Consolidates 7 multi-subscriber components (`ProtectedRoute.jsx`, `useSmallGroupReport.js`, `ResponsiveAppBar.jsx`, `useMemberManagement.js`, `NotificationContext.jsx`, `UserManager.jsx`, and `useWeeklyUpdate.js`) from multiple separate selector invocations into single shallow-compared object selectors.
   - Prevents cascading re-renders when unrelated auth state changes (e.g. background token refresh, expireTime updates).

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | `useConfirm` Provider & Hook | Centralized promise-based confirmation dialog hook and provider with unmount cleanup | M1 | ORIGINAL_REQUEST §R1 |
| 2 | `CustomCard` Compound Component | Context-driven compound card architecture with Header, Body, Actions, Media, Badge slots | M1 | ORIGINAL_REQUEST §R4 |
| 3 | `OCCEErrorBoundary` & Fallback | Contextual error boundary and OCCE-themed retry card with reset mechanism | M1 | ORIGINAL_REQUEST §R3 |
| 4 | `App.jsx` Provider Wiring | Mount `ConfirmProvider` in app root hierarchy | M1 | ORIGINAL_REQUEST §R1 |
| 5 | `useAuthStore` Selector Optimization | Refactor 7 multi-property store consumers using `useShallow` from `zustand/react/shallow` | M2 | ORIGINAL_REQUEST §R5 |
| 6 | Optimistic Member Management | Implement `useOptimistic` for instantaneous role edits and member deletions with rollback | M2 | ORIGINAL_REQUEST §R2 |
| 7 | Optimistic Announcement Pinning | Implement `useOptimistic` for non-blocking pin/unpin toggles with rollback | M2 | ORIGINAL_REQUEST §R2 |
| 8 | Optimistic Small Group Report | Implement `useOptimistic` for report submission status | M2 | ORIGINAL_REQUEST §R2 |
| 9 | Album Confirmation Refactoring | Refactor `Album.jsx` delete flows to use imperative `await confirm()` | M3 | ORIGINAL_REQUEST §R1 |
| 10 | Small Group Report Confirm Refactor | Refactor `SmallGroupReport.jsx` & `useSmallGroupReport.js` to use `useConfirm`, removing `window.confirm` and manual modal state | M3 | ORIGINAL_REQUEST §R1 |
| 11 | Post Detail Card Migration | Refactor `PostDetailCard.jsx` (10 props) to `<CustomCard>` compound components | M3 | ORIGINAL_REQUEST §R4 |
| 12 | Department Closing Card Migration | Refactor `DepartmentClosingCard.jsx` (11 props) to `<CustomCard>` compound components | M3 | ORIGINAL_REQUEST §R4 |
| 13 | Dynamic Module Error Boundary Wrapping | Encase `PDFReader`, `TextEditor`, `GoogleMap`, and Dashboard with `OCCEErrorBoundary` | M3 | ORIGINAL_REQUEST §R3 |
| 14 | Automated Test Suite | Test suite verifying R1 (promises), R2 (optimistic + rollback), R3 (boundary reset), R4 (compound cards), R5 (useShallow) | M4 | ORIGINAL_REQUEST Acceptance Criteria |
| 15 | Build & Syntax Verification | Verify clean `npm run build --prefix frontend` (0 errors) and backend `node -c` (0 errors) | M4 | ORIGINAL_REQUEST Acceptance Criteria |
| 16 | Adversarial & Forensic Audit | Stress testing edge cases and forensic integrity verification | M4 | Iteration Gate |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Core Foundations & Abstractions | Features 1, 2, 3, 4 (`ConfirmProvider`, `useConfirm`, `CustomCard`, `OCCEErrorBoundary`, `OCCEFallbackCard`, `App.jsx`) | none | DONE |
| M2 | State & Store Modernization | Features 5, 6, 7, 8 (`useShallow` across 7 consumers, `useOptimistic` in MemberManagement, Announcement, SmallGroupReport) | M1 | DONE |
| M3 | Consumer Migration & Error Encasement | Features 9, 10, 11, 12, 13 (Refactor `Album.jsx`, `SmallGroupReport.jsx`, `PostDetailCard`, `DepartmentClosingCard`, wrap dynamic modules) | M1, M2 | IN_PROGRESS |
| M4 | E2E Testing, Verification & Forensic Audit | Features 14, 15, 16 (Comprehensive test suite, build checks, challenger stress tests, forensic audit) | M3 | PLANNED |

---

## Interface Contracts

### 1. `useConfirm` Hook & Provider
- **File**: `frontend/src/common/ConfirmProvider.jsx` (exporting `ConfirmProvider` and `useConfirm`)
- **Signature**:
  ```typescript
  interface ConfirmOptions {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: "primary" | "error" | "warning" | "info" | "success";
    severity?: "warning" | "error" | "info";
    content?: React.ReactNode;
  }
  function useConfirm(): (options: ConfirmOptions | string) => Promise<boolean>;
  ```
- **Behavior**:
  - Resolves `true` when confirmed.
  - Resolves `false` when cancelled or dismissed by backdrop/escape.
  - Cleans up active promise resolvers on unmount without throwing errors.

### 2. `CustomCard` Compound Component
- **File**: `frontend/src/common/CustomCard.jsx`
- **Subcomponents**:
  - `<CustomCard variant="elevated|outlined|flat" interactive={boolean} className={string}>`
  - `<CustomCard.Header title={ReactNode} subtitle={ReactNode} action={ReactNode} avatar={ReactNode} />`
  - `<CustomCard.Body className={string}>{children}</CustomCard.Body>`
  - `<CustomCard.Actions align="left|right|between" className={string}>{children}</CustomCard.Actions>`
  - `<CustomCard.Media src={string} alt={string} height={number|string} />`
  - `<CustomCard.Badge variant={string} color={string}>{children}</CustomCard.Badge>`
- **Internal Context**: `CardContext` exposing `{ variant, interactive, density }`.
- **Backward-Compatibility**: Supports legacy props (`title`, `children`, `action`, `onClick`, `style`, `sx`).

### 3. `OCCEErrorBoundary` & `OCCEFallbackCard`
- **File**: `frontend/src/common/OCCEErrorBoundary.jsx` & `frontend/src/common/OCCEFallbackCard.jsx`
- **Props**:
  ```typescript
  interface OCCEErrorBoundaryProps {
    children: React.ReactNode;
    title?: string;
    resetKeys?: any[];
    onReset?: () => void;
    compact?: boolean;
    fallbackLink?: { label: string; url: string };
  }
  ```
- **Behavior**:
  - Catches render errors in wrapped subtree.
  - Displays localized OCCE card with Korean title ("모듈을 불러오는 중 오류가 발생했습니다"), message, and "다시 시도 (Retry)" button.
  - Calls `resetErrorBoundary()` upon click, triggering clean remount of child.

### 4. `useShallow` Store Subscriptions
- **Import**: `import { useShallow } from "zustand/react/shallow";`
- **Pattern**:
  ```javascript
  const { authenticated, admin, isLeader } = useAuthStore(
    useShallow((state) => ({
      authenticated: state.authenticated,
      admin: state.admin,
      isLeader: state.isLeader,
    }))
  );
  ```

### 5. `useOptimistic` Action Pattern
- **Hook**: `const [optimisticState, setOptimisticState] = useOptimistic(actualState, updateFn);`
- **Execution**:
  ```javascript
  startTransition(async () => {
    setOptimisticState(optimisticPayload);
    try {
      await apiCall();
      setActualState(newActualPayload);
    } catch (err) {
      // optimisticState automatically reverts to actualState on failure
      showErrorNotification(err);
    }
  });
  ```

---

## Code Layout
- `frontend/src/common/`
  - `ConfirmProvider.jsx`: `ConfirmProvider` and `useConfirm()` hook.
  - `CustomCard.jsx`: Compound Card component and subcomponents.
  - `OCCEErrorBoundary.jsx`: Contextual error boundary wrapper.
  - `OCCEFallbackCard.jsx`: OCCE themed fallback card with reset button.
  - `ProtectedRoute.jsx`: Refactored `useAuthStore` subscription with `useShallow`.
- `frontend/src/pages/Admin/`
  - `hooks/useMemberManagement.js`: Refactored with `useOptimistic` and `useShallow`.
  - `AttendanceDashboard.jsx`: Encase `AttendanceTrendChart` with `OCCEErrorBoundary`.
- `frontend/src/pages/News/`
  - `Announcements/Announcement.jsx`: Refactored pin toggle with `useOptimistic`.
  - `Announcement/AnnouncementPostModal.jsx`: Encase `TextEditor` with `OCCEErrorBoundary`.
  - `Columns/ColumnPostModal.jsx`: Encase `TextEditor` with `OCCEErrorBoundary`.
  - `WeeklyUpdate/WeeklyUpdate.jsx`: Encase `PDFReader` with `OCCEErrorBoundary`.
  - `Albums/Album.jsx`: Refactored with `useConfirm()`.
- `frontend/src/pages/Community/`
  - `SmallGroupReport.jsx`: Refactored with `useConfirm()`.
  - `hooks/useSmallGroupReport.js`: Refactored with `useShallow`, `useConfirm`, `useOptimistic`.
- `frontend/src/header/`
  - `ResponsiveAppBar.jsx`: Refactored with `useShallow`.
  - `Footer.jsx`: Encase `GoogleMap` with `OCCEErrorBoundary`.
- `frontend/src/components/Cards/` (or common card locations)
  - `PostDetailCard.jsx`: Refactored to `<CustomCard>` compound components.
  - `DepartmentClosingCard.jsx`: Refactored to `<CustomCard>` compound components.

---

## Protected Paths & Constraints
- STRICTLY DO NOT EDIT:
  - `backend/controller/schedules.controller.js`
  - `frontend/src/pages/News/Schedules/*`
- Edmonton timezone must remain UTC-6 (permanent daylight saving time).
- Retain native `.xlsx` (SheetJS) church registry file handling.
- Mandatory integrity warning on all workers; forensic audit failure is an unconditional veto.
