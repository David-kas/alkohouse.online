"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PHONE, PHONE_TEL, SITE_NAME } from "@/lib/constants";
import { useCart } from "@/components/providers/CartProvider";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/categories";

const NAV = [
  { href: "#catalog", label: "Каталог" },
  { href: "#categories", label: "Категории" },
  { href: "#geo", label: "Районы и метро" },
  { href: "#about", label: "О сервисе" },
  { href: "#contacts", label: "Контакты" },
];

export function Header() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-graphite/90 backdrop-blur-md transition-all ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2 text-cream" aria-label={SITE_NAME}>
            <img src="/logo.svg" alt="" width={36} height={36} className="h-9 w-9" />
            <span className="font-display text-lg font-semibold tracking-tight">{SITE_NAME}</span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex" aria-label="Основное меню">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-cream/80 transition hover:text-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <a
              href={`tel:${PHONE_TEL}`}
              className="hidden rounded-full border border-gold/40 px-3 py-1.5 text-sm text-gold transition hover:bg-gold/10 md:inline-flex"
            >
              {PHONE}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative rounded-full bg-burgundy px-3 py-2 text-sm font-medium text-cream"
              aria-label="Открыть корзину"
            >
              Корзина
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-graphite">
                  {count}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              className="rounded-lg border border-white/15 p-2 text-cream lg:hidden"
              aria-label="Меню"
              onClick={() => setMobileOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <h2 id="categories" className="sr-only">
        Категории
      </h2>

      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-[min(100%,320px)] flex-col bg-graphite shadow-2xl transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <span className="font-display text-lg text-cream">Меню</span>
          <button type="button" onClick={() => setMobileOpen(false)} aria-label="Закрыть">
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-cream/90 hover:bg-white/5"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <p className="mt-4 px-3 text-xs uppercase tracking-wide text-cream/50">Категории</p>
          {CATEGORY_ORDER.map((cat) => (
            <a
              key={cat}
              href={`#catalog-${cat}`}
              className="rounded-lg px-3 py-2 text-sm text-cream/80"
              onClick={() => setMobileOpen(false)}
            >
              {CATEGORY_LABELS[cat]}
            </a>
          ))}
          <a href={`tel:${PHONE_TEL}`} className="mt-4 rounded-xl bg-burgundy px-4 py-3 text-center text-cream">
            Позвонить
          </a>
        </nav>
      </aside>
    </>
  );
}