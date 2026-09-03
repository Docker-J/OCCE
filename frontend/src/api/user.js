import axios from "axios";

export const signIn = async (phone, password, remember, success, fail) => {
  let isRemember = false;
  let successCb = success;
  let failCb = fail;

  if (typeof remember === "function") {
    successCb = remember;
    failCb = success;
    isRemember = false;
  } else {
    isRemember = !!remember;
  }

  try {
    const res = await axios.post(
      "/api/user/sign-in",
      { remember: isRemember },
      {
        auth: {
          username: phone,
          password: password,
        },
      },
    );

    if (successCb) successCb(res.data);
  } catch (error) {
    console.log(error);
    if (failCb) failCb();
  }
};

export const refreshTokenSignIn = async (arg1, arg2, arg3) => {
  let success, fail, refreshToken;
  if (typeof arg1 === "function") {
    // New signature: refreshTokenSignIn(success, fail)
    success = arg1;
    fail = arg2;
  } else {
    // Backward-compatible signature: refreshTokenSignIn(refreshToken, success, fail)
    refreshToken = arg1;
    success = arg2;
    fail = arg3;
  }

  try {
    const res = await axios.post(
      "/api/user/refresh-sign-in",
      refreshToken ? { refreshToken } : {}
    );

    if (success) success(res.data);
  } catch (error) {
    if (fail) fail(error);
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
