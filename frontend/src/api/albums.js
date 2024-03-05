import axios from "axios";

export const getAlbums = async (albums, year) => {
  try {
    return await axios.get(
      `/api/albums/getAlbums${
        albums.length === 0
          ? ""
          : `?lastVisible=${albums.at(-1).ID}&timeStamp=${
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
    await axios.post("/api/albums/uploadAlbum", form, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });
  } catch {
    throw new Error();
  }
};
