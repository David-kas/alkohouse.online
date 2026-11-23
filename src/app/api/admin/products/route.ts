import { NextResponse } from "next/server";
import { z } from "zod";
import { getCatalog, saveCatalog } from "@/lib/catalog";
import { requireAdmin } from "@/lib/admin-session";
import type { Product } from "@/lib/types";
import slugify from "slugify";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const catalog = await getCatalog();
  return NextResponse.json(catalog);
}

const productSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  image: z.string().min(1),
  description: z.string().min(1),
  shortDesc: z.string().optional(),
  inStock: z.boolean().default(true),
  brand: z.string().optional(),
  volume: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Неверные данные" }, { status: 400 });
  }
  const catalog = await getCatalog();
  const id = slugify(parsed.data.name, { locale: "ru", lower: true }) + "-" + Date.now().toString(36);
  const slug = slugify(id, { locale: "ru", lower: true, strict: true });
  const product: Product = {
    id,
    slug,
    name: parsed.data.name,
    category: parsed.data.category as Product["category"],
    price: parsed.data.price,
    image: parsed.data.image,
    images: [parsed.data.image],
    alt: parsed.data.name,
    description: parsed.data.description,
    shortDesc: parsed.data.shortDesc || parsed.data.description.slice(0, 160),
    characteristics: {
      category: parsed.data.category,
      ...(parsed.data.volume ? { volume: parsed.data.volume } : {}),
      ...(parsed.data.brand ? { brand: parsed.data.brand } : {}),
      availability: parsed.data.inStock ? "В наличии" : "Нет в наличии",
    },
    brand: parsed.data.brand,
    volume: parsed.data.volume,
    inStock: parsed.data.inStock,
    seoTitle: parsed.data.seoTitle || `${parsed.data.name} | AlkoHouse`,
    seoDescription: parsed.data.seoDescription || parsed.data.description.slice(0, 160),
    sortOrder: catalog.products.length,
  };
  catalog.products.push(product);
  await saveCatalog(catalog);
  return NextResponse.json({ success: true, product });
}