/**
 * @file AdminDashboardContexts.jsx
 * @description 교인 계정 관리(MemberManagement) 및 출석 현황 대시보드(AttendanceDashboard)를 위한
 * React 19 Context Providers (state-decouple-implementation, state-context-interface)
 */

import { createContext, use, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useMemberManagement } from "./hooks/useMemberManagement";
import { useAttendanceDashboard } from "./hooks/useAttendanceDashboard";

export const MemberManagementContext = createContext(null);
export const useMemberManagementContext = () => use(MemberManagementContext);

export const MemberManagementProvider = ({ children }) => {
  const { state, actions } = useMemberManagement();
  const { setAvailableGardens } = actions;

  const handleAddAvailableGarden = useCallback(
    (newGarden) => {
      setAvailableGardens((prev) =>
        prev.includes(newGarden) ? prev : [...prev, newGarden].sort()
      );
    },
    [setAvailableGardens]
  );

  const contextValue = useMemo(
    () => ({
      state,
      actions: {
        ...actions,
        handleAddAvailableGarden,
      },
    }),
    [state, actions, handleAddAvailableGarden]
  );

  return (
    <MemberManagementContext value={contextValue}>
      {children}
    </MemberManagementContext>
  );
};

MemberManagementProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AttendanceDashboardContext = createContext(null);
export const useAttendanceDashboardContext = () =>
  use(AttendanceDashboardContext);

export const AttendanceDashboardProvider = ({ children }) => {
  const { state, actions } = useAttendanceDashboard();

  const contextValue = useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions]
  );

  return (
    <AttendanceDashboardContext value={contextValue}>
      {children}
    </AttendanceDashboardContext>
  );
};

AttendanceDashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
