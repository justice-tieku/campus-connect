import jwt from "jsonwebtoken";
import type { CookieOptions, Response } from "express";
import type { Role } from "@prisma/client";

const COOKIE_NAME = "cc_token";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export type JwtPayload = {
  userId: string;
  role: Role;
};

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, jwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, jwtSecret()) as JwtPayload;
}

function cookieOptions(): CookieOptions {
  const secure =
    process.env.COOKIE_SECURE === "true" ||
    process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    maxAge: SEVEN_DAYS_MS,
    path: "/",
  };
}

export function setAuthCookie(res: Response, payload: JwtPayload) {
  res.cookie(COOKIE_NAME, signToken(payload), cookieOptions());
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: 0 });
}

export { COOKIE_NAME };
