import type { SessionOptions } from "iron-session";

export interface AdminSession {
  isAdmin?: boolean;
  loginAttempts?: number;
}

export function getSessionPassword(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
    throw new Error("SESSION_SECRET must be at least 32 characters in production");
  }
  return "dev-only-alkohouse-session-secret-32chars";
}

export function getAdminSessionOptions(): SessionOptions {
  return {
    password: getSessionPassword(),
    cookieName: "alkohouse_admin_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
    },
  };
}