/**
 * Purges specific Cloudflare Cache URLs (files) to bypass prefix restrictions on Free/Pro tiers.
 * Requires CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_KEY to be set in the environment variables (c.env).
 * @param {any} env - Hono environment variables
 * @param {string[]} baseUrls - Array of base URLs to purge (e.g., ["https://oncce.ca/api/announcements"])
 */
export const purgeCache = async (env, baseUrls) => {
  if (!env.CLOUDFLARE_ZONE_ID || !env.CLOUDFLARE_API_KEY) {
    console.warn("⚠️ CLOUDFLARE_ZONE_ID or CLOUDFLARE_API_KEY is missing. Skipping cache purge.");
    return;
  }

  if (!baseUrls || baseUrls.length === 0) {
    return;
  }

  // Generate exact URLs to purge, including common pagination parameters
  const files = [];
  for (const url of baseUrls) {
    files.push(url); // e.g. /api/announcements
    for (let i = 1; i <= 10; i++) {
      files.push(`${url}?page=${i}`);
    }
  }

  console.log(`🧹 Triggering Cloudflare Cache Purge for exactly ${files.length} URLs (files).`);

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.CLOUDFLARE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files }),
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
