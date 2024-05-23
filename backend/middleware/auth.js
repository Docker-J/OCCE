import { CognitoJwtVerifier } from "aws-jwt-verify";

const staffVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
  groups: "Staff",
});

const userVerfier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
});

export const authStaff = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    console.log(req.header("Authorization"));
    const payload = await staffVerifier.verify(token);
    console.log("Token is valid. Payload:", payload);

    next();
  } catch (err) {
    console.log("Token not valid!");

    res.sendStatus(401);
  }
};

export const authUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const payload = await userVerfier.verify(token);
    console.log("Token is valid. Payload:", payload);

    res.locals.authenticated = true;
  } catch (err) {
    res.locals.authenticated = false;
  } finally {
    next();
  }
};
