/**
 * Purges the entire Cloudflare Cache.
 * Requires CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_KEY to be set in the environment variables (c.env).
 * @param {any} env - Hono environment variables
 */
export const purgeCache = async (env) => {
  if (!env.CLOUDFLARE_ZONE_ID || !env.CLOUDFLARE_API_KEY) {
    console.warn("⚠️ CLOUDFLARE_ZONE_ID or CLOUDFLARE_API_KEY is missing. Skipping cache purge.");
    return;
  }

  console.log(`🧹 Triggering Cloudflare Cache Purge (Purge Everything)`);

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.CLOUDFLARE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ purge_everything: true }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ Failed to purge Cloudflare cache:", errText);
    } else {
      console.log("✅ Cloudflare Cache purged successfully.");
    }
  } catch (error) {
    console.error("❌ Network error while purging Cloudflare cache:", error);
  }
};
