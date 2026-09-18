import { Hono } from "hono";
import {
  validateJson,
  validateQuery,
} from "../middleware/validator.js";
import {
  confirmSignUpController,
  refreshSignInController,
  requestConfirmController,
  signInController,
  signOutController,
  signUpController,
  forgotPasswordController,
  confirmForgotPasswordController,
} from "../controller/user.controller.js";

const router = new Hono();

// Authentication lifecycle
router.post("/sign-in", signInController);
router.post("/refresh-sign-in", refreshSignInController);
router.post("/sign-out", signOutController);

// Registration & verification
router.post(
  "/sign-up",
  validateJson(["name", "phone", "password"]),
  signUpController
);

router.post(
  "/confirm",
  validateJson(["phone", "confirmCode"]),
  confirmSignUpController
);

router.get(
  "/resend-confirm",
  validateQuery({
    phone: {
      required: true,
      message: "Phone number query parameter is required.",
    },
  }),
  requestConfirmController
);

// Password recovery
router.post(
  "/forgot-password",
  validateJson(["phone"]),
  forgotPasswordController
);

router.post(
  "/confirm-forgot-password",
  validateJson(["phone", "confirmCode", "password"]),
  confirmForgotPasswordController
);

export default router;
