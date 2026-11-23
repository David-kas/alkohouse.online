import { PHONE_TEL } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,38,53,0.35),_transparent_55%)]" />
      <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gold">Premium catalog · Москва</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-cream md:text-5xl lg:text-6xl">
            Доставка алкоголя в Москве — каталог напитков AlkoHouse
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/75">
            Водка, виски, вино, коньяк, пиво и игристое в одном современном каталоге. Выберите позиции, соберите
            корзину и оформите заявку — или позвоните, если нужна консультация по ассортименту.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#catalog"
              className="rounded-full bg-burgundy px-6 py-3 text-sm font-semibold text-cream shadow-lg shadow-burgundy/30 transition hover:bg-burgundy/90"
            >
              Смотреть каталог
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="rounded-full border border-gold/50 px-6 py-3 text-sm font-semibold text-gold transition hover:bg-gold/10"
            >
              Позвонить
            </a>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface to-graphite shadow-2xl">
      <img
        src="/images/hero-whiskey-bg.webp"
        alt=""
        className="h-full w-full object-cover opacity-80"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur">
        <p className="text-sm text-cream/90">147 позиций в каталоге</p>
        <p className="mt-1 text-xs text-cream/60">Цены и наличие обновляются в режиме каталога</p>
      </div>
    </div>
  );
}