# E2E Test Infra: Modern React 19 Architecture Migration

## Test Philosophy
- Requirement-driven, opaque-box and contract-based verification.
- Validates the 5 modern React 19 abstractions:
  1. R1: Imperative Promise Dialogs (`useConfirm`)
  2. R2: React 19 Optimistic Updates (`useOptimistic`)
  3. R3: Resilient Error Boundaries with Reset Mechanism (`react-error-boundary`)
  4. R4: Compound Component Architecture (`CustomCard`)
  5. R5: Zustand 5 Selector Optimization (`useShallow`)

## Feature Inventory & Test Matrix
| # | Feature | Requirement | Tier 1 (Unit/Isolated) | Tier 2 (Boundary/Edge) | Tier 3 (Cross-Feature) | Tier 4 (Workflows) |
|---|---------|-------------|:----------------------:|:----------------------:|:----------------------:|:------------------:|
| 1 | `useConfirm` Promise Hook | R1 | Confirm resolves true, cancel resolves false, custom title/message | Rapid clicks, unmount cleanup, dismissal via backdrop | Used within async handlers, modal cascades | Album delete flow, SmallGroup report submit |
| 2 | `useOptimistic` Action Pattern | R2 | Instant UI reflection upon action dispatch | Network delay, API rejection rollback, empty payload | State sync with server response, multiple sequential actions | Member role change with rollback, Announcement pin toggle |
| 3 | `OCCEErrorBoundary` & Reset | R3 | Catches child render error, displays OCCE fallback card | Component remount on retry, resetKeys dependency change | Error in child modal, error in dynamic widget (map, chart) | PDFReader error recovery, TextEditor reset without state loss |
| 4 | `CustomCard` Compound Component | R4 | Renders Header, Body, Actions, Media, Badge in correct slots | Missing subcomponents, custom className, legacy prop adapter | Interactive card click events, nested actions | Post detail card rendering, Department closing card rendering |
| 5 | `useShallow` Store Subscriptions | R5 | Shallow comparison of selected object properties | Single property update, no-op store updates | Concurrent component updates, token refresh | ProtectedRoute auth check, ResponsiveAppBar multi-select |

## Test Architecture
- Test Runner: Node.js test runner / Vitest / Vite build test harness.
- Verification Commands:
  - Frontend Build: `npm run build --prefix frontend` (exit code 0, 0 compiler errors).
  - Backend Syntax: `find backend -name "*.js" -not -path "*/node_modules/*" -exec node -c {} +` (exit code 0, 0 syntax errors).
  - Runtime verification test scripts running against React 19 + Zustand 5 component modules.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Expected Outcome |
|---|----------|--------------------|------------------|
| 1 | Admin changes member role with network failure | R2 (Optimistic) + R5 (useShallow) | Immediate badge update in UI; on API failure, automatic rollback to original role + error snackbar; no unnecessary re-renders. |
| 2 | Leader submits Small Group Report | R1 (useConfirm) + R2 (Optimistic) + R5 (useShallow) | Confirmation dialog appears via `await confirm()`; on yes, immediate optimistic "reported" status feedback; on no, cancellation with no side effects. |
| 3 | PDF bulletin fails to load in WeeklyUpdate | R3 (ErrorBoundary) | Contextual OCCE retry card displays in place of PDF; rest of WeeklyUpdate page and navigation header remain functional; "다시 시도" triggers worker reload. |
| 4 | User browses Announcements & Album details | R1 (useConfirm) + R4 (CustomCard) | Album delete triggers imperative confirm; post and department cards render cleanly through compound components with proper styling. |
