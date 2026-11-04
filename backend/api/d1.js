/**
 * Execute a query against the Cloudflare D1 database natively.
 * @param {any} db - The D1 database binding (env.DB).
 * @param {string} sql - The SQL statement.
 * @param {Array} params - Optional parameters for the query.
 * @returns {Promise<any>}
 */
export const executeD1Query = async (db, sql, params = []) => {
  if (!db || typeof db.prepare !== "function") {
    throw new Error("D1 database binding 'DB' is not available. Please verify D1 config in wrangler.json.");
  }

  try {
    const stmt = db.prepare(sql);
    const bound = params && params.length > 0 ? stmt.bind(...params) : stmt;
    const res = await bound.all();

    // Preserve the response structure of the Cloudflare D1 HTTP API
    // so controllers don't need any changes to parse D1 outputs.
    return {
      result: [
        {
          results: res.results || [],
          success: res.success,
          meta: res.meta,
        },
      ],
    };
  } catch (error) {
    console.error("D1 Query execution error:", error);
    throw error;
  }
};

/**
 * Execute multiple queries in a single atomic batch transaction against Cloudflare D1.
 * Sends all prepared statements in one round-trip to the D1 SQLite engine.
 *
 * @param {any} db - The D1 database binding (env.DB).
 * @param {Array<{ sql: string, params?: Array<any> }>} statements - List of queries to execute in batch.
 * @returns {Promise<Array<any>>} Array of query results matching executeD1Query structure.
 */
export const executeD1Batch = async (db, statements = []) => {
  if (!db || typeof db.batch !== "function") {
    throw new Error("D1 database binding 'DB' is not available. Please verify D1 config in wrangler.json.");
  }

  if (!statements || statements.length === 0) {
    return [];
  }

  try {
    const preparedStatements = statements.map(({ sql, params = [] }) => {
      const stmt = db.prepare(sql);
      return params && params.length > 0 ? stmt.bind(...params) : stmt;
    });

    const batchResults = await db.batch(preparedStatements);

    // Preserve the response structure of executeD1Query for full backward compatibility
    return batchResults.map((res) => ({
      result: [
        {
          results: res.results || [],
          success: res.success,
          meta: res.meta,
        },
      ],
    }));
  } catch (error) {
    console.error("D1 Batch execution error:", error);
    throw error;
  }
};
