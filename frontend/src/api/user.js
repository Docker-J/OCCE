import axios from "axios";

export const signIn = async (phone, password, success, fail) => {
  try {
    const res = await axios.post(
      "/api/user/signIn",
      {},
      {
        auth: {
          username: phone,
          password: password,
        },
      },
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

export const signUp = async (name, phone, password, success, fail) => {
  try {
    const res = await axios.post("/api/user/signUp", {
      phone: phone,
      password: password,
      name: name,
    });

    success(res.data);
  } catch (error) {
    console.log(error.response.data);
    fail(error.response.data?.error);
  }
};

export const confirmSignUp = async (phone, confirmCode, success, fail) => {
  try {
    const res = await axios.post("/api/user/confirm", {
      phone: phone,
      confirmCode: confirmCode,
    });

    success();
  } catch (error) {
    console.log(error);
    fail();
  }
};

export const resendSignUpConfirm = async (phone, success, fail) => {
  try {
    const res = await axios.get(`/api/user/resendConfirm?phone=${phone}`);

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
