import axios from "axios";

export const getAlbum = async (id) => {
  const result = await axios.get(`/api/albums/${id}`);

  return result.data;
};

export const getAlbums = async (albums, year) => {
  try {
    return await axios.get(
      `/api/albums${
        albums.length === 0
          ? `?year=${year}`
          : `?year=${year}&lastVisible=${albums.at(-1).ID}&timeStamp=${
              albums.at(-1).Timestamp
            }`
      }`
    );
  } catch {
    throw new Error();
  }
};

export const uploadAlbum = async (form) => {
  try {
    await axios.post("/api/albums", form, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });
  } catch {
    throw new Error();
  }
};

export const deleteAlbum = async (id) => {
  try {
    await axios.delete(`/api/albums/${id}`);
  } catch {
    throw new Error();
  }
};
