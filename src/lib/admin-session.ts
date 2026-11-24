import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { getAdminSessionOptions, type AdminSession } from "./session";

export async function getAdminSession() {
  return getIronSession<AdminSession>(await cookies(), getAdminSessionOptions());
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return null;
  }
  return session;
}