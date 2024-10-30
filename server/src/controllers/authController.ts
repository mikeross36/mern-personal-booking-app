import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { UserModel } from "../models";
import Email from "../utils/mailer";
import { User } from "../models/userModel";
import { MongoError } from "mongodb";
import crypto from "crypto";
import { logger } from "../utils/logger";
import { generateToken } from "../utils/generateToken";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../utils/options";
import { verifyJwt, signJwt } from "../utils/jwtUtils";
import redisClient from "../connections/connectRedis";
import { logOut } from "../middlewares/logOut";

const devOrigin = process.env.DEV_ORIGIN;
const prodOrigin = process.env.PROD_ORIGIN;
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;

export async function registerUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<any, Record<string, any>>> {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this email allready exists" });
    }
    user = await UserModel.create(req.body);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Failed to create user. Invalid data passesd" });
    }
    const verificationString = user.createVerificationCode();
    await user.save();

    const verificationUrl =
      process.env.NODE_ENV === "development"
        ? `${devOrigin}/verify/${verificationString}`
        : `${prodOrigin}/verify/${verificationString}`;

    try {
      await new Email(user as User, verificationUrl).sendWelcomeEmail();
      return res.status(201).json({
        message: "Registration successful. Check your email to verify account",
        data: { user },
      });
    } catch (err) {
      user.verificationCode = undefined;
      await user.save();
      return res.status(500).json({
        message: "There was an error sending email. Please try again later",
      });
    }
  } catch (err) {
    if (err instanceof MongoError && err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Conflict. Account allready exists" });
    }
    return next(new Error("An unknown error occurred"));
  }
}

export async function verifyUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<any, Record<string, any>>> {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const verificationCode = crypto
      .createHash("sha256")
      .update(req.params.verificationString)
      .digest("hex");

    const user = await UserModel.findOne({
      verificationCode: verificationCode,
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with that verification code not found" });
    }
    if (user.userVerified) {
      return res
        .status(400)
        .json({ message: "User's account allready verified" });
    }
    user.userVerified = true;
    user.verificationCode = undefined;
    await user.save();
    return res.status(200).json({
      message: "User's account verified successfully. Please login to continue",
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return next(err);
    }
    return next(new Error("An unknown error occurred"));
  }
}

export async function loginUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<any, Record<string, any>>> {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const user = await UserModel.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user || !(await user.matchPasswords(req.body.password))) {
      return res
        .status(401)
        .json({ message: "Unauthorized!. Invalid email or password" });
    }
    if (user.userVerified === false) {
      return res
        .status(401)
        .json({ message: "Unauthorized! User's account not verified" });
    }
    const { accessToken, refreshToken } = generateToken(user);
    res.cookie("accessToken", accessToken, accessTokenCookieOptions),
      res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
    res.cookie("loggedIn", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });
    return res
      .status(200)
      .json({ message: "Logged in successfully", accessToken });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return next(err);
    }
    return next(new Error("An unknown error occurred"));
  }
}

export async function refreshTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<any, Record<string, any>>> {
  try {
    const refreshToken = req.cookies.refreshToken;
    const verified = verifyJwt<{ sub: string }>(
      refreshToken,
      "refreshTokenPublicKey"
    );
    if (!verified) {
      return res
        .status(403)
        .json({ message: "Failed to verify refresh token" });
    }
    const session = await redisClient.get(verified.sub.toString());
    if (!session) {
      return res.status(403).json({
        message: "Failed to refresh token. User session not available",
      });
    }
    const user = await UserModel.findById(JSON.parse(session)._id).select(
      "+password"
    );
    if (!user) {
      return res
        .status(403)
        .json({ message: "User with this token no longer exists" });
    }
    const accessToken = signJwt({ sub: user._id }, "accessTokenPrivateKey", {
      expiresIn: `${accessTokenExpiresIn}m`,
    });
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("loggedIn", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });
    return res.status(200).json(accessToken);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return next(err);
    }
    return next(new Error("An unknown error occurred"));
  }
}

export async function logoutUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<any, Record<string, any>>> {
  try {
    const user = res.locals.user;
    if (!user) {
      return res
        .status(400)
        .json({ message: "Failed to logout. Invalid user info" });
    }
    try {
      await redisClient.del(user.toString());
    } catch (err) {
      if (err instanceof Error) {
        logger.error(`Redis client closed: ${err.message}`);
      }
      throw err;
    }
    try {
      logOut(res);
      return res.status(200).json({ message: "LOGGED OUT!" });
    } catch (err: any) {
      logger.error(`Error clearing response cookies: ${err.message}`);
      return res
        .status(500)
        .json({ message: "Error occurred during the logout" });
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return next(err);
    }
    return next(new Error("An unknown error occurred"));
  }
}

export async function forgotPasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized. There is no user with this email" });
    }
    if (!user.userVerified) {
      return res.status(400).json({ message: "Users account is not verified" });
    }
    const resetString = user.createResetToken();
    await user.save();

    const resetUrl =
      process.env.NODE_ENV === "development"
        ? `${devOrigin}/reset-password/${resetString}`
        : `${prodOrigin}/reset-password/${resetString}`;
    try {
      await new Email(user as User, resetUrl).sendPasswordReset();
      return res.status(200).json({
        message: "Password reset token sent by email (valid for 10 minutes)",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetAt = undefined;
      await user.save();
      return res
        .status(500)
        .json({ message: "There was an error sending email" });
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return next(err);
    }
    return next(new Error("An unknown error occurred"));
  }
}

export async function resetPasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(req.params.resetString)
      .digest("hex");

    const user = await UserModel.findOne({
      passwordResetToken: passwordResetToken,
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset token" });
    }
    try {
      user.password = req.body.password;
      user.passwordResetToken = undefined;
      user.passwordResetAt = undefined;
      await user.save();
      return res.status(200).json({
        message: "Password successfully reset. Please login with new password",
      });
    } catch (err: any) {
      logger.error(`Error saving password reset data: ${err.message}`);
      return res.status(500).json({ message: "Error resetting password" });
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return next(err);
    }
    return next(new Error("An unknown error occurred"));
  }
}

export async function updatePasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const user = res.locals.user;
    if (!user || !(await user.matchPasswords(req.body.currentPassword))) {
      return res
        .status(401)
        .json({ message: "Unuthorized. Invalid current password" });
    }
    try {
      user.password = req.body.password;
      await user.save();
      return res.status(200).json({
        message:
          "Password updated successfully. Please login with new password",
      });
    } catch (err: any) {
      logger.error(`Error updating password: ${err.message}`);
      return res.status(500).json({ message: "Error updating password" });
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return next(err);
    }
    return next(new Error("An unknown error occurred"));
  }
}
