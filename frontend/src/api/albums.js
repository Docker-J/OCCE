import axios from "axios";

const extractErrorMessage = (error, fallback = "오류가 발생했습니다.") =>
  error.response?.data?.message ||
  (typeof error.response?.data?.error === "string"
    ? error.response.data.error
    : null) ||
  error.message ||
  fallback;

export const getAlbum = async (id) => {
  const result = await axios.get(`/api/albums/${id}`);

  return result.data;
};

export const getAlbums = async (albums, year) => {
  try {
    const params = {};
    if (year != null) {
      params.year = year;
    }
    if (albums && albums.length > 0) {
      const last = albums.at(-1);
      params.lastVisible = last.ID;
      params.timeStamp = last.Timestamp;
    }
    return await axios.get("/api/albums", { params });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const uploadAlbum = async (form) => {
  try {
    await axios.post("/api/albums", form, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const deleteAlbum = async (id) => {
  try {
    await axios.delete(`/api/albums/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
