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

const authStaff = async (req, _, next) => {
  // 바로
  try {
    const token = req.header("Authorization").split(" ")[1];
    const payload = await staffVerifier.verify(token);
    console.log("Token is valid. Payload:", payload);

    next();
  } catch (err) {
    console.log("Token not valid!");

    next(err);
  }
};

const authUser = async (req, _, next) => {
  // 바로
  try {
    const token = req.header("Authorization").split(" ")[1];
    const payload = await userVerfier.verify(token);
    console.log("Token is valid. Payload:", payload);

    next();
  } catch (err) {
    console.log("Token not valid!");

    next(err);
  }
};

export default authStaff;
