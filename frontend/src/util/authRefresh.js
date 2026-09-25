/**
 * @file authRefresh.js
 * @description Centralized singleton token refresh service for OCCE.
 * Prevents race conditions during concurrent 401 responses and provides
 * both proactive and reactive token renewal.
 */

import useAuthStore from "../store/useAuthStore";
import { refreshTokenSignIn } from "../api/user";

let refreshPromise = null;

/**
 * Singleton token refresh function.
 * Ensures only one /api/user/refresh-sign-in call is in-flight at any given time.
 * Automatically synchronizes useAuthStore upon success, and purges stale session upon rejection.
 *
 * @param {string|null} [fallbackRefreshToken=null] - Optional legacy token from localStorage
 * @returns {Promise<{ accessToken: string, idToken: string, group: string, remember: boolean }>}
 */
export const performTokenRefresh = async (fallbackRefreshToken = null) => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const result = await refreshTokenSignIn(fallbackRefreshToken);
      const data = {
        accessToken: result.accessToken,
        idToken: result.idToken,
        groups: [result.group],
        remember: result.remember ?? false,
      };
      useAuthStore.getState().setToken(data);
      return result;
    } catch (error) {
      const status = error.response?.status;
      // Only tear down session if backend rejected the refresh token (400, 401, 403)
      // Avoid logging out users on temporary network disconnects or 5xx server issues
      if (status === 400 || status === 401 || status === 403) {
        useAuthStore.getState().deleteToken();
        try {
          sessionStorage.removeItem("refreshToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("remember");
          localStorage.removeItem("hasSession");
        } catch {}
      }
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
