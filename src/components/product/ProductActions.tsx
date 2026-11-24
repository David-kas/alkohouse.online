"use client";

import type { Product } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";

export function ProductActions({ product }: { product: Product }) {
  const { addProduct, setOpen } = useCart();
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        disabled={!product.inStock}
        onClick={() => addProduct(product)}
        className="rounded-full bg-burgundy px-6 py-3 text-sm font-semibold text-cream disabled:opacity-40"
      >
        В корзину
      </button>
      <button
        type="button"
        onClick={() => {
          addProduct(product);
          setOpen(true);
        }}
        className="rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-gold"
      >
        Оформить заявку
      </button>
    </div>
  );
}