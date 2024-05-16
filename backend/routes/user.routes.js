import express from "express";

import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  refreshSignInController,
  signInController,
  signOutController,
  signUpController,
} from "../controller/user.controller.js";

const router = express.Router();

const AWS_COGNITO_CLIENT_ID = process.env.AWS_COGNITO_CLIENT_ID;

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-west-2",
});

router.post("/signIn", signInController);

router.post("/refreshSignIn/:refreshToken", refreshSignInController);

router.post("/signUp", signUpController);

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

router.post("/signOut/:accessToken", signOutController);

export default router;
