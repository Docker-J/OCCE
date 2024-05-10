import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const AWS_COGNITO_CLIENT_ID = process.env.AWS_COGNITO_CLIENT_ID;
const AWS_COGNITO_USER_POOL_ID = process.env.AWS_COGNITO_USER_POOL_ID;

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-west-2",
});

export const signInController = async (req, res) => {
  const auth = new Buffer.from(
    req.header("Authorization").split(" ")[1],
    "base64"
  )
    .toString()
    .split(":");
  const email = auth[0];
  const password = auth[1];

  console.log("Sign In requested");
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: AWS_COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  const command = new InitiateAuthCommand(params);

  try {
    const response = await cognitoClient.send(command);
    const accessToken = response.AuthenticationResult.AccessToken;
    const refreshToken = response.AuthenticationResult.RefreshToken;
    const group = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64"))[
      "cognito:groups"
    ][0];

    res.send({
      accessToken: accessToken,
      refreshToken: refreshToken,
      group: group,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(403);
  }
};
