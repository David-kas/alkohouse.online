import { NextResponse } from "next/server";
import { z } from "zod";
import { getCatalog, saveCatalog } from "@/lib/catalog";
import { requireAdmin } from "@/lib/admin-session";

const patchSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  price: z.number().positive().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  inStock: z.boolean().optional(),
  brand: z.string().optional(),
  volume: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  sortOrder: z.number().optional(),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const { id } = await params;
  const body = patchSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  const catalog = await getCatalog();
  const idx = catalog.products.findIndex((p) => p.id === id);
  if (idx < 0) {
    return NextResponse.json({ success: false, message: "Не найден" }, { status: 404 });
  }
  catalog.products[idx] = { ...catalog.products[idx], ...body.data } as (typeof catalog.products)[number];
  if (body.data.image) {
    catalog.products[idx].images = body.data.images || [body.data.image];
  }
  await saveCatalog(catalog);
  return NextResponse.json({ success: true, product: catalog.products[idx] });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const { id } = await params;
  const catalog = await getCatalog();
  catalog.products = catalog.products.filter((p) => p.id !== id);
  await saveCatalog(catalog);
  return NextResponse.json({ success: true });
}