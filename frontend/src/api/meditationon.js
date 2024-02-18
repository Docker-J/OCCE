import axios from "axios";

export const getPosts = async (posts) => {
  try {
    return await axios.get(
      `/api/MeditationON/getPosts${
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

export const uploadImages = async (form) => {
  try {
    await axios.post("/api/meditationON/uploadImage", form, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });
  } catch {
    throw new Error();
  }
};
