import axios from "axios";

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;
// Fallback to the known DB ID if the env variable isn't set
const CLOUDFLARE_DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID;

const URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_DATABASE_ID}/query`;

/**
 * Execute a query against the Cloudflare D1 database.
 * @param {string} sql - The SQL statement.
 * @param {Array} params - Optional parameters for the query.
 * @returns {Promise<any>}
 */
export const executeD1Query = async (sql, params = []) => {
  const data = { sql };
  if (params && params.length > 0) {
    data.params = params;
  }

  const response = await axios.post(URL, data, {
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
