import axios from "axios";

export const signIn = async (email, password, success, fail) => {
  try {
    const res = await axios.post(
      "/api/user/signIn",
      {},
      {
        auth: {
          username: email,
          password: password,
        },
      }
    );

    success(res.data);
  } catch (error) {
    console.log(error);
    fail();
  }
};

export const refreshTokenSignIn = async (refreshToken, success) => {
  try {
    const res = await axios.post(`/api/user/refreshSignIn/${refreshToken}`);

    success(res.data);
  } catch (error) {}
};

export const signOut = async (accessToken, success) => {
  try {
    await axios.post(`/api/user/signout/${accessToken}`);

    success();
  } catch (error) {}
};
