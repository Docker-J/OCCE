const express = require("express");
const router = express.Router();

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
// const AWS = require("aws-sdk");
const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  GlobalSignOutCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const poolData = {
  UserPoolId: "us-west-2_v1MWWI1Vn",
  ClientId: "78vu8v6fh72mhjetdmsh2vvaad",
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-west-2",
});

router.post("/signIn", async (req, res) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: "78vu8v6fh72mhjetdmsh2vvaad",
    AuthParameters: {
      USERNAME: req.body.email,
      PASSWORD: req.body.password,
    },
  };

  const command = new InitiateAuthCommand(params);

  try {
    const response = await cognitoClient.send(command);
    const accessToken = response.AuthenticationResult.AccessToken;
    const refreshToken = response.AuthenticationResult.RefreshToken;

    res.send({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    res.send(error);
  }
});

router.get("/refreshAccessToken", async (req, res) => {
  const params = {
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: "78vu8v6fh72mhjetdmsh2vvaad",
    AuthParameters: {
      REFRESH_TOKEN: req.query.refreshToken,
    },
  };

  const command = new InitiateAuthCommand(params);

  try {
    const response = await cognitoClient.send(command);
    console.log(response);
    const accessToken = response.AuthenticationResult.AccessToken;
    const newRefreshToken = response.AuthenticationResult.RefreshToken;

    console.log("Access Token", accessToken);
    res.send(accessToken);
  } catch (error) {
    res.send(error);
  }
});

router.post("/signUp", async (req, res) => {
  const params = {
    ClientId: "78vu8v6fh72mhjetdmsh2vvaad",
    Username: req.body.email, // required
    Password: req.body.password, // required
    UserAttributes: [
      // AttributeListType
      {
        // AttributeType
        Name: "name",
        Value: req.body.name,
      },
    ],
    ValidationData: [
      {
        Name: "name", // required
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
});

router.post("/confirm", async (req, res) => {
  var userData = { Username: req.body.email, Pool: userPool };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.confirmRegistration(
    req.body.confirm_code,
    true,
    function (err, result) {
      if (err) {
        console.log(err.message || JSON.stringify(err));
        res.sendStatus(400);
        return;
      }
      console.log("call result: " + result);
      res.sendStatus(200);
    }
  );
});

router.get("/resendConfirm", async (req, res) => {
  var userData = { Username: req.query.email, Pool: userPool };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.resendConfirmationCode((err, result) => {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    console.log("call result: " + result);
    res.sendStatus(200);
  });
});

router.post("/signOut", async (req, res) => {
  const command = new GlobalSignOutCommand({
    AccessToken: req.body.accessToken,
  });
  console.log(req.body.accessToken);
  try {
    const response = await cognitoClient.send(command);
    res.sendStatus(202);
    res.send(response);
  } catch (error) {
    // res.sendStatus(401);
    console.log(error);
    res.send(error);
  }
});

module.exports = router;
