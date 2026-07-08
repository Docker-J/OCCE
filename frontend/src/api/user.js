import axios from "axios";

export const signIn = async (phone, password, success, fail) => {
  try {
    const res = await axios.post(
      "/api/user/sign-in",
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
    const res = await axios.post("/api/user/refresh-sign-in", { refreshToken });

    success(res.data);
  } catch (error) {
    fail();
  }
};

export const signUp = async (name, phone, password, success, fail) => {
  try {
    const res = await axios.post("/api/user/sign-up", {
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
    const res = await axios.get(`/api/user/resend-confirm?phone=${phone}`);

    success();
  } catch (error) {
    fail(error.response?.data?.error);
  }
};

export const signOut = async (success) => {
  try {
    await axios.post("/api/user/sign-out");
  } catch {
  } finally {
    success();
  }
};

export const forgotPassword = async (phone, success, fail) => {
  try {
    const res = await axios.post("/api/user/forgot-password", { phone });
    success(res.data);
  } catch (error) {
    console.log(error);
    fail(error.response?.data?.error);
  }
};

export const confirmForgotPassword = async (phone, confirmCode, password, success, fail) => {
  try {
    const res = await axios.post("/api/user/confirm-forgot-password", {
      phone,
      confirmCode,
      password,
    });
    success(res.data);
  } catch (error) {
    console.log(error);
    fail(error.response?.data?.error);
  }
};
