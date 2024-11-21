import axios from "axios";
import { uploadImage } from "./images";

export const getColumn = async (id) => {
  const result = await axios.get(`/api/columns/column/${id}`);

  return result.data;
};

export const postColumn = async (id, title, body, selectedDate) => {
  const regex = /(<img[^>]+src=")([^">]+)"/g;
  const matches = Array.from(body.matchAll(regex));

  const uploadPromises = matches.map(async (match) => {
    // Collect promises
    const src = match[2];
    if (!src.startsWith("https://")) {
      return uploadImage(src); // Return the promise directly
    } else {
      return src.split("/").at(-2); // Return existing ID immediately
    }
  });

  const imageIDs = await Promise.all(uploadPromises); // Wait for all uploads

  const replacements = matches.map((match, index) => {
    const imageID = imageIDs[index];
    const replacement = `https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${imageID}/Announcements`;
    return { original: match[0], replacement: `${match[1]}${replacement}"` };
  });

  let modifiedBody = body;

  for (const { original, replacement } of replacements) {
    modifiedBody = modifiedBody.replace(original, replacement);
  }

  try {
    await axios.put(id ? `/api/columns/column/${id}` : "/api/columns/column", {
      title: title,
      body: modifiedBody,
      images: imageIDs,
      date: selectedDate,
    });
  } catch {
    throw new Error();
  }
};

export const deleteColumn = async (id) => {
  try {
    await axios.delete(`/api/columns/column/${id}`);
  } catch {
    throw new Error();
  }
};
