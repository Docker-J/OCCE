/**
 * Purges specific Cloudflare Cache prefixes.
 * Requires CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_KEY to be set in the environment variables (c.env).
 * @param {any} env - Hono environment variables
 * @param {string[]} prefixes - Array of prefixes to purge (e.g., ["oncce.ca/api/announcements"])
 */
export const purgeCache = async (env, prefixes) => {
  if (!env.CLOUDFLARE_ZONE_ID || !env.CLOUDFLARE_API_KEY) {
    console.warn("⚠️ CLOUDFLARE_ZONE_ID or CLOUDFLARE_API_KEY is missing. Skipping cache purge.");
    return;
  }

  if (!prefixes || prefixes.length === 0) {
    return;
  }

  console.log(`🧹 Triggering Cloudflare Cache Purge for prefixes: ${prefixes.join(", ")}`);

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.CLOUDFLARE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prefixes }),
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
