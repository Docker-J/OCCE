import axios from "axios";

export const signIn = async (phone, password, remember = false, success, fail) => {
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
    return res.data;
  } catch (error) {
    if (failCb) failCb(error);
    throw error;
  }
};

export const refreshTokenSignIn = async (arg1, arg2, arg3) => {
  let success, fail, refreshToken;
  if (typeof arg1 === "function") {
    // Signature: refreshTokenSignIn(success, fail, refreshToken)
    success = arg1;
    fail = arg2;
    refreshToken = arg3;
  } else {
    // Signature: refreshTokenSignIn(refreshToken, success, fail)
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
    return res.data;
  } catch (error) {
    if (fail) fail(error);
    throw error;
  }
};

export const signUp = async (name, phone, password, success, fail) => {
  try {
    const res = await axios.post("/api/user/sign-up", {
      phone,
      password,
      name,
    });

    if (success) success(res.data);
    return res.data;
  } catch (error) {
    const errorDetail = error.response?.data?.error || error.message;
    if (fail) fail(errorDetail);
    throw new Error(errorDetail);
  }
};

export const confirmSignUp = async (phone, confirmCode, success, fail) => {
  try {
    const res = await axios.post("/api/user/confirm", {
      phone,
      confirmCode,
    });

    if (success) success(res.data);
    return res.data;
  } catch (error) {
    const errorDetail = error.response?.data?.error || error.message;
    if (fail) fail(errorDetail);
    throw new Error(errorDetail);
  }
};

export const resendSignUpConfirm = async (phone, success, fail) => {
  try {
    const res = await axios.get(`/api/user/resend-confirm?phone=${phone}`);

    if (success) success(res.data);
    return res.data;
  } catch (error) {
    const errorDetail = error.response?.data?.error || error.message;
    if (fail) fail(errorDetail);
    throw new Error(errorDetail);
  }
};

export const signOut = async (success) => {
  try {
    const res = await axios.post("/api/user/sign-out");
    if (success) success(res.data);
    return res.data;
  } catch (error) {
    if (success) success();
    return null;
  }
};

export const forgotPassword = async (phone, success, fail) => {
  try {
    const res = await axios.post("/api/user/forgot-password", { phone });
    if (success) success(res.data);
    return res.data;
  } catch (error) {
    const errorDetail = error.response?.data?.error || error.message;
    if (fail) fail(errorDetail);
    throw new Error(errorDetail);
  }
};

export const confirmForgotPassword = async (
  phone,
  confirmCode,
  password,
  success,
  fail
) => {
  try {
    const res = await axios.post("/api/user/confirm-forgot-password", {
      phone,
      confirmCode,
      password,
    });
    if (success) success(res.data);
    return res.data;
  } catch (error) {
    const errorDetail = error.response?.data?.error || error.message;
    if (fail) fail(errorDetail);
    throw new Error(errorDetail);
  }
};
