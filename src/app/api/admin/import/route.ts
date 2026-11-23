import { NextResponse } from "next/server";
import { saveCatalog } from "@/lib/catalog";
import { requireAdmin } from "@/lib/admin-session";
import type { CatalogData } from "@/lib/types";

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const data = (await request.json()) as CatalogData;
  if (!Array.isArray(data.products)) {
    return NextResponse.json({ success: false, message: "Неверный формат" }, { status: 400 });
  }
  await saveCatalog({ version: data.version || 4, updatedAt: new Date().toISOString(), products: data.products });
  return NextResponse.json({ success: true, count: data.products.length });
}