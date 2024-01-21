import axios from "axios";

export const signIn = async (email, password, success, fail) => {
  try {
    const res = await axios.post("/api/User/signIn", {
      email: email,
      password: password,
    });

    success(res.data);
  } catch (error) {
    console.log(error);
    fail();
  }
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
