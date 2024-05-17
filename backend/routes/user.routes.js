import express from "express";

import {
  confimrSignUpController,
  refreshSignInController,
  requestConfirmController,
  signInController,
  signOutController,
  signUpController,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/signIn", signInController);

router.post("/refreshSignIn/:refreshToken", refreshSignInController);

router.post("/signUp", signUpController);

router.post("/confirm", confimrSignUpController);

router.get("/resendConfirm", requestConfirmController);

router.post("/signOut", signOutController);

export default router;
