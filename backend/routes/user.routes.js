import express from "express";

import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { signInController } from "../controller/user.controller.js";

const router = express.Router();

const AWS_COGNITO_CLIENT_ID = process.env.AWS_COGNITO_CLIENT_ID;
const AWS_COGNITO_USER_POOL_ID = process.env.AWS_COGNITO_USER_POOL_ID;

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-west-2",
});

router.post("/signIn", signInController);

router.get("/refreshAccessToken", async (req, res) => {
  const params = {
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: AWS_COGNITO_CLIENT_ID,
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
    ClientId: AWS_COGNITO_CLIENT_ID,
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
    ClientId: AWS_COGNITO_CLIENT_ID,
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
    ClientId: AWS_COGNITO_CLIENT_ID,
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
