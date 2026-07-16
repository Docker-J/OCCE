export const deleteImages = async (env, images) => {
  try {
    const CLOUDFLARE_ACCOUNT_ID = env.CLOUDFLARE_ACCOUNT_ID;
    const CLOUDFLARE_API_KEY = env.CLOUDFLARE_API_KEY;

    const deletePromises = images.map(async (image) => {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${image}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
          },
        }
      );
      if (!res.ok) {
        const errText = await res.text();
        console.error(`Failed to delete Cloudflare image ${image}:`, errText);
      }
    });

    await Promise.all(deletePromises);
  } catch (error) {
    throw new Error(error.message || error);
  }
};

export const uploadImage = async (env, file) => {
  try {
    const CLOUDFLARE_ACCOUNT_ID = env.CLOUDFLARE_ACCOUNT_ID;
    const CLOUDFLARE_API_KEY = env.CLOUDFLARE_API_KEY;

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    const formData = new FormData();
    formData.append("file", blob, file.name);

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Cloudflare Images upload failed: ${errText}`);
    }

    const result = await res.json();
    return result.result.id;
  } catch (error) {
    throw new Error(error.message || error);
  }
};

export const uploadImageController = async (c) => {
  try {
    const formData = await c.req.formData();
    const image = formData.get("image");

    if (!image) {
      return c.text("No image file provided", 400);
    }

    const result = await uploadImage(c.env, image);
    return c.text(result);
  } catch (error) {
    console.error("Image upload controller error:", error);
    return c.body(null, 500);
  }
};
