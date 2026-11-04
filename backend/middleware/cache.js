import { cache } from "hono/cache";

/**
 * Centralized HTTP Cache Middleware for Cloudflare Workers & Hono.
 *
 * @param {Object} options
 * @param {string} [options.cacheName="occe-api"] - Cloudflare Cache API namespace name
 * @param {number} [options.sMaxAge=604800] - Shared cache max-age (s-maxage) in seconds (default: 7 days)
 * @param {number} [options.maxAge=0] - Browser cache max-age in seconds (default: 0)
 * @param {boolean} [options.bypassOnAuth=false] - Bypass cache when Authorization header is present
 * @returns {import("hono").MiddlewareHandler}
 */
export const apiCache = ({
  cacheName = "occe-api",
  sMaxAge = 604800,
  maxAge = 0,
  bypassOnAuth = false,
} = {}) => {
  const cacheMiddleware = cache({
    cacheName,
    cacheControl: `public, s-maxage=${sMaxAge}, max-age=${maxAge}`,
  });

  if (!bypassOnAuth) {
    return cacheMiddleware;
  }

  return async (c, next) => {
    // If Authorization header exists, bypass cache to ensure personalized/fresh data
    if (c.req.header("Authorization")) {
      return next();
    }
    return cacheMiddleware(c, next);
  };
};

export default apiCache;
