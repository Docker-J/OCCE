import axios from "axios";
import FormData from "form-data";

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;

export const deleteImages = async (images) => {
  try {
    const deletePromises = images.map((image) => {
      axios.delete(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${image}`,
        {
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
          },
        }
      );
    });

    await Promise.all(deletePromises);
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("file", image.buffer, image.originalname);

    const result = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
      }
    );

    return result.data.result.id;
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadImageController = async (req, res) => {
  const image = req.file;

  try {
    const result = await uploadImage(image);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
