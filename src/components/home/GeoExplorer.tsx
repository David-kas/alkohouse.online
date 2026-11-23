"use client";

import { useMemo, useState } from "react";
import { MOSCOW_DISTRICTS, OKRUGS } from "@/data/moscow-districts";
import { METRO_STATIONS } from "@/data/moscow-metro";

export function GeoExplorer() {
  const [districtQuery, setDistrictQuery] = useState("");
  const [okrug, setOkrug] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState(MOSCOW_DISTRICTS[0]);
  const [metroQuery, setMetroQuery] = useState("");
  const [selectedMetro, setSelectedMetro] = useState(METRO_STATIONS[0]);

  const districts = useMemo(() => {
    return MOSCOW_DISTRICTS.filter((d) => {
      const q = districtQuery.trim().toLowerCase();
      if (okrug !== "all" && d.okrug !== okrug) return false;
      if (!q) return true;
      return d.name.toLowerCase().includes(q) || d.okrug.toLowerCase().includes(q);
    });
  }, [districtQuery, okrug]);

  const metro = useMemo(() => {
    const q = metroQuery.trim().toLowerCase();
    if (!q) return METRO_STATIONS;
    return METRO_STATIONS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.line.toLowerCase().includes(q),
    );
  }, [metroQuery]);

  return (
    <section id="geo" className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
      <h2 className="font-display text-3xl text-cream">Районы и метро Москвы</h2>
      <p className="mt-2 max-w-2xl text-cream/70">
        Навигация по городу на одной странице: выберите район или станцию, чтобы понять контекст адреса. Отдельные
        пустые страницы для каждой улицы не создаются — информация собрана здесь.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 className="font-display text-xl text-gold">Районы по округам</h3>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              value={districtQuery}
              onChange={(e) => setDistrictQuery(e.target.value)}
              placeholder="Поиск района"
              className="w-full rounded-xl border border-white/10 bg-graphite px-3 py-2 text-sm text-cream"
            />
            <select
              value={okrug}
              onChange={(e) => setOkrug(e.target.value)}
              className="rounded-xl border border-white/10 bg-graphite px-3 py-2 text-sm text-cream"
            >
              <option value="all">Все округа</option>
              {OKRUGS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <ul className="mt-4 max-h-56 space-y-1 overflow-y-auto pr-1">
            {districts.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setSelectedDistrict(d)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                    selectedDistrict.id === d.id ? "bg-burgundy/30 text-cream" : "text-cream/80 hover:bg-white/5"
                  }`}
                >
                  {d.name} <span className="text-cream/40">· {d.okrug}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl border border-gold/20 bg-gold/5 p-4 text-sm text-cream/85">
            <p className="font-semibold text-cream">{selectedDistrict.name}</p>
            <p className="mt-2">{selectedDistrict.note}</p>
            <p className="mt-2 text-xs text-cream/50">
              Точные зоны обслуживания уточняйте по телефону при оформлении заявки.
            </p>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 className="font-display text-xl text-gold">Станции метро</h3>
          <input
            value={metroQuery}
            onChange={(e) => setMetroQuery(e.target.value)}
            placeholder="Поиск станции или линии"
            className="mt-4 w-full rounded-xl border border-white/10 bg-graphite px-3 py-2 text-sm text-cream"
          />
          <ul className="mt-4 max-h-56 space-y-1 overflow-y-auto pr-1">
            {metro.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSelectedMetro(s)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                    selectedMetro.id === s.id ? "bg-burgundy/30 text-cream" : "text-cream/80 hover:bg-white/5"
                  }`}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.lineColor }} aria-hidden />
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl border border-white/10 p-4 text-sm text-cream/85">
            <p className="font-semibold text-cream">{selectedMetro.name}</p>
            <p className="mt-1 text-xs text-cream/50">{selectedMetro.line}</p>
            <p className="mt-2">{selectedMetro.hint}</p>
          </div>
        </article>
      </div>
    </section>
  );
}