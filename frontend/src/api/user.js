import axios from "axios";

export const signIn = async (phone, password, remember = false) => {
  const res = await axios.post(
    "/api/user/sign-in",
    { remember: !!remember },
    {
      auth: {
        username: phone,
        password: password,
      },
    }
  );
  return res.data;
};

export const refreshTokenSignIn = async (refreshToken) => {
  const res = await axios.post(
    "/api/user/refresh-sign-in",
    refreshToken ? { refreshToken } : {}
  );
  return res.data;
};

export const signUp = async (name, phone, password) => {
  try {
    const res = await axios.post("/api/user/sign-up", {
      phone,
      password,
      name,
    });
    return res.data;
  } catch (error) {
    const errorDetail = error.response?.data?.error || error.message;
    throw new Error(errorDetail);
  }
};

export const confirmSignUp = async (phone, confirmCode, name = "") => {
  try {
    const res = await axios.post("/api/user/confirm", {
      phone,
      confirmCode,
      name,
    });
    return res.data;
  } catch (error) {
    const errorDetail = error.response?.data?.error || error.message;
    throw new Error(errorDetail);
  }
};

export const resendSignUpConfirm = async (phone) => {
  try {
    const res = await axios.get(`/api/user/resend-confirm?phone=${phone}`);
    return res.data;
  } catch (error) {
    const errorDetail = error.response?.data?.error || error.message;
    throw new Error(errorDetail);
  }
};

export const signOut = async () => {
  try {
    const res = await axios.post("/api/user/sign-out");
    return res.data;
  } catch {
    return null;
  }
};

export const forgotPassword = async (phone) => {
  try {
    const res = await axios.post("/api/user/forgot-password", { phone });
    return res.data;
  } catch (error) {
    const errorDetail = error.response?.data?.error || error.message;
    throw new Error(errorDetail);
  }
};

export const confirmForgotPassword = async (
  phone,
  confirmCode,
  password
) => {
  try {
    const res = await axios.post("/api/user/confirm-forgot-password", {
      phone,
      confirmCode,
      password,
    });
    return res.data;
  } catch (error) {
    const errorDetail = error.response?.data?.error || error.message;
    throw new Error(errorDetail);
  }
};

