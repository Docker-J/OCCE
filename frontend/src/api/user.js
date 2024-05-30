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

export const refreshTokenSignIn = async (refreshToken, success, fail) => {
  try {
    const res = await axios.post(`/api/user/refreshSignIn/${refreshToken}`);

    success(res.data);
  } catch (error) {
    fail();
  }
};

export const signUp = async (name, email, password, success, fail) => {
  try {
    const res = await axios.post("/api/user/singup");

    success(res.data);
  } catch (error) {
    fail();
  }
};

export const confirmSignUp = async (email, confirmCode, success, fail) => {
  try {
    const res = await axios.post("/api/user/confirm");

    success();
  } catch (error) {
    fail();
  }
};

export const resendSignUpConfirm = async (email, success, fail) => {
  try {
    const res = await axios.get("/api/user/resendConfirm");

    success();
  } catch {
    fail();
  }
};

export const signOut = async (success) => {
  try {
    await axios.post("/api/user/signout");
  } catch {
  } finally {
    success();
  }
};
