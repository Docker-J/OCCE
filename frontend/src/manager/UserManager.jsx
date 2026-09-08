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
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("remember");
  }, [deleteToken]);

  useEffect(() => {
    const legacyToken =
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken");

    refreshTokenSignIn(
      (result) => {
        signInSuccess(result);
        // Clear legacy storage after successful migration to cookie
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("refreshToken");
        localStorage.removeItem("remember");
      },
      () => {
        signInfail();
      },
      legacyToken
    );
  }, [signInSuccess, signInfail]);
});

export default UserManager;
