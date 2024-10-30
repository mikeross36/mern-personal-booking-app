import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function requireUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = res.locals.user;
    logger.warn(`User ${user._doc.userName || "unknown"} exists on res.locals`);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid toke or expired session" });
    }
    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid token or expired session" });
  }
}
