/**
 * Utility for handling stale chunk errors after new deployments.
 * When a new deployment occurs, older JS chunk hashes no longer exist on the server,
 * causing dynamic imports to fail with 404 or HTML syntax errors.
 */

const RELOAD_KEY = "occe_chunk_reload_timestamp";
const RELOAD_COOLDOWN_MS = 10000; // 10 seconds cooldown to prevent infinite reload loop

/**
 * Checks if the error is caused by a chunk load failure or HTML fallback syntax error.
 */
export const isChunkLoadError = (error) => {
  if (!error) return false;
  const message = String(error?.message || error || "");
  const name = String(error?.name || "");

  return (
    name === "ChunkLoadError" ||
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Importing a module script failed") ||
    message.includes("error loading dynamically imported module") ||
    message.includes("Unexpected token '<'") ||
    message.includes("is not a valid JavaScript MIME type") ||
    message.includes("Loading chunk") ||
    message.includes("error loading module")
  );
};

/**
 * Attempts to reload the page cleanly.
 * Returns true if reload was initiated, false if currently in cooldown.
 */
export const handleChunkReload = () => {
  try {
    const lastReload = sessionStorage.getItem(RELOAD_KEY);
    const now = Date.now();

    if (!lastReload || now - parseInt(lastReload, 10) > RELOAD_COOLDOWN_MS) {
      sessionStorage.setItem(RELOAD_KEY, now.toString());
      window.location.reload();
      return true;
    }
  } catch {
    window.location.reload();
    return true;
  }
  return false;
};

/**
 * Wraps a React Router lazy loader with automatic chunk reload.
 * If a chunk error occurs, it reloads the page and returns a pending Promise
 * so no error screen flashes before the reload completes.
 */
export const lazyRetry = (fn) => {
  return async () => {
    try {
      return await fn();
    } catch (error) {
      if (isChunkLoadError(error)) {
        const reloaded = handleChunkReload();
        if (reloaded) {
          // Hold the promise open so React Router doesn't flash the ErrorBoundary
          return new Promise(() => {});
        }
      }
      throw error;
    }
  };
};
