import Link from "next/link";
import { PHONE, PHONE_TEL, SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer id="contacts" className="border-t border-white/10 bg-black/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 lg:px-6">
        <div>
          <p className="font-display text-xl text-cream">{SITE_NAME}</p>
          <p className="mt-2 text-sm text-cream/70">
            Каталог алкогольных напитков в Москве. Заявки через корзину или по телефону.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gold">Контакты</p>
          <a href={`tel:${PHONE_TEL}`} className="mt-2 block text-lg text-cream hover:text-gold">
            {PHONE}
          </a>
          <a href="https://alkohouse.online" className="mt-1 block text-sm text-cream/70">
            alkohouse.online
          </a>
        </div>
        <div>
          <p className="text-sm font-semibold text-gold">Документы</p>
          <Link href="/privacy" className="mt-2 block text-sm text-cream/80 hover:text-cream">
            Политика обработки данных
          </Link>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {SITE_NAME}. Информация на сайте не является публичной офертой.
      </div>
    </footer>
  );
}