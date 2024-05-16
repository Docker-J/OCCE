import {
  CognitoIdentityProviderClient,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const AWS_COGNITO_CLIENT_ID = process.env.AWS_COGNITO_CLIENT_ID;
// const AWS_COGNITO_USER_POOL_ID = process.env.AWS_COGNITO_USER_POOL_ID;

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

export const refreshSignInController = async (req, res) => {
  console.log("Sign In requested");

  const params = {
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: AWS_COGNITO_CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: req.params.refreshToken,
    },
  };

  const command = new InitiateAuthCommand(params);

  try {
    const response = await cognitoClient.send(command);
    const accessToken = response.AuthenticationResult.AccessToken;
    const newRefreshToken = response.AuthenticationResult.RefreshToken;
    const group = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64"))[
      "cognito:groups"
    ][0];

    res.send({
      accessToken: accessToken,
      refreshToken: newRefreshToken,
      group: group,
    });
  } catch (error) {
    res.send(error);
    res.sendStatus(403);
  }
};

export const signUpController = async (req, res) => {
  const params = {
    ClientId: AWS_COGNITO_CLIENT_ID,
    Username: req.body.email,
    Password: req.body.password,
    UserAttributes: [
      {
        Name: "name",
        Value: req.body.name,
      },
    ],
  };

  const command = new SignUpCommand(params);
  try {
    const response = await cognitoClient.send(command);
    console.log(response);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const signOutController = async (req, res) => {
  const command = new GlobalSignOutCommand({
    AccessToken: req.params.accessToken,
  });

  try {
    await cognitoClient.send(command);
    res.sendStatus(200);
  } catch (error) {
    // res.sendStatus(401);
    console.log(error);
    res.send(error);
  }
};
