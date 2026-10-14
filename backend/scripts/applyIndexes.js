import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_D1_DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID;
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_D1_DATABASE_ID || !CLOUDFLARE_API_KEY) {
  console.error("❌ Missing Cloudflare D1 environment variables in .env");
  process.exit(1);
}

const executeD1 = async (sql, params = []) => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_D1_DATABASE_ID}/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(`D1 Query Error: ${JSON.stringify(data.errors)}`);
  }
  return data.result?.[0]?.results || [];
};

async function applyIndexes() {
  console.log("🚀 Applying D1 indexes for Announcements and Columns...");

  const statements = [
    "CREATE INDEX IF NOT EXISTS idx_announcements_pin_timestamp ON Announcements(pin, timestamp DESC);",
    "CREATE INDEX IF NOT EXISTS idx_announcements_timestamp ON Announcements(timestamp DESC);",
    "CREATE INDEX IF NOT EXISTS idx_columns_timestamp ON Columns(timestamp DESC);"
  ];

  for (const sql of statements) {
    console.log(`Executing: ${sql}`);
    await executeD1(sql);
    console.log("   ✅ Success");
  }

  console.log("\n🔍 Verifying indexes on Announcements:");
  const announcementsIndexes = await executeD1("PRAGMA index_list('Announcements');");
  console.table(announcementsIndexes);

  console.log("\n🔍 Verifying indexes on Columns:");
  const columnsIndexes = await executeD1("PRAGMA index_list('Columns');");
  console.table(columnsIndexes);

  console.log("\n🎉 D1 indexes successfully applied!");
}

applyIndexes().catch((err) => {
  console.error("❌ Index migration failed:", err);
  process.exit(1);
});
