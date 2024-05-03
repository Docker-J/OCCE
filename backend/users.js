import express from "express";
import axios from "axios";

import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AdminListGroupsForUserCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const router = express.Router();

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-west-2",
});

router.post("/signIn", async (req, res) => {
  console.log("Sign In requested");
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

    const group = await axios.get("http://localhost:3001/api/User/getGroup", {
      params: { email: req.body.email },
    });

    console.log(response);

    res.send({
      accessToken: accessToken,
      refreshToken: refreshToken,
      group: group.data,
    });
  } catch (error) {
    res.sendStatus(403);
  }
});

router.get("/getGroup", async (req, res) => {
  const input = {
    // AdminListGroupsForUserRequest
    Username: req.query.email, // required
    UserPoolId: "us-west-2_v1MWWI1Vn", // required
  };

  const command = new AdminListGroupsForUserCommand(input);

  try {
    const response = await cognitoClient.send(command);

    res.send(response.Groups[0].GroupName);
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
  const input = {
    // ConfirmSignUpRequest
    ClientId: "78vu8v6fh72mhjetdmsh2vvaad",
    Username: req.body.email, // required
    ConfirmationCode: req.body.confirm_code, // required
  };
  const command = new ConfirmSignUpCommand(input);

  try {
    const response = await cognitoClient.send(command);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/resendConfirm", async (req, res) => {
  const input = {
    // ResendConfirmationCodeRequest
    ClientId: "78vu8v6fh72mhjetdmsh2vvaad",
    Username: req.query.email, // required
  };
  const command = new ResendConfirmationCodeCommand(input);

  try {
    const response = await cognitoClient.send(command);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.post("/signOut", async (req, res) => {
  const command = new GlobalSignOutCommand({
    AccessToken: req.body.accessToken,
  });
  try {
    const response = await cognitoClient.send(command);
    res.send(response);
  } catch (error) {
    // res.sendStatus(401);
    console.log(error);
    res.send(error);
  }
});

export default router;
