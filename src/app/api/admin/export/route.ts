import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { requireAdmin } from "@/lib/admin-session";

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const format = new URL(request.url).searchParams.get("format") || "json";
  const catalog = await getCatalog();
  if (format === "csv") {
    const header = "id,slug,name,category,price,inStock,image";
    const rows = catalog.products.map(
      (p) =>
        `"${p.id}","${p.slug}","${p.name.replace(/"/g, '""')}","${p.category}",${p.price},${p.inStock},"${p.image}"`,
    );
    return new NextResponse([header, ...rows].join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=catalog.csv",
      },
    });
  }
  return new NextResponse(JSON.stringify(catalog, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=catalog.json",
    },
  });
}