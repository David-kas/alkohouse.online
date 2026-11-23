"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/categories";
import { ProductCard } from "./ProductCard";
import { ProductQuickView } from "./ProductQuickView";

type SortKey = "price-asc" | "price-desc" | "name";

interface Props {
  products: Product[];
}

export function CatalogClient({ products }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("name");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let list = [...products];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          CATEGORY_LABELS[p.category].toLowerCase().includes(q),
      );
    }
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (inStockOnly) list = list.filter((p) => p.inStock);
    list.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name, "ru");
    });
    return list;
  }, [products, query, category, sort, inStockOnly]);

  return (
  <section id="catalog" className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-3xl text-cream">Каталог</h2>
          <p className="mt-2 text-cream/70">
            Поиск, фильтры и сортировка — {filtered.length} из {products.length} позиций
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 lg:flex-row lg:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию или бренду"
          className="w-full rounded-xl border border-white/10 bg-graphite px-4 py-3 text-cream outline-none focus:border-gold/50"
          aria-label="Поиск товаров"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-white/10 bg-graphite px-3 py-3 text-cream"
          aria-label="Категория"
        >
          <option value="all">Все категории</option>
          {CATEGORY_ORDER.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-xl border border-white/10 bg-graphite px-3 py-3 text-cream"
          aria-label="Сортировка"
        >
          <option value="name">По названию</option>
          <option value="price-asc">Цена ↑</option>
          <option value="price-desc">Цена ↓</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-cream/80">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 rounded border-white/20"
          />
          Только в наличии
        </label>
      </div>

      <div className="mt-6 hidden flex-wrap gap-2 lg:flex">
        {CATEGORY_ORDER.map((c) => (
          <a
            key={c}
            href={`#catalog-${c}`}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-cream/70 hover:border-gold/40"
          >
            {CATEGORY_LABELS[c]}
          </a>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-cream/60">Ничего не найдено. Измените фильтры или запрос.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
          ))}
        </div>
      )}

      <ProductQuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}