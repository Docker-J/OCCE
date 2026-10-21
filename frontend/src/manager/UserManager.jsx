/**
 * @file UserManager.jsx
 * @description Manages session restoration, proactive token renewal, and focus-based checks.
 * - Restores user session on initial application load.
 * - Proactively renews access token before expiration (at 5-minute threshold).
 * - Immediately checks and renews token when the user returns to the browser tab.
 */

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useAuthStore from "../store/useAuthStore";
import { performTokenRefresh } from "../util/authRefresh";

const UserManager = () => {
  const { authenticated, expireTime, deleteToken } = useAuthStore(
    useShallow((state) => ({
      authenticated: state.authenticated,
      expireTime: state.expireTime,
      deleteToken: state.deleteToken,
    }))
  );

  const signInfail = () => {
    deleteToken();
    try {
      sessionStorage.removeItem("refreshToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("remember");
      localStorage.removeItem("hasSession");
    } catch {}
  };

  // 1. Initial authentication restoration on app launch
  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      const legacyToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");

      try {
        await performTokenRefresh(legacyToken);
        if (cancelled) return;
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("refreshToken");
        localStorage.removeItem("remember");
      } catch {
        if (cancelled) return;
        signInfail();
      }
    };

    initAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Proactive periodic refresh and tab visibility/focus listener
  useEffect(() => {
    if (!authenticated || !expireTime) return;

    const checkAndRenew = async () => {
      const { authenticated: isAuth, expireTime: exp } = useAuthStore.getState();
      if (!isAuth || !exp) return;

      const remainingMs = exp - Date.now();
      // If token expires in less than 5 minutes (or expired while computer was in sleep mode)
      if (remainingMs <= 5 * 60 * 1000) {
        try {
          await performTokenRefresh();
        } catch (e) {
          console.warn("[UserManager] Proactive token refresh failed:", e);
        }
      }
    };

    // Check every 60 seconds
    const intervalId = setInterval(checkAndRenew, 60 * 1000);

    // Also check immediately when the user returns to the browser tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAndRenew();
      }
    };
    const handleFocus = () => {
      checkAndRenew();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [authenticated, expireTime]);

  return null;
};

export default UserManager;
