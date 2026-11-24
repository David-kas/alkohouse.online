"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/categories";
import { useCart } from "@/components/providers/CartProvider";

interface Props {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: Props) {
  const { addProduct } = useCart();

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/80 shadow-sm transition hover:border-gold/30 hover:shadow-lg">
      <div className="relative aspect-[4/5] bg-black/20">
        <button
          type="button"
          className="absolute inset-0 z-10"
          aria-label={`Быстрый просмотр ${product.name}`}
          onClick={() => onQuickView?.(product)}
        />
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-contain p-4 transition group-hover:scale-[1.02]"
        />
        {!product.inStock ? (
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2 py-1 text-xs text-cream">
            Нет в наличии
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-gold/80">{CATEGORY_LABELS[product.category]}</p>
        <h3 className="font-display text-base leading-snug text-cream">
          <Link href={`/product/${product.slug}`} className="hover:text-gold">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-cream/60">{product.shortDesc}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-lg font-semibold text-cream">{formatPrice(product.price)}</span>
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => addProduct(product)}
            className="rounded-full bg-burgundy px-4 py-2 text-sm font-medium text-cream disabled:cursor-not-allowed disabled:opacity-40"
          >
            В корзину
          </button>
        </div>
      </div>
    </article>
  );
}