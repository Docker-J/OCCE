import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

dotenv.config();

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_D1_DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID;
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_D1_DATABASE_ID || !CLOUDFLARE_API_KEY) {
  console.error("❌ Missing Cloudflare D1 environment variables in .env");
  process.exit(1);
}

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error("❌ Missing AWS credentials in .env");
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

async function runMigration() {
  console.log("🚀 Starting DynamoDB (Albums, MeditationON) to Cloudflare D1 migration...\n");

  // 1. Prepare D1 table schemas
  console.log("1️⃣ Setting up D1 Albums and MeditationON schemas...");
  await executeD1(`
    CREATE TABLE IF NOT EXISTS Albums (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      cover TEXT NOT NULL,
      images TEXT NOT NULL,
      year INTEGER NOT NULL
    );
  `);
  await executeD1("CREATE INDEX IF NOT EXISTS idx_albums_year_timestamp ON Albums(year, timestamp DESC, id DESC);");
  await executeD1("CREATE INDEX IF NOT EXISTS idx_albums_timestamp ON Albums(timestamp DESC, id DESC);");

  await executeD1(`
    CREATE TABLE IF NOT EXISTS MeditationON (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      cover TEXT NOT NULL,
      images TEXT NOT NULL
    );
  `);
  await executeD1("CREATE INDEX IF NOT EXISTS idx_meditationon_timestamp ON MeditationON(timestamp DESC, id DESC);");
  console.log("   ✅ D1 schemas and indexes verified.\n");

  // 2. Connect to DynamoDB
  const dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-west-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const docClient = DynamoDBDocumentClient.from(dynamoClient);

  // 3. Scan & Migrate Albums
  console.log("2️⃣ Scanning and migrating Albums table...");
  let albumItems = [];
  let albumLastKey = undefined;
  do {
    const scanRes = await docClient.send(
      new ScanCommand({
        TableName: "Albums",
        ExclusiveStartKey: albumLastKey,
      })
    );
    if (scanRes.Items) {
      albumItems.push(...scanRes.Items);
    }
    albumLastKey = scanRes.LastEvaluatedKey;
  } while (albumLastKey);

  console.log(`   Found ${albumItems.length} albums in DynamoDB.`);
  let albumsMigrated = 0;
  for (const item of albumItems) {
    const id = item.ID;
    const title = item.Title || "";
    const timestamp = item.Timestamp;
    const cover = item.Cover || "";
    const images = typeof item.Images === "string" ? item.Images : JSON.stringify(item.Images || {});
    const year = item.year || new Date(timestamp).getFullYear();

    await executeD1(
      "INSERT OR REPLACE INTO Albums (id, title, timestamp, cover, images, year) VALUES (?, ?, ?, ?, ?, ?);",
      [id, title, timestamp, cover, images, year]
    );
    albumsMigrated++;
  }
  console.log(`   ✅ Migrated ${albumsMigrated} albums into D1.\n`);

  // 4. Scan & Migrate MeditationON
  console.log("3️⃣ Scanning and migrating MeditationON table...");
  let meditationItems = [];
  let meditationLastKey = undefined;
  do {
    const scanRes = await docClient.send(
      new ScanCommand({
        TableName: "MeditationON",
        ExclusiveStartKey: meditationLastKey,
      })
    );
    if (scanRes.Items) {
      meditationItems.push(...scanRes.Items);
    }
    meditationLastKey = scanRes.LastEvaluatedKey;
  } while (meditationLastKey);

  console.log(`   Found ${meditationItems.length} MeditationON records in DynamoDB.`);
  let meditationMigrated = 0;
  for (const item of meditationItems) {
    const id = item.ID;
    const timestamp = item.Timestamp;
    const cover = item.Cover || "";
    const images = typeof item.Images === "string" ? item.Images : JSON.stringify(item.Images || {});

    await executeD1(
      "INSERT OR REPLACE INTO MeditationON (id, timestamp, cover, images) VALUES (?, ?, ?, ?);",
      [id, timestamp, cover, images]
    );
    meditationMigrated++;
    if (meditationMigrated % 25 === 0 || meditationMigrated === meditationItems.length) {
      console.log(`   Progress: ${meditationMigrated}/${meditationItems.length} MeditationON records migrated`);
    }
  }
  console.log(`   ✅ Migrated ${meditationMigrated} MeditationON records into D1.\n`);

  // 5. Verification
  console.log("4️⃣ Verifying record counts in Cloudflare D1...");
  const albumCountRes = await executeD1("SELECT count(*) as count FROM Albums;");
  const meditationCountRes = await executeD1("SELECT count(*) as count FROM MeditationON;");

  console.log(`\n🎉 Migration Complete!`);
  console.log(`   - D1 Albums count: ${albumCountRes[0]?.count || 0}`);
  console.log(`   - D1 MeditationON count: ${meditationCountRes[0]?.count || 0}`);
}

runMigration().catch((err) => {
  console.error("❌ Migration failed with error:", err);
  process.exit(1);
});
