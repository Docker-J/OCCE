/**
 * Purges the entire Cloudflare Zone cache (Global Purge).
 * Requires CF_ZONE_ID and CF_API_TOKEN to be set in the environment variables (c.env).
 * @param {any} env - Hono environment variables
 */
export const purgeCache = async (env) => {
  if (!env.CF_ZONE_ID || !env.CF_API_TOKEN) {
    console.warn("⚠️ CF_ZONE_ID or CF_API_TOKEN is missing. Skipping global cache purge.");
    return;
  }

  console.log("🧹 Triggering Cloudflare Global Cache Purge...");

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${env.CF_ZONE_ID}/purge_cache`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ purge_everything: true }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ Failed to purge Cloudflare cache:", errText);
    } else {
      console.log("✅ Cloudflare Global Cache purged successfully.");
    }
  } catch (error) {
    console.error("❌ Network error while purging Cloudflare cache:", error);
  }
};
