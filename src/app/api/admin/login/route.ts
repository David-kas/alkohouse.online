import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, isAdminConfigured, verifyAdminPassword } from "@/lib/auth";
import { getAdminSession } from "@/lib/admin-session";

const schema = z.object({ password: z.string().min(1) });

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ success: false, message: "ADMIN_PASSWORD не задан" }, { status: 503 });
  }
  const session = await getAdminSession();
  const limit = checkRateLimit(session.loginAttempts);
  if (!limit.ok) {
    return NextResponse.json({ success: false, message: limit.message }, { status: 429 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ success: false, message: "Введите пароль" }, { status: 400 });
  }

  const ok = await verifyAdminPassword(body.data.password);
  if (!ok) {
    session.loginAttempts = (session.loginAttempts ?? 0) + 1;
    await session.save();
    return NextResponse.json({ success: false, message: "Неверный пароль" }, { status: 401 });
  }

  session.isAdmin = true;
  session.loginAttempts = 0;
  await session.save();
  return NextResponse.json({ success: true });
}