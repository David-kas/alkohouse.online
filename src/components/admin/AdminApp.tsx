"use client";

import { useCallback, useEffect, useState } from "react";
import type { CatalogData, Product } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/categories";
import { formatPrice } from "@/lib/format";

export function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/products");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const data = await res.json();
    setCatalog(data);
    setAuthed(true);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setMessage("Ошибка входа");
      return;
    }
    setPassword("");
    setMessage("");
    await load();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setCatalog(null);
  }

  async function saveProduct(p: Product) {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(p.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    if (!res.ok) {
      setMessage("Не удалось сохранить");
      return;
    }
    setMessage("Сохранено");
    await load();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Удалить товар?")) return;
    await fetch(`/api/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" });
    setSelected(null);
    await load();
  }

  async function upload(file: File) {
    const fd = new FormData();
    fd.set("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url && selected) {
      setSelected({ ...selected, image: data.url, images: [data.url] });
    }
  }

  const products =
    catalog?.products.filter((p) => {
      const q = query.toLowerCase();
      return !q || p.name.toLowerCase().includes(q);
    }) ?? [];

  if (authed === null) {
    return <p className="p-8 text-cream/60">Загрузка…</p>;
  }

  if (!authed) {
    return (
      <form onSubmit={login} className="mx-auto mt-20 max-w-sm space-y-4 rounded-2xl border border-white/10 p-6">
        <h1 className="font-display text-xl text-cream">Вход в админку</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-cream"
          placeholder="Пароль"
        />
        {message ? <p className="text-sm text-red-300">{message}</p> : null}
        <button type="submit" className="w-full rounded-full bg-burgundy py-2 text-cream">
          Войти
        </button>
      </form>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-cream">Админ-панель</h1>
        <div className="flex gap-2">
          <a href="/api/admin/export?format=json" className="rounded-lg border border-white/15 px-3 py-1 text-sm text-cream">
            Экспорт JSON
          </a>
          <button type="button" onClick={logout} className="rounded-lg border border-white/15 px-3 py-1 text-sm text-cream">
            Выйти
          </button>
        </div>
      </div>
      {message ? <p className="mt-2 text-sm text-gold">{message}</p> : null}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск"
        className="mt-6 w-full max-w-md rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-cream"
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ul className="max-h-[70vh] space-y-2 overflow-y-auto rounded-xl border border-white/10 p-3">
          {products.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setSelected(p)}
                className="flex w-full justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-white/5"
              >
                <span className="text-cream">{p.name}</span>
                <span className="text-cream/50">{formatPrice(p.price)}</span>
              </button>
            </li>
          ))}
        </ul>
        {selected ? (
          <div className="space-y-3 rounded-xl border border-white/10 p-4">
            <input
              value={selected.name}
              onChange={(e) => setSelected({ ...selected, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-cream"
            />
            <select
              value={selected.category}
              onChange={(e) => setSelected({ ...selected, category: e.target.value as Product["category"] })}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-cream"
            >
              {CATEGORY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={selected.price}
              onChange={(e) => setSelected({ ...selected, price: Number(e.target.value) })}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-cream"
            />
            <label className="flex items-center gap-2 text-sm text-cream">
              <input
                type="checkbox"
                checked={selected.inStock}
                onChange={(e) => setSelected({ ...selected, inStock: e.target.checked })}
              />
              В наличии
            </label>
            <textarea
              value={selected.description}
              onChange={(e) => setSelected({ ...selected, description: e.target.value })}
              rows={5}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-cream"
            />
            <input
              value={selected.seoTitle || ""}
              onChange={(e) => setSelected({ ...selected, seoTitle: e.target.value })}
              placeholder="SEO Title"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-cream"
            />
            <input
              value={selected.seoDescription || ""}
              onChange={(e) => setSelected({ ...selected, seoDescription: e.target.value })}
              placeholder="SEO Description"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-cream"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />
            <img src={selected.image} alt="" className="h-32 w-32 rounded-lg object-contain bg-black/30" />
            <div className="flex gap-2">
              <button type="button" onClick={() => saveProduct(selected)} className="rounded-full bg-burgundy px-4 py-2 text-sm text-cream">
                Сохранить
              </button>
              <button type="button" onClick={() => deleteProduct(selected.id)} className="rounded-full border border-red-400/50 px-4 py-2 text-sm text-red-200">
                Удалить
              </button>
            </div>
          </div>
        ) : (
          <p className="text-cream/50">Выберите товар</p>
        )}
      </div>
    </div>
  );
}