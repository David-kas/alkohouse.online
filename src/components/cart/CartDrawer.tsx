"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { items, total, isOpen, setOpen, setQuantity, removeItem, clear } = useCart();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", address: "", comment: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items,
          total,
          source: "cart-drawer",
          test: process.env.NODE_ENV !== "production",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("err");
        setError(data.message || "Не удалось отправить заявку");
        return;
      }
      setStatus("ok");
      clear();
      setForm({ name: "", phone: "", address: "", comment: "" });
    } catch {
      setStatus("err");
      setError("Ошибка сети. Попробуйте позже или позвоните.");
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[75] bg-black/50 transition ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        className={`fixed inset-y-0 right-0 z-[76] flex w-full max-w-md flex-col border-l border-white/10 bg-graphite shadow-2xl transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h2 className="font-display text-lg text-cream">Корзина</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Закрыть корзину">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-center text-sm text-cream/60">Корзина пуста — добавьте товары из каталога</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 rounded-xl border border-white/10 p-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/30">
                    <Image src={item.image} alt="" fill className="object-contain p-1" sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-cream">{item.name}</p>
                    <p className="text-xs text-cream/60">{formatPrice(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button type="button" className="h-8 w-8 rounded border border-white/15" onClick={() => setQuantity(item.productId, item.quantity - 1)} aria-label="Уменьшить">−</button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button type="button" className="h-8 w-8 rounded border border-white/15" onClick={() => setQuantity(item.productId, item.quantity + 1)} aria-label="Увеличить">+</button>
                      <button type="button" className="ml-auto text-xs text-cream/50" onClick={() => removeItem(item.productId)}>
                        Удалить
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={submit} className="border-t border-white/10 p-4">
          <p className="mb-3 text-lg font-semibold text-cream">Итого: {formatPrice(total)}</p>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Имя"
            className="mb-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-cream"
          />
          <input
            required
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="Телефон"
            inputMode="tel"
            className="mb-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-cream"
          />
          <input
            required
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            placeholder="Адрес"
            className="mb-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-cream"
          />
          <textarea
            value={form.comment}
            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            placeholder="Комментарий"
            rows={2}
            className="mb-3 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-cream"
          />
          {error ? <p className="mb-2 text-sm text-red-300">{error}</p> : null}
          {status === "ok" ? (
            <p className="mb-2 text-sm text-emerald-300">Заявка отправлена. Мы свяжемся с вами.</p>
          ) : null}
          <button
            type="submit"
            disabled={items.length === 0 || status === "sending"}
            className="w-full rounded-full bg-burgundy py-3 text-sm font-semibold text-cream disabled:opacity-40"
          >
            {status === "sending" ? "Отправка…" : "Оформить заявку"}
          </button>
          {items.length > 0 ? (
            <button type="button" className="mt-2 w-full text-xs text-cream/50" onClick={clear}>
              Очистить корзину
            </button>
          ) : null}
        </form>
      </aside>
    </>
  );
}