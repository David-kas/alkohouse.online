"use client";

import { PHONE_TEL } from "@/lib/constants";
import { useCart } from "@/components/providers/CartProvider";

export function MobileBottomBar() {
  const { count, setOpen } = useCart();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-graphite/95 px-2 py-2 backdrop-blur md:hidden">
      <a href="#catalog" className="flex-1 rounded-lg py-2 text-center text-xs text-cream">
        Каталог
      </a>
      <button type="button" onClick={() => setOpen(true)} className="relative flex-1 rounded-lg py-2 text-center text-xs text-cream">
        Корзина {count > 0 ? `(${count})` : ""}
      </button>
      <a href={`tel:${PHONE_TEL}`} className="flex-1 rounded-lg bg-burgundy py-2 text-center text-xs text-cream">
        Звонок
      </a>
    </div>
  );
}