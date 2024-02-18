import axios from "axios";

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

const uploadImage = async (file) => {
  var blob = dataURLtoBlob(file);
  const form = new FormData();
  form.append("image", blob, "image.jpg");

  const result = await axios.post("/api/Announcements/uploadImage", form, {
    headers: {
      "Content-Type": `multipart/form-data`,
    },
  });

  return result.data;
};

export const postAnnouncement = async (id, title, body) => {
  let modifiedBody = body;
  const regex = /(<img[^>]+src=")([^">]+)"/g;

  let match;
  const images = [];
  while ((match = regex.exec(body)) !== null) {
    const src = match[2];
    if (src.startsWith("https://")) {
      images.push(src.split("/").at(-2));
    } else {
      const imageID = await uploadImage(src);
      images.push(imageID);

      modifiedBody = modifiedBody.replace(
        match[0],
        `${match[1]}https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${imageID}/Announcements"`
      );
    }
  }

  try {
    await axios.put(
      id
        ? "/api/Announcements/editAnnouncement"
        : "/api/Announcements/postAnnouncement",
      {
        id: id ? id : null,
        title: title,
        body: modifiedBody,
        images: images,
      }
    );
  } catch {
    throw new Error();
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    await axios.delete(`/api/Announcements/deleteAnnouncement?id=${id}`);
  } catch {
    throw new Error();
  }
};

export const pinAnnouncement = async (id, pin) => {
  try {
    await axios.put("/api/Announcements/pinAnnouncement", {
      id: id,
      pin: !pin,
    });
  } catch {
    throw new Error();
  }
};
