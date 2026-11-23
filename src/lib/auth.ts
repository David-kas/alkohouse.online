import bcrypt from "bcryptjs";

const MAX_ATTEMPTS = 5;

export function getAdminPasswordPlain(): string {
  return (process.env.ADMIN_PASSWORD || "").trim();
}

export function getAdminPasswordHash(): string {
  return (process.env.ADMIN_PASSWORD_HASH || "").trim();
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = getAdminPasswordHash();
  if (hash) return bcrypt.compare(password, hash);
  const plain = getAdminPasswordPlain();
  if (!plain) return false;
  return password === plain;
}

export function isAdminConfigured(): boolean {
  return Boolean(getAdminPasswordHash() || getAdminPasswordPlain());
}

export function checkRateLimit(attempts: number | undefined): { ok: boolean; message?: string } {
  if ((attempts ?? 0) >= MAX_ATTEMPTS) {
    return { ok: false, message: "Слишком много попыток. Попробуйте позже." };
  }
  return { ok: true };
}