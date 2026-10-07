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
  console.log("🚀 Starting FCM token migration from DynamoDB to Cloudflare D1...\n");

  // 1. Prepare D1 table schema
  console.log("1️⃣ Checking and setting up D1 fcm_tokens schema...");
  const tableInfo = await executeD1("PRAGMA table_info(fcm_tokens);");
  const columnNames = tableInfo.map((c) => c.name);

  // If table has old schema without 'roles', recreate it
  if (!columnNames.includes("roles")) {
    console.log("   Re-creating fcm_tokens table with correct schema...");
    await executeD1("DROP TABLE IF EXISTS fcm_tokens;");
    await executeD1(`
      CREATE TABLE fcm_tokens (
        token TEXT PRIMARY KEY,
        sub TEXT,
        roles TEXT DEFAULT '[]',
        expires_at INTEGER NOT NULL
      );
    `);
    await executeD1("CREATE INDEX IF NOT EXISTS idx_fcm_tokens_sub ON fcm_tokens(sub);");
    await executeD1("CREATE INDEX IF NOT EXISTS idx_fcm_tokens_expires ON fcm_tokens(expires_at);");
  }
  console.log("   ✅ D1 fcm_tokens table is ready.\n");

  // 2. Scan all tokens from DynamoDB
  console.log("2️⃣ Scanning tokens from DynamoDB FCMToken table...");
  const dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-west-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const docClient = DynamoDBDocumentClient.from(dynamoClient);

  let dynamoItems = [];
  let lastEvaluatedKey = undefined;

  do {
    const scanRes = await docClient.send(
      new ScanCommand({
        TableName: "FCMToken",
        ExclusiveStartKey: lastEvaluatedKey,
      })
    );
    if (scanRes.Items) {
      dynamoItems.push(...scanRes.Items);
    }
    lastEvaluatedKey = scanRes.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  console.log(`   Found ${dynamoItems.length} total tokens in DynamoDB.`);

  // Filter unexpired tokens (or assign a default 3-month expiration if missing)
  const nowEpoch = Math.floor(Date.now() / 1000);
  const threeMonthsLater = nowEpoch + 90 * 24 * 3600;

  const validItems = dynamoItems.filter((item) => {
    const expiresAt = item.expiresAt || item.expires_at || threeMonthsLater;
    return expiresAt > nowEpoch;
  });

  console.log(`   ${validItems.length} active (non-expired) tokens will be migrated.\n`);

  if (validItems.length === 0) {
    console.log("ℹ️ No active tokens to migrate.");
    return;
  }

  // 3. Insert items into Cloudflare D1 in batches
  console.log("3️⃣ Migrating tokens into Cloudflare D1 fcm_tokens...");
  const batchSize = 25;
  let insertedCount = 0;

  for (let i = 0; i < validItems.length; i += batchSize) {
    const chunk = validItems.slice(i, i + batchSize);
    
    for (const item of chunk) {
      const token = item.token;
      const sub = item.sub || null;
      const roles = Array.isArray(item.roles) ? JSON.stringify(item.roles) : "[]";
      const expiresAt = item.expiresAt || item.expires_at || threeMonthsLater;

      await executeD1(
        "INSERT OR REPLACE INTO fcm_tokens (token, sub, roles, expires_at) VALUES (?, ?, ?, ?);",
        [token, sub, roles, expiresAt]
      );
      insertedCount++;
    }
    console.log(`   Progress: ${insertedCount}/${validItems.length} migrated`);
  }

  // 4. Verify D1 count
  const verifyRes = await executeD1("SELECT count(*) as count FROM fcm_tokens;");
  const d1Count = verifyRes[0]?.count || 0;

  console.log(`\n🎉 Migration Complete!`);
  console.log(`   Total tokens in D1 fcm_tokens: ${d1Count}`);
}

runMigration().catch((err) => {
  console.error("❌ Migration failed with error:", err);
  process.exit(1);
});
