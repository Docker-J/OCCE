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
        groups: [result.group],
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
    const refreshToken =
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken");
    const remember = localStorage.getItem("remember");

    if (!refreshToken) {
      return;
    }

    if (remember && localStorage.getItem("refreshToken")) {
      refreshTokenSignIn(
        localStorage.getItem("refreshToken"),
        signInSuccess,
        signInfail
      );
    } else if (sessionStorage.getItem("refreshToken")) {
      refreshTokenSignIn(
        sessionStorage.getItem("refreshToken"),
        signInSuccess,
        signInfail
      );
    }
  }, [signInSuccess, signInfail]);
});

export default UserManager;
