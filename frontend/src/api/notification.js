import axios from "axios";

export const registerToken = async (token) => {
  try {
    await axios.get("/api/notification/fcmToken", {
      token: token,
    });
  } catch {
    throw new Error();
  }
};
