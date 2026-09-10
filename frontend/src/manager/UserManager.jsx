import { memo, useCallback, useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { refreshTokenSignIn } from "../api/user";

const UserManager = memo(() => {
  const setToken = useAuthStore((state) => state.setToken);
  const deleteToken = useAuthStore((state) => state.deleteToken);

  const signInSuccess = useCallback(
    (result) => {
      const data = {
        accessToken: result.accessToken,
        idToken: result.idToken,
        groups: [result.group],
        remember: result.remember ?? false,
      };

      setToken(data);
    },
    [setToken]
  );

  const signInfail = useCallback(() => {
    deleteToken();
    try {
      sessionStorage.removeItem("refreshToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("remember");
      localStorage.removeItem("hasSession");
    } catch {}
  }, [deleteToken]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      signInfail();
    }, 3000);

    const legacyToken =
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken");

    refreshTokenSignIn(
      (result) => {
        clearTimeout(timeoutId);
        signInSuccess(result);
        // Clear legacy storage after successful migration to cookie
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("refreshToken");
        localStorage.removeItem("remember");
      },
      () => {
        clearTimeout(timeoutId);
        signInfail();
      },
      legacyToken
    );

    return () => clearTimeout(timeoutId);
  }, [signInSuccess, signInfail]);
});

export default UserManager;
