import { User } from "../models/userModel";
import { signJwt } from "./jwtUtils";
import redisClient from "../connections/connectRedis";

const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;

export function generateToken(user: User) {
  if (!user._id) {
    throw new Error("User ID is required");
  }
  const accessToken = signJwt({ sub: user._id }, "accessTokenPrivateKey", {
    expiresIn: `${accessTokenExpiresIn}m`,
  });
  const refreshToken = signJwt({ sub: user._id }, "refreshTokenPrivateKey", {
    expiresIn: `${refreshTokenExpiresIn}d`,
  });
  redisClient.set(user._id.toString(), JSON.stringify(user));

  return { accessToken, refreshToken };
}
