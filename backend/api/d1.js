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
