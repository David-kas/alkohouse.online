import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-session";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ success: false, message: "Нет файла" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const safeName = file.name.replace(/[^\w.\-а-яё]+/gi, "-").toLowerCase();

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    const blob = await put(`alkohouse/products/${Date.now()}-${safeName}`, buffer, {
      access: "public",
      token,
      contentType: file.type || "application/octet-stream",
    });
    return NextResponse.json({ success: true, url: blob.url });
  }

  const dir = path.join(process.cwd(), "public", "images", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${Date.now()}-${safeName}`;
  fs.writeFileSync(path.join(dir, filename), buffer);
  return NextResponse.json({ success: true, url: `/images/uploads/${filename}` });
}