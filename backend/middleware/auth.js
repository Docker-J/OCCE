import { CognitoJwtVerifier } from "aws-jwt-verify";

const AWS_COGNITO_CLIENT_ID = process.env.AWS_COGNITO_CLIENT_ID;

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: AWS_COGNITO_CLIENT_ID,
  groups: "Staff",
});

const authStaff = async (req, res, next) => {
  // 바로
  try {
    const token = req.header("Authorization").split(" ")[1];
    const payload = await verifier.verify(token);
    console.log("Token is valid. Payload:", payload);

    next();
  } catch (err) {
    console.log("Token not valid!");

    next(err);
  }
};

export default authStaff;
