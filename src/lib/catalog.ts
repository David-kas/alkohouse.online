import fs from "fs";
import path from "path";
import { put, get, list } from "@vercel/blob";
import type { CatalogData, Product } from "./types";
import { BLOB_CATALOG_PATH } from "./constants";

const CATALOG_FILE = path.join(process.cwd(), "data", "catalog.json");

function readLocalCatalog(): CatalogData {
  if (!fs.existsSync(CATALOG_FILE)) {
    return { version: 1, updatedAt: new Date().toISOString(), products: [] };
  }
  return JSON.parse(fs.readFileSync(CATALOG_FILE, "utf8")) as CatalogData;
}

function writeLocalCatalog(data: CatalogData) {
  fs.mkdirSync(path.dirname(CATALOG_FILE), { recursive: true });
  fs.writeFileSync(CATALOG_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function readBlobCatalog(): Promise<CatalogData | null> {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return null;
    const result = await get(BLOB_CATALOG_PATH, { access: "private", token });
    if (!result?.stream) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as CatalogData;
  } catch {
    return null;
  }
}

async function writeBlobCatalog(data: CatalogData) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    writeLocalCatalog(data);
    return;
  }
  await put(BLOB_CATALOG_PATH, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token,
  });
  writeLocalCatalog(data);
}

export async function getCatalog(): Promise<CatalogData> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await readBlobCatalog();
    if (blob?.products?.length) return blob;
  }
  return readLocalCatalog();
}

export async function saveCatalog(data: CatalogData): Promise<void> {
  data.updatedAt = new Date().toISOString();
  await writeBlobCatalog(data);
}

export async function getAllProducts(): Promise<Product[]> {
  const catalog = await getCatalog();
  return [...catalog.products].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug);
}

export async function getSimilarProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getAllProducts();
  return products
    .filter((p) => p.category === product.category && p.id !== product.id && p.inStock)
    .slice(0, limit);
}

export async function appendOrderLog(order: unknown) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return;
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await put(`alkohouse/orders/${id}.json`, JSON.stringify(order, null, 2), {
    access: "private",
    contentType: "application/json",
    token,
  });
}

export async function listRecentOrders(limit = 50) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return [];
  const { blobs } = await list({ prefix: "alkohouse/orders/", token });
  return blobs.slice(-limit).reverse();
}