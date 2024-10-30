import { Response } from "express";

export function logOut(res: Response) {
  res.clearCookie("accessToken", { httpOnly: true });
  res.clearCookie("refreshToken", { httpOnly: true });
  res.clearCookie("loggedIn", { httpOnly: true });
}
