import express, { RequestHandler } from "express";
import { body, param } from "express-validator";
import {
  registerUserHandler,
  verifyUserHandler,
  loginUserHandler,
  refreshTokenHandler,
  logoutUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  updatePasswordHandler,
} from "../controllers/authController";
import { tokenProtect } from "../middlewares/tokenProtect";
import { requireUser } from "../middlewares/requireUser";

const router = express.Router();

router.post(
  "/register",
  [
    body("userName").notEmpty().withMessage("User name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 chars long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],
  registerUserHandler as RequestHandler
);

router.post(
  "/verify/:verificationString",
  [
    param("verificationString")
      .notEmpty()
      .withMessage("Verification string is required"),
  ],
  verifyUserHandler as RequestHandler
);

router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUserHandler as RequestHandler
);

router.get("/refresh-token", refreshTokenHandler as RequestHandler);

router.post(
  "/forgot-password",
  [body("email").notEmpty().withMessage("Email is required")],
  forgotPasswordHandler as RequestHandler
);

router.patch(
  "/reset-password/:resetString",
  [
    param("resetString").notEmpty().withMessage("Reset string is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 chars long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],
  resetPasswordHandler as RequestHandler
);

router.use(tokenProtect as RequestHandler, requireUser as RequestHandler);

router.post("/logout", logoutUserHandler as RequestHandler);

router.patch(
  "/update-password",
  [
    body("currentPassword")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 chard long"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 chars long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],
  updatePasswordHandler as RequestHandler
);
export default router;
