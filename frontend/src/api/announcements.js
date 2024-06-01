import axios from "axios";
import { uploadImage } from "./images";

export const postAnnouncement = async (id, title, body) => {
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

  const iframeRegex = /<iframe\s+[^>]*>/i;
  const hasVideo = iframeRegex.test(modifiedBody);

  try {
    await axios.put(
      id
        ? `/api/announcements/announcement/${id}`
        : "/api/announcements/announcement",
      {
        title: title,
        body: modifiedBody,
        images: imageIDs,
        // image: imageIDs.length > 0 ? true : false,
        video: hasVideo ? 1 : 0,
      }
    );
  } catch {
    throw new Error();
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    await axios.delete(`/api/announcements/announcement/${id}`);
  } catch {
    throw new Error();
  }
};

export const pinAnnouncement = async (id, pin) => {
  try {
    await axios.put(`/api/announcements/announcement/${id}/pin`, {
      pin: !pin ? 1 : 0,
    });
  } catch {
    throw new Error();
  }
};
