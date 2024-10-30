import cors from "cors";
import { CookieOptions } from "express";

const devOrigin = process.env.DEV_ORIGIN as string;
const prodOrigin = process.env.PROD_ORIGIN as string;

const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;

const GET = "GET";
const POST = "POST";
const PATCH = "PATCH";
const PUT = "PUT";
const DELETE = "DELETE";
const HEAD = "HEAD";
const OPTIONS = "OPTIONS";

export const corsOptions = cors({
  credentials: true,
  origin: [devOrigin, prodOrigin],
  methods: [GET, POST, PATCH, PUT, DELETE, HEAD, OPTIONS],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Access-Control-Allow-Origin",
  ],
  preflightContinue: false,
});

export const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + Number(accessTokenExpiresIn) * 60 * 1000),
  httpOnly: true,
  sameSite: "lax",
};

export const refreshTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + Number(refreshTokenExpiresIn) * 60 * 1000),
  httpOnly: true,
  sameSite: "lax",
};
