import axios from "axios";

export const registerToken = async (token) => {
  try {
    await axios.put("/api/notification/register", {
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

