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
    let cancelled = false;

    const initAuth = async () => {
      const timeoutId = setTimeout(() => {
        if (!cancelled) signInfail();
      }, 3000);

      const legacyToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");

      try {
        const result = await refreshTokenSignIn(legacyToken);
        clearTimeout(timeoutId);
        if (cancelled) return;
        signInSuccess(result);
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("refreshToken");
        localStorage.removeItem("remember");
      } catch {
        clearTimeout(timeoutId);
        if (cancelled) return;
        signInfail();
      }
    };

    initAuth();
    return () => {
      cancelled = true;
    };
  }, []);
};

export default UserManager;
