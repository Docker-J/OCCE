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

export const uploadImage = async (file) => {
  var blob = dataURLtoBlob(file);
  const form = new FormData();
  form.append("image", blob, "image.jpg");

  const result = await axios.post("/api/images", form, {
    headers: {
      "Content-Type": `multipart/form-data`,
    },
  });

  return result.data;
};
