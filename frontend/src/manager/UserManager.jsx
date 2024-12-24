import { memo, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshTokenSignIn } from "../api/user";
import { DELETE_TOKEN, SET_TOKEN } from "../store/Auth";

const UserManager = memo(() => {
  const dispatch = useDispatch();

  const signInSuccess = useCallback(
    (result) => {
      const data = {
        accessToken: result.accessToken,
        groups: [result.group],
      };

      dispatch(SET_TOKEN(data));
    },
    [dispatch]
  );

  const signInfail = useCallback(() => {
    dispatch(DELETE_TOKEN());
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("remember");
  }, [dispatch]);

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
