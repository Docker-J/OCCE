import axios from "axios";

export const registerToken = async (token, isRemembered = false) => {
  try {
    await axios.put("/api/notification/register", {
      token: token,
      isRemembered: !!isRemembered,
    });
  } catch (error) {
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data?.error === "string"
        ? error.response.data.error
        : null) ||
      error.message ||
      "오류가 발생했습니다.";
    throw new Error(message);
  }
};

export const unlinkTokenRole = async (token) => {
  try {
    await axios.post("/api/notification/unlink", {
      token: token,
    });
  } catch (error) {
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data?.error === "string"
        ? error.response.data.error
        : null) ||
      error.message ||
      "오류가 발생했습니다.";
    throw new Error(message);
  }
};

export const unregisterToken = async (token) => {
  try {
    await axios.delete("/api/notification/unregister", {
      data: {
        token: token,
      },
    });
  } catch (error) {
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data?.error === "string"
        ? error.response.data.error
        : null) ||
      error.message ||
      "오류가 발생했습니다.";
    throw new Error(message);
  }
};

export const broadcastNotification = async (
  title,
  body,
  pathname,
  targetRole = "all",
  options = {}
) => {
  try {
    const res = await axios.post("/api/notification/broadcast", {
      title,
      body,
      pathname,
      targetRole,
      sendPush: options.sendPush !== false,
      sendSms: !!options.sendSms,
      smsTarget: options.smsTarget || "no_push_only",
    });
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data?.error === "string"
        ? error.response.data.error
        : null) ||
      error.message ||
      "오류가 발생했습니다.";
    throw new Error(message);
  }
};

