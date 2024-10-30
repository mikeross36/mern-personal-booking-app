import jwt, { SignOptions, JsonWebTokenError } from "jsonwebtoken";
import { logger } from "./logger";
import config from "config";

export function signJwt(
  payload: Object,
  key: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options: SignOptions = {}
): string | undefined {
  try {
    const privateKey = Buffer.from(config.get<string>(key), "base64").toString(
      "ascii"
    );
    return jwt.sign(payload, privateKey, {
      ...(options && options),
      algorithm: "RS256",
      allowInsecureKeySizes: true,
    });
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      logger.error(err.message);
      throw new Error(`Error signing JWT: ${err.message}`);
    }
    throw err;
  }
}

export function verifyJwt<T>(
  token: string,
  key: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null {
  try {
    const publicKey = Buffer.from(config.get<string>(key), "base64").toString(
      "ascii"
    );
    return jwt.verify(token, publicKey) as T;
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      switch (err.name) {
        case "JsonWebTokenError": {
          logger.error(err.message);
          throw new Error(`Invalid JWT: ${err.message}`);
        }
        case "TokenExpiredError": {
          logger.error(err.message);
          throw new Error("JWT has been expired");
        }
        default:
          logger.error("Error verifying the JWT");
          throw new Error("Error verifying the JWT");
      }
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}
