import { CognitoJwtVerifier } from "aws-jwt-verify";

// Cache verifiers per environment configuration
let staffVerifierInstance;
let userVerifierInstance;
let leaderVerifierInstance;

const getStaffVerifier = (env) => {
  if (!staffVerifierInstance) {
    staffVerifierInstance = CognitoJwtVerifier.create({
      userPoolId: env.AWS_COGNITO_USER_POOL_ID,
      tokenUse: "access",
      clientId: env.AWS_COGNITO_CLIENT_ID,
      groups: "Staff",
    });
  }
  return staffVerifierInstance;
};

const getUserVerifier = (env) => {
  if (!userVerifierInstance) {
    userVerifierInstance = CognitoJwtVerifier.create({
      userPoolId: env.AWS_COGNITO_USER_POOL_ID,
      tokenUse: "access",
      clientId: env.AWS_COGNITO_CLIENT_ID,
    });
  }
  return userVerifierInstance;
};

const getLeaderVerifier = (env) => {
  if (!leaderVerifierInstance) {
    leaderVerifierInstance = CognitoJwtVerifier.create({
      userPoolId: env.AWS_COGNITO_USER_POOL_ID,
      tokenUse: "access",
      clientId: env.AWS_COGNITO_CLIENT_ID,
      groups: ["Staff", "GardenKeeper"],
    });
  }
  return leaderVerifierInstance;
};

export const authStaff = async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) throw new Error("No Authorization header provided");

    const token = authHeader.split(" ")[1];
    const verifier = getStaffVerifier(c.env);
    const payload = await verifier.verify(token);

    c.set("user", payload);
    await next();
  } catch (err) {
    console.error("Staff authentication failed:", err);
    return c.text("Unauthorized", 401);
  }
};

export const authUser = async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) throw new Error("No Authorization header provided");

    const token = authHeader.split(" ")[1];
    const verifier = getUserVerifier(c.env);
    const payload = await verifier.verify(token);

    c.set("user", payload);
    c.set("authenticated", true);
  } catch (err) {
    c.set("authenticated", false);
  } finally {
    await next();
  }
};

export const authLeader = async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) throw new Error("No Authorization header provided");

    const token = authHeader.split(" ")[1];
    const verifier = getLeaderVerifier(c.env);
    const payload = await verifier.verify(token);

    c.set("user", payload);
    await next();
  } catch (err) {
    console.error("Leader authentication failed:", err);
    return c.text("Unauthorized", 401);
  }
};
