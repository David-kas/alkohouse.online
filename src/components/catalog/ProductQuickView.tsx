"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/providers/CartProvider";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export function ProductQuickView({ product, onClose }: Props) {
  const { addProduct } = useCart();

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-4 md:items-center" role="dialog" aria-modal aria-labelledby="quick-view-title">
      <button type="button" className="absolute inset-0" aria-label="Закрыть" onClick={onClose} />
      <div className="relative z-10 grid max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border border-white/10 bg-surface md:grid-cols-2">
        <div className="relative aspect-square bg-black/30">
          <Image src={product.image} alt={product.alt} fill className="object-contain p-6" sizes="50vw" />
        </div>
        <div className="p-6">
          <h2 id="quick-view-title" className="font-display text-xl text-cream">
            {product.name}
          </h2>
          <p className="mt-3 text-2xl font-semibold text-gold">{formatPrice(product.price)}</p>
          <p className="mt-4 text-sm text-cream/70">{product.shortDesc}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!product.inStock}
              onClick={() => addProduct(product)}
              className="rounded-full bg-burgundy px-5 py-2.5 text-sm text-cream disabled:opacity-40"
            >
              В корзину
            </button>
            <Link
              href={`/product/${product.slug}`}
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-cream"
              onClick={onClose}
            >
              Подробнее
            </Link>
          </div>
          <button type="button" onClick={onClose} className="mt-6 text-sm text-cream/50 underline">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}