import axios from "axios";

export const getPosts = async (posts) => {
  try {
    return await axios.get(
      `/api/meditationon${
        posts.length === 0
          ? ""
          : `?lastVisible=${posts.at(-1).ID}&timeStamp=${
              posts.at(-1).Timestamp
            }`
      }`
    );
  } catch {
    throw new Error();
  }
};

export const getPost = async (id) => {
  try {
    return await axios.get(`/api/meditationon/${id}`);
  } catch {
    throw new Error();
  }
};

export const uploadImages = async (form, date) => {
  try {
    await axios.post("/api/meditationon", form, {
      params: {
        date: date,
      },
    });
  } catch {
    throw new Error();
  }
};
