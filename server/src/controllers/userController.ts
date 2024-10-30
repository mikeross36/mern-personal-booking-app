import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { validationResult } from "express-validator";
import { UserModel } from "../models";

export async function getUserInfoHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(400).json({ message: "User is not logged in" });
    }
    return res.status(200).json({ data: { user } });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return next(err);
    }
    return next(new Error("An unknown error occurred"));
  }
}

export async function updateUserAccountHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const user = await UserModel.findById(res.locals.user._id);
    if (!user) {
      return res.status(404).json("User for update not found");
    } else {
      user.userName = req.body.userName || user.userName;
      user.email = req.body.email || user.email;

      const udpatedUser = await user.save();
      return res.status(200).json({
        message: "User's account successfully updated",
        _id: udpatedUser._id,
        userName: udpatedUser.userName,
        email: udpatedUser.email,
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return next(err);
    }
    return next(new Error("An unknown error occurred"));
  }
}
