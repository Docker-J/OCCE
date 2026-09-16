import axios from "axios";

export const registerToken = async (token, isRemembered = false) => {
  try {
    await axios.put("/api/notification/register", {
      token: token,
      isRemembered: !!isRemembered,
    });
  } catch {
    throw new Error();
  }
};

export const unlinkTokenRole = async (token) => {
  try {
    await axios.post("/api/notification/unlink", {
      token: token,
    });
  } catch {
    throw new Error();
  }
};

export const unregisterToken = async (token) => {
  try {
    await axios.delete("/api/notification/unregister", {
      data: {
        token: token,
      },
    });
  } catch {
    throw new Error();
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
  } catch (err) {
    throw err;
  }
};

