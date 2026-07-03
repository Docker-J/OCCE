---
name: cloudflare
description: Guidelines and instructions for building, running, and deploying serverless applications on Cloudflare Workers, Pages, D1, R2, and KV using Wrangler.
---

# Cloudflare Serverless Development Guidelines

This skill provides best practices, command references, and architectural instructions for developing web apps and APIs on the Cloudflare developer platform.

---

## 1. Wrangler Command Reference

### Local Development
Run the worker locally in emulation mode (using Miniflare under the hood):
```bash
npx wrangler dev
```

### Deployment
Deploy the worker to the production environment:
```bash
npx wrangler deploy
```

### Database (D1) Management
- **Execute SQL locally**:
  ```bash
  npx wrangler d1 execute <db-binding-name> --local --file=<path-to-sql-file>
  ```
- **Execute SQL on production**:
  ```bash
  npx wrangler d1 execute <db-binding-name> --remote --file=<path-to-sql-file>
  ```

### Secret Management
Secrets are encrypted environment variables. Do not store credentials in `wrangler.json`.
- **Set production secret**:
  ```bash
  npx wrangler secret put SECRET_NAME
  ```

---

## 2. Resource Bindings Best Practices

### D1 Database
Bind D1 in `wrangler.json`:
```json
"d1_databases": [
  {
    "binding": "DB",
    "database_id": "your-d1-database-id"
  }
]
```
Access natively inside handlers:
```javascript
const { results } = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).all();
```

### R2 Storage
Bind R2 bucket in `wrangler.json`:
```json
"r2_buckets": [
  {
    "binding": "MY_BUCKET",
    "bucket_name": "production-bucket-name"
  }
]
```
Access natively:
- **Get file**: `const obj = await env.MY_BUCKET.get(key);`
- **Put file**: `await env.MY_BUCKET.put(key, data, { httpMetadata: { contentType: "application/pdf" } });`
- **Delete file**: `await env.MY_BUCKET.delete(key);`
- **List files**: `const listResult = await env.MY_BUCKET.list({ prefix, delimiter });`

---

## 3. Serverless Environment Constraints

1. **Statefulness**: Do not store long-lived state in global variables. Worker isolates are spun up and recycled frequently. Use D1, R2, or KV for state.
2. **Standard Web APIs**: Use standard Web APIs (`fetch`, `Request`, `Response`, `Headers`, `ReadableStream`, `crypto.randomUUID()`) rather than Node.js specific libraries.
3. **No File System**: Workers do not have access to the local host's file system at runtime. Load files by importing them statically (so the bundler packages them as JSON/text modules) or fetch them from R2/KV.
