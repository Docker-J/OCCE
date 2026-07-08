import { Hono } from "hono";
import {
  confimrSignUpController,
  refreshSignInController,
  requestConfirmController,
  signInController,
  signOutController,
  signUpController,
  forgotPasswordController,
  confirmForgotPasswordController,
} from "../controller/user.controller.js";

const router = new Hono();

router.post("/sign-in", signInController);
router.post("/refresh-sign-in", refreshSignInController);
router.post("/sign-up", signUpController);
router.post("/confirm", confimrSignUpController);
router.get("/resend-confirm", requestConfirmController);
router.post("/sign-out", signOutController);
router.post("/forgot-password", forgotPasswordController);
router.post("/confirm-forgot-password", confirmForgotPasswordController);

export default router;
