import fs from "fs";

async function prefetch() {
  console.log("🚀 Starting prefetch on deploy...");

  let host = "oncce.ca";
  try {
    const wranglerPath = fs.existsSync("wrangler.json")
      ? "wrangler.json"
      : "../wrangler.json";
    if (fs.existsSync(wranglerPath)) {
      const wranglerConfig = JSON.parse(fs.readFileSync(wranglerPath, "utf-8"));
      if (wranglerConfig.routes && wranglerConfig.routes.length > 0) {
        host = wranglerConfig.routes[0].pattern || host;
      }
    }
  } catch (e) {
    console.error("Error reading wrangler.json:", e.message);
  }

  const url = `https://${host}`;
  console.log(`Targeting production URL: ${url}`);

  try {
    console.log("Warming recent weekly update date cache...");
    const res1 = await fetch(
      `${url}/api/weekly-update/recent-date?refresh=true`,
    );
    const date = await res1.text();
    console.log(
      `✅ Weekly update cache warmed. Recent date: "${date}" (Status: ${res1.status})`,
    );

    console.log("Warming calendar schedules cache...");
    const res2 = await fetch(`${url}/api/schedules?refresh=true`);
    console.log(`✅ Calendar schedules cache warmed. (Status: ${res2.status})`);


    console.log("🎉 Prefetch complete!");
  } catch (e) {
    console.error("❌ Prefetch failed:", e.message);
  }
}

prefetch().catch(console.error);
