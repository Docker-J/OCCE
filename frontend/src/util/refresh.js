import { getCookieToken } from "../storage/Cookie";
import { useDispatch, useSelector } from "react-redux";
import { axios } from "axios";

const refresh = async () => {
  const user = useSelector((state) => state.authToken);
  const dispatch = useDispatch();
  const refreshToken = getCookieToken();

  if (refreshToken) {
    if (user.accessToken) {
      // Do Nothing
    }
    //Get Access Token using Refresh Token
    const res = await axios.get("/api/user/refreshAccessToken", {
      params: { refreshToken: refreshToken },
    });

    const data = {
      accessToken: result.getAccessToken().getJwtToken(),
      groups: result.getAccessToken().payload["cognito:groups"],
    };

    dispatch(SET_TOKEN(data));
  }
};

export { refresh };
