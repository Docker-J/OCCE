import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { refreshTokenSignIn } from "../api/user";

const UserManager = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const deleteToken = useAuthStore((state) => state.deleteToken);

  const signInSuccess = (result) => {
    const data = {
      accessToken: result.accessToken,
      idToken: result.idToken,
      groups: [result.group],
      remember: result.remember ?? false,
    };

    setToken(data);
  };

  const signInfail = () => {
    deleteToken();
    try {
      sessionStorage.removeItem("refreshToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("remember");
      localStorage.removeItem("hasSession");
    } catch {}
  };

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
  }, []);
};

export default UserManager;
