import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshTokenSignIn } from "../api/user";
import { SET_TOKEN } from "../store/Auth";

const UserManager = () => {
  const dispatch = useDispatch();

  const signInSuccess = (result) => {
    const data = {
      accessToken: result.accessToken,
      groups: [result.group],
    };

    console.log(data);
    dispatch(SET_TOKEN(data));
  };

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    const remember = localStorage.getItem("remember");

    if (!refreshToken) {
      return;
    }

    if (!remember && refreshToken) {
      refreshTokenSignIn(refreshToken, signInSuccess);
    }
  });
};

export default UserManager;
