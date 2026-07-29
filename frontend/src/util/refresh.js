import { getCookieToken } from "../storage/Cookie";
import useAuthStore from "../store/useAuthStore";
import { axios } from "axios";

const refresh = async () => {
  const setToken = useAuthStore.getState().setToken;
  const refreshToken = getCookieToken();

  if (refreshToken) {
    //Get Access Token using Refresh Token
    const res = await axios.get("/api/user/refreshAccessToken", {
      params: { refreshToken: refreshToken },
    });

    const data = {
      accessToken: res.data.getAccessToken().getJwtToken(),
      groups: res.data.getAccessToken().payload["cognito:groups"],
    };

    setToken(data);
  }
};

export { refresh };
