import { CognitoJwtVerifier } from "aws-jwt-verify";

// Cache verifiers per environment configuration
let staffVerifierInstance;
let userVerifierInstance;
let leaderVerifierInstance;

export const getStaffVerifier = (env) => {
  if (!staffVerifierInstance) {
    staffVerifierInstance = CognitoJwtVerifier.create({
      userPoolId: env.AWS_COGNITO_USER_POOL_ID,
      tokenUse: null,
      clientId: env.AWS_COGNITO_CLIENT_ID,
      groups: "Staff",
    });
  }
  return staffVerifierInstance;
};

export const getUserVerifier = (env) => {
  if (!userVerifierInstance) {
    userVerifierInstance = CognitoJwtVerifier.create({
      userPoolId: env.AWS_COGNITO_USER_POOL_ID,
      tokenUse: null,
      clientId: env.AWS_COGNITO_CLIENT_ID,
    });
  }
  return userVerifierInstance;
};

export const getLeaderVerifier = (env) => {
  if (!leaderVerifierInstance) {
    leaderVerifierInstance = CognitoJwtVerifier.create({
      userPoolId: env.AWS_COGNITO_USER_POOL_ID,
      tokenUse: null,
      clientId: env.AWS_COGNITO_CLIENT_ID,
      groups: ["Staff", "GardenKeeper"],
    });
  }
  return leaderVerifierInstance;
};

/**
 * Safely extracts the Bearer token from the Authorization header.
 *
 * @param {import("hono").Context} c
 * @returns {string|null}
 */
const extractBearerToken = (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) return null;

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
    return parts[1];
  }
  return null;
};

/**
 * Higher-order authentication middleware factory.
 * Provides unified Bearer token extraction, role verification, and JSON error responses.
 *
 * @param {Object} options
 * @param {Function} options.getVerifier - Verifier retrieval function
 * @param {boolean} [options.optional=false] - If true, non-authenticated requests pass through with authenticated=false
 * @param {string} [options.roleName="User"] - Role name for descriptive error reporting
 * @returns {import("hono").MiddlewareHandler}
 */
export const createAuthMiddleware = ({
  getVerifier,
  optional = false,
  roleName = "User",
}) => {
  return async (c, next) => {
    const token = extractBearerToken(c);

    if (!token) {
      if (optional) {
        c.set("authenticated", false);
        return next();
      }
      return c.json(
        {
          error: "Unauthorized",
          message: `Authorization Bearer token is required for ${roleName} access.`,
        },
        401
      );
    }

    try {
      const verifier = getVerifier(c.env);
      const payload = await verifier.verify(token);

      c.set("user", payload);
      if (optional) {
        c.set("authenticated", true);
      }
      return next();
    } catch (err) {
      if (optional) {
        c.set("authenticated", false);
        return next();
      }
      console.error(`[Auth] ${roleName} token verification failed:`, err.message || err);
      return c.json(
        {
          error: "Unauthorized",
          message: "Invalid, expired, or insufficient permissions token.",
        },
        401
      );
    }
  };
};

/**
 * Requires Staff privileges (Admin / Staff group).
 */
export const authStaff = createAuthMiddleware({
  getVerifier: getStaffVerifier,
  roleName: "Staff",
});

/**
 * Optional authentication for general users.
 * Sets `c.get("authenticated") = true|false` and `c.get("user") = payload`.
 */
export const authUser = createAuthMiddleware({
  getVerifier: getUserVerifier,
  optional: true,
  roleName: "User",
});

/**
 * Requires Leader privileges (Staff or GardenKeeper group).
 */
export const authLeader = createAuthMiddleware({
  getVerifier: getLeaderVerifier,
  roleName: "Leader",
});
