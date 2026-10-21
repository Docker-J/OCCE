import React, { useEffect, useRef } from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { useShallow } from "zustand/react/shallow";
import useAuthStore from "./useAuthStore";
import ProtectedRoute from "../common/ProtectedRoute";

describe("Zustand 5 useShallow Selector Optimization & Stress Tests", () => {
  // Reset store to known baseline before each test
  beforeEach(() => {
    act(() => {
      useAuthStore.setState({
        authenticated: false,
        authInitialized: true,
        admin: false,
        isLeader: false,
        isRemembered: false,
        accessToken: null,
        idToken: null,
        userProfile: null,
        expireTime: null,
      });
    });
  });

  describe("1. Re-render Isolation (Unselected property mutations)", () => {
    it("does NOT re-render when unselected store properties change", () => {
      let renderCount = 0;
      let latestRenderedState = null;

      const TestComponent = () => {
        renderCount++;
        const state = useAuthStore(
          useShallow((s) => ({
            authenticated: s.authenticated,
            admin: s.admin,
          }))
        );
        latestRenderedState = state;
        return (
          <div data-testid="consumer">
            auth:{String(state.authenticated)},admin:{String(state.admin)}
          </div>
        );
      };

      render(<TestComponent />);
      expect(renderCount).toBe(1);
      expect(latestRenderedState).toEqual({ authenticated: false, admin: false });

      // 1. Mutate unselected expireTime
      act(() => {
        useAuthStore.setState({ expireTime: 1729540000000 });
      });
      expect(renderCount).toBe(1);

      // 2. Mutate unselected isRemembered
      act(() => {
        useAuthStore.setState({ isRemembered: true });
      });
      expect(renderCount).toBe(1);

      // 3. Mutate unselected isLeader
      act(() => {
        useAuthStore.setState({ isLeader: true });
      });
      expect(renderCount).toBe(1);

      // 4. Mutate unselected accessToken
      act(() => {
        useAuthStore.setState({ accessToken: "dummy-access-token" });
      });
      expect(renderCount).toBe(1);

      // 5. Mutate unselected idToken
      act(() => {
        useAuthStore.setState({ idToken: "dummy-id-token" });
      });
      expect(renderCount).toBe(1);

      // 6. Mutate unselected userProfile
      act(() => {
        useAuthStore.setState({
          userProfile: { name: "홍길동", email: "hong@example.com" },
        });
      });
      expect(renderCount).toBe(1);

      // Verify that throughout all 6 unselected mutations, render count stayed strictly 1
      expect(screen.getByTestId("consumer").textContent).toBe("auth:false,admin:false");
    });
  });

  describe("2. Reactivity & Clean Re-renders (Selected property mutations)", () => {
    it("DOES re-render cleanly when selected store properties change", () => {
      let renderCount = 0;
      let latestRenderedState = null;

      const TestComponent = () => {
        renderCount++;
        const state = useAuthStore(
          useShallow((s) => ({
            authenticated: s.authenticated,
            admin: s.admin,
          }))
        );
        latestRenderedState = state;
        return (
          <div data-testid="consumer">
            auth:{String(state.authenticated)},admin:{String(state.admin)}
          </div>
        );
      };

      render(<TestComponent />);
      expect(renderCount).toBe(1);

      // 1. Update authenticated from false -> true
      act(() => {
        useAuthStore.setState({ authenticated: true });
      });
      expect(renderCount).toBe(2);
      expect(latestRenderedState).toEqual({ authenticated: true, admin: false });
      expect(screen.getByTestId("consumer").textContent).toBe("auth:true,admin:false");

      // 2. Update admin from false -> true
      act(() => {
        useAuthStore.setState({ admin: true });
      });
      expect(renderCount).toBe(3);
      expect(latestRenderedState).toEqual({ authenticated: true, admin: true });
      expect(screen.getByTestId("consumer").textContent).toBe("auth:true,admin:true");

      // 3. Setting admin to true again (no-op value change) MUST NOT re-render
      act(() => {
        useAuthStore.setState({ admin: true });
      });
      expect(renderCount).toBe(3);

      // 4. Updating both selected properties simultaneously
      act(() => {
        useAuthStore.setState({ authenticated: false, admin: false });
      });
      expect(renderCount).toBe(4);
      expect(latestRenderedState).toEqual({ authenticated: false, admin: false });
      expect(screen.getByTestId("consumer").textContent).toBe("auth:false,admin:false");
    });
  });

  describe("3. Infinite Loop Prevention & Object Literal Instantiation", () => {
    it("prevents infinite render loops when returning new object literals in selector", () => {
      let renderCount = 0;
      let effectRunCount = 0;

      const TestComponent = () => {
        renderCount++;
        // Returns a newly instantiated object literal every time the selector runs
        const slice = useAuthStore(
          useShallow((state) => ({
            authInitialized: state.authInitialized,
            authenticated: state.authenticated,
            admin: state.admin,
          }))
        );

        // Effect depends on the object returned by useShallow
        useEffect(() => {
          effectRunCount++;
        }, [slice]);

        return (
          <div data-testid="slice">
            {slice.authenticated ? "logged-in" : "anonymous"}
          </div>
        );
      };

      render(<TestComponent />);
      expect(renderCount).toBe(1);
      expect(effectRunCount).toBe(1);

      // Mutate unselected store state multiple times
      act(() => {
        useAuthStore.setState({ expireTime: 1000 });
        useAuthStore.setState({ isRemembered: true });
        useAuthStore.setState({ accessToken: "abc" });
      });

      // useShallow memoizes the shallow equality; neither render nor effect should run
      expect(renderCount).toBe(1);
      expect(effectRunCount).toBe(1);
    });

    it("demonstrates contrasting failure mode of naive selectors without useShallow", () => {
      // In React 19 + Zustand 5, returning an un-memoized object literal from a selector
      // violates useSyncExternalStore getSnapshot caching and triggers an immediate fatal error:
      // "The result of getSnapshot should be cached to avoid an infinite loop" / "Maximum update depth exceeded"

      const ComponentWithoutShallow = () => {
        // ANTI-PATTERN: returning object literal without useShallow
        const { authenticated } = useAuthStore((s) => ({ authenticated: s.authenticated }));
        return <div>{String(authenticated)}</div>;
      };

      // Suppress React error log output in console for this deliberate test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(<ComponentWithoutShallow />);
      }).toThrow(/Maximum update depth exceeded|getSnapshot/);

      console.error = originalError;
    });
  });

  describe("4. Multi-Consumer Cross-Slice Isolation (All 7 Refactored Consumers)", () => {
    it("properly isolates re-renders across all 7 refactored consumer slices", () => {
      const renderCounts = {
        protectedRoute: 0,
        smallGroupReport: 0,
        responsiveAppBar: 0,
        memberManagement: 0,
        notificationContext: 0,
        userManager: 0,
        weeklyUpdate: 0,
      };

      // 1. ProtectedRoute slice: { authInitialized, authenticated, admin, isLeader }
      const ProtectedRouteConsumer = () => {
        renderCounts.protectedRoute++;
        const { authInitialized, authenticated, admin, isLeader } = useAuthStore(
          useShallow((state) => ({
            authInitialized: state.authInitialized,
            authenticated: state.authenticated,
            admin: state.admin,
            isLeader: state.isLeader,
          }))
        );
        return <div data-testid="c-protected">{String(authenticated)}</div>;
      };

      // 2. SmallGroupReport slice: { authenticated, authInitialized, isLeader }
      const SmallGroupReportConsumer = () => {
        renderCounts.smallGroupReport++;
        const { authenticated, authInitialized, isLeader } = useAuthStore(
          useShallow((state) => ({
            authenticated: state.authenticated,
            authInitialized: state.authInitialized,
            isLeader: state.isLeader,
          }))
        );
        return <div data-testid="c-smallgroup">{String(authenticated)}</div>;
      };

      // 3. ResponsiveAppBar slice: { authenticated, admin, isLeader, deleteToken }
      const ResponsiveAppBarConsumer = () => {
        renderCounts.responsiveAppBar++;
        const { authenticated, admin, isLeader, deleteToken } = useAuthStore(
          useShallow((state) => ({
            authenticated: state.authenticated,
            admin: state.admin,
            isLeader: state.isLeader,
            deleteToken: state.deleteToken,
          }))
        );
        return <div data-testid="c-appbar">{String(authenticated)}</div>;
      };

      // 4. MemberManagement slice: { authenticated, authInitialized, admin }
      const MemberManagementConsumer = () => {
        renderCounts.memberManagement++;
        const { authenticated, authInitialized, admin } = useAuthStore(
          useShallow((state) => ({
            authenticated: state.authenticated,
            authInitialized: state.authInitialized,
            admin: state.admin,
          }))
        );
        return <div data-testid="c-member">{String(authenticated)}</div>;
      };

      // 5. NotificationContext slice: { authenticated, isLeader, admin, isRemembered }
      const NotificationContextConsumer = () => {
        renderCounts.notificationContext++;
        const { authenticated, isLeader, admin, isRemembered } = useAuthStore(
          useShallow((state) => ({
            authenticated: state.authenticated,
            isLeader: state.isLeader,
            admin: state.admin,
            isRemembered: state.isRemembered,
          }))
        );
        return <div data-testid="c-notify">{String(authenticated)}</div>;
      };

      // 6. UserManager slice: { authenticated, expireTime, deleteToken }
      const UserManagerConsumer = () => {
        renderCounts.userManager++;
        const { authenticated, expireTime, deleteToken } = useAuthStore(
          useShallow((state) => ({
            authenticated: state.authenticated,
            expireTime: state.expireTime,
            deleteToken: state.deleteToken,
          }))
        );
        return <div data-testid="c-usermanager">{String(authenticated)}</div>;
      };

      // 7. WeeklyUpdate slice: { authenticated, authInitialized }
      const WeeklyUpdateConsumer = () => {
        renderCounts.weeklyUpdate++;
        const { authenticated, authInitialized } = useAuthStore(
          useShallow((state) => ({
            authenticated: state.authenticated,
            authInitialized: state.authInitialized,
          }))
        );
        return <div data-testid="c-weekly">{String(authenticated)}</div>;
      };

      // Mount all 7 simultaneously
      render(
        <div>
          <ProtectedRouteConsumer />
          <SmallGroupReportConsumer />
          <ResponsiveAppBarConsumer />
          <MemberManagementConsumer />
          <NotificationContextConsumer />
          <UserManagerConsumer />
          <WeeklyUpdateConsumer />
        </div>
      );

      // Baseline: each consumer rendered exactly once
      expect(renderCounts).toEqual({
        protectedRoute: 1,
        smallGroupReport: 1,
        responsiveAppBar: 1,
        memberManagement: 1,
        notificationContext: 1,
        userManager: 1,
        weeklyUpdate: 1,
      });

      // STEP 1: Background token renewal updates expireTime.
      // ONLY UserManager consumes expireTime!
      act(() => {
        useAuthStore.setState({ expireTime: Date.now() + 3600000 });
      });
      expect(renderCounts).toEqual({
        protectedRoute: 1,
        smallGroupReport: 1,
        responsiveAppBar: 1,
        memberManagement: 1,
        notificationContext: 1,
        userManager: 2, // +1 re-render
        weeklyUpdate: 1,
      });

      // STEP 2: Toggle isRemembered.
      // ONLY NotificationContext consumes isRemembered!
      act(() => {
        useAuthStore.setState({ isRemembered: true });
      });
      expect(renderCounts).toEqual({
        protectedRoute: 1,
        smallGroupReport: 1,
        responsiveAppBar: 1,
        memberManagement: 1,
        notificationContext: 2, // +1 re-render
        userManager: 2,
        weeklyUpdate: 1,
      });

      // STEP 3: Elevate user to GardenKeeper (isLeader: true).
      // Consumed by: ProtectedRoute, SmallGroupReport, ResponsiveAppBar, NotificationContext.
      // NOT consumed by: MemberManagement, UserManager, WeeklyUpdate.
      act(() => {
        useAuthStore.setState({ isLeader: true });
      });
      expect(renderCounts).toEqual({
        protectedRoute: 2,       // +1
        smallGroupReport: 2,     // +1
        responsiveAppBar: 2,     // +1
        memberManagement: 1,     // unchanged
        notificationContext: 3,  // +1
        userManager: 2,          // unchanged
        weeklyUpdate: 1,         // unchanged
      });

      // STEP 4: Elevate user to Staff (admin: true).
      // Consumed by: ProtectedRoute, ResponsiveAppBar, MemberManagement, NotificationContext.
      // NOT consumed by: SmallGroupReport, UserManager, WeeklyUpdate.
      act(() => {
        useAuthStore.setState({ admin: true });
      });
      expect(renderCounts).toEqual({
        protectedRoute: 3,       // +1
        smallGroupReport: 2,     // unchanged
        responsiveAppBar: 3,     // +1
        memberManagement: 2,     // +1
        notificationContext: 4,  // +1
        userManager: 2,          // unchanged
        weeklyUpdate: 1,         // unchanged
      });

      // STEP 5: User logs in (authenticated: true).
      // Consumed by: ALL 7 consumers!
      act(() => {
        useAuthStore.setState({ authenticated: true });
      });
      expect(renderCounts).toEqual({
        protectedRoute: 4,       // +1
        smallGroupReport: 3,     // +1
        responsiveAppBar: 4,     // +1
        memberManagement: 3,     // +1
        notificationContext: 5,  // +1
        userManager: 3,          // +1
        weeklyUpdate: 2,         // +1
      });

      // STEP 6: User logs out via deleteToken action.
      // All 7 consumers should re-render to reflect unauthenticated state.
      act(() => {
        useAuthStore.getState().deleteToken();
      });
      expect(renderCounts).toEqual({
        protectedRoute: 5,       // +1
        smallGroupReport: 4,     // +1
        responsiveAppBar: 5,     // +1
        memberManagement: 4,     // +1
        notificationContext: 6,  // +1
        userManager: 4,          // +1
        weeklyUpdate: 3,         // +1
      });
    });
  });

  describe("5. High-Frequency Burst & Stress Testing", () => {
    it("withstands 500 rapid unselected mutations with strictly zero re-renders", () => {
      let unselectedRenderCount = 0;
      let selectedRenderCount = 0;

      const UnselectedConsumer = () => {
        unselectedRenderCount++;
        const { authenticated, admin } = useAuthStore(
          useShallow((s) => ({
            authenticated: s.authenticated,
            admin: s.admin,
          }))
        );
        return <div>{String(authenticated)}</div>;
      };

      const TargetConsumer = () => {
        selectedRenderCount++;
        const { expireTime } = useAuthStore(
          useShallow((s) => ({
            expireTime: s.expireTime,
          }))
        );
        return <div>{String(expireTime)}</div>;
      };

      render(
        <>
          <UnselectedConsumer />
          <TargetConsumer />
        </>
      );

      expect(unselectedRenderCount).toBe(1);
      expect(selectedRenderCount).toBe(1);

      // Burst: 500 rapid updates to expireTime
      act(() => {
        for (let i = 0; i < 500; i++) {
          useAuthStore.setState({ expireTime: 1000 + i });
        }
      });

      // The unselected consumer must NOT have re-rendered even once during the 500 updates!
      expect(unselectedRenderCount).toBe(1);
      // The target consumer re-renders cleanly to final state
      expect(selectedRenderCount).toBeGreaterThan(1);
      expect(useAuthStore.getState().expireTime).toBe(1499);
    });

    it("handles 100 alternating boolean flips with exact state synchrony", () => {
      let renderCount = 0;
      const history = [];

      const FlipConsumer = () => {
        renderCount++;
        const { admin } = useAuthStore(
          useShallow((s) => ({
            admin: s.admin,
          }))
        );
        history.push(admin);
        return <div>{String(admin)}</div>;
      };

      render(<FlipConsumer />);
      expect(renderCount).toBe(1);
      expect(history).toEqual([false]);

      // Flip 50 times (false -> true -> false ...)
      for (let i = 0; i < 50; i++) {
        act(() => {
          useAuthStore.setState((s) => ({ admin: !s.admin }));
        });
      }

      // Exact 1 + 50 renders
      expect(renderCount).toBe(51);
      expect(history.length).toBe(51);
      // Even flips end back at false
      expect(history[50]).toBe(false);
    });
  });

  describe("6. Store Action Reference Stability", () => {
    it("maintains stable action references across state mutations without triggering re-renders", () => {
      let renderCount = 0;
      let storedDeleteToken = null;

      const ActionConsumer = () => {
        renderCount++;
        const { authenticated, deleteToken } = useAuthStore(
          useShallow((s) => ({
            authenticated: s.authenticated,
            deleteToken: s.deleteToken,
          }))
        );
        storedDeleteToken = deleteToken;
        return <div>{String(authenticated)}</div>;
      };

      render(<ActionConsumer />);
      expect(renderCount).toBe(1);
      const initialFn = storedDeleteToken;
      expect(typeof initialFn).toBe("function");

      // Mutate unrelated store state
      act(() => {
        useAuthStore.setState({ expireTime: 999999, isRemembered: true });
      });

      // Action reference is identical, so useShallow does not re-render
      expect(renderCount).toBe(1);
      expect(storedDeleteToken).toBe(initialFn);
    });
  });

  describe("7. Edge Cases & Boundary Conditions", () => {
    it("handles null / undefined / empty store properties gracefully", () => {
      let renderCount = 0;
      let capturedState = null;

      const EdgeConsumer = () => {
        renderCount++;
        const state = useAuthStore(
          useShallow((s) => ({
            userProfile: s.userProfile,
            accessToken: s.accessToken,
            nonExistent: s.nonExistent,
          }))
        );
        capturedState = state;
        return <div>{String(state.userProfile === null)}</div>;
      };

      render(<EdgeConsumer />);
      expect(renderCount).toBe(1);
      expect(capturedState.userProfile).toBeNull();
      expect(capturedState.accessToken).toBeNull();
      expect(capturedState.nonExistent).toBeUndefined();

      // Setting accessToken to undefined
      act(() => {
        useAuthStore.setState({ accessToken: undefined });
      });
      expect(renderCount).toBe(2);
      expect(capturedState.accessToken).toBeUndefined();

      // Setting accessToken to undefined again (identical value)
      act(() => {
        useAuthStore.setState({ accessToken: undefined });
      });
      // Shallow equality detects undefined === undefined; no re-render
      expect(renderCount).toBe(2);
    });

    it("handles no-op store updates (empty object setState) with zero re-renders", () => {
      let renderCount = 0;

      const Consumer = () => {
        renderCount++;
        const state = useAuthStore(
          useShallow((s) => ({
            authenticated: s.authenticated,
            admin: s.admin,
          }))
        );
        return <div>{String(state.authenticated)}</div>;
      };

      render(<Consumer />);
      expect(renderCount).toBe(1);

      // No-op setState
      act(() => {
        useAuthStore.setState({});
      });
      expect(renderCount).toBe(1);

      // Re-assign identical values
      act(() => {
        useAuthStore.setState({ authenticated: false, admin: false });
      });
      expect(renderCount).toBe(1);
    });
  });

  describe("8. Real Component Integration: ProtectedRoute", () => {
    it("renders and re-renders ProtectedRoute appropriately under useShallow", () => {
      act(() => {
        useAuthStore.setState({
          authInitialized: false,
          authenticated: false,
          admin: false,
          isLeader: false,
          expireTime: null,
        });
      });

      render(
        <MemoryRouter>
          <ProtectedRoute requiredRole="admin">
            <div data-testid="protected-content">Staff Dashboard</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      // 1. Initial state: authInitialized is false -> loading spinner
      expect(screen.queryByTestId("protected-content")).toBeNull();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();

      // 2. Unrelated state mutation: expireTime changes
      act(() => {
        useAuthStore.setState({ expireTime: Date.now() + 100000 });
      });
      // ProtectedRoute does NOT consume expireTime, spinner remains
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      expect(screen.queryByTestId("protected-content")).toBeNull();

      // 3. authInitialized becomes true, but authenticated is false -> shows login prompt
      act(() => {
        useAuthStore.setState({ authInitialized: true, authenticated: false });
      });
      expect(screen.queryByRole("progressbar")).toBeNull();
      expect(screen.getByText("로그인이 필요한 서비스입니다")).toBeInTheDocument();

      // 4. Unrelated state mutation: isRemembered changes
      act(() => {
        useAuthStore.setState({ isRemembered: true });
      });
      // Login prompt remains intact
      expect(screen.getByText("로그인이 필요한 서비스입니다")).toBeInTheDocument();

      // 5. User logs in without admin role (authenticated: true, admin: false)
      act(() => {
        useAuthStore.setState({ authenticated: true, admin: false });
      });
      expect(screen.queryByText("로그인이 필요한 서비스입니다")).toBeNull();
      expect(screen.getByText("접근 권한이 없습니다")).toBeInTheDocument();

      // 6. User is promoted to admin (admin: true)
      act(() => {
        useAuthStore.setState({ admin: true });
      });
      expect(screen.queryByText("접근 권한이 없습니다")).toBeNull();
      expect(screen.getByTestId("protected-content")).toBeInTheDocument();

      // 7. Unrelated mutation while viewing protected content: expireTime changes 100 times
      act(() => {
        for (let i = 0; i < 100; i++) {
          useAuthStore.setState({ expireTime: 5000 + i });
        }
      });
      expect(screen.getByTestId("protected-content")).toBeInTheDocument();

      // 8. Sign out: deleteToken()
      act(() => {
        useAuthStore.getState().deleteToken();
      });
      expect(screen.queryByTestId("protected-content")).toBeNull();
      expect(screen.getByText("로그인이 필요한 서비스입니다")).toBeInTheDocument();
    });
  });
});

