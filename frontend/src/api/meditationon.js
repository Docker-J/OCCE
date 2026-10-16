import axios from "axios";

const extractErrorMessage = (error, fallback = "오류가 발생했습니다.") =>
  error.response?.data?.message ||
  (typeof error.response?.data?.error === "string"
    ? error.response.data.error
    : null) ||
  error.message ||
  fallback;

export const getPosts = async (posts) => {
  try {
    const params = {};
    if (posts && posts.length > 0) {
      const last = posts.at(-1);
      params.lastVisible = last.ID;
      params.timeStamp = last.Timestamp;
    }
    return await axios.get("/api/meditation-on", { params });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getPost = async (id) => {
  try {
    return await axios.get(`/api/meditation-on/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const uploadImages = async (form, date) => {
  try {
    await axios.post("/api/meditation-on", form, {
      params: {
        date: date,
      },
    });
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Failed to upload images"));
  }
};
