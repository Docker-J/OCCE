import { axios } from "axios";

export const signIn = async (email, password, success) => {
  try {
    const res = await axios.post("/api/user/siginin", {
      email: email,
      password: password,
    });

    success(res);
  } catch (error) {}
};

export const signOut = async (accessToken, success) => {
  try {
    await axios.post("/api/user/signout", {
      accessToken: accessToken,
    });

    success();
  } catch (error) {}
};

export const renewAccessToken = async (refreshToken, success) => {
  try {
    await axios.get("/api/user/signout", {
      refreshToken: refreshToken,
    });

    success();
  } catch (error) {}
};
