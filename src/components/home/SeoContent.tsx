import { homeArticleSections } from "@/content/home-article";
import { faqJsonLd } from "@/lib/schema";
import { PHONE, PHONE_TEL } from "@/lib/constants";
import { ArticleBlocks } from "./ArticleBlocks";

const FAQ_FOR_SCHEMA = [
  {
    question: "Как оформить заказ на alkohouse.online?",
    answer:
      "Добавьте товары в корзину, укажите имя, телефон и адрес и отправьте заявку. Дождитесь подтверждения по телефону или позвоните сразу на +7 (925) 121-99-72.",
  },
  {
    question: "Можно ли заказать алкоголь с доставкой в свой район Москвы?",
    answer:
      "Да, при оформлении заявки укажите полный адрес и район. Зону и время согласуют при подтверждении заказа.",
  },
  {
    question: "Работает ли каталог ночью?",
    answer:
      "Каталог и форма заявки доступны круглосуточно. Время привоза зависит от адреса и согласовывается оператором.",
  },
];

export function SeoContent() {
  const faqLd = faqJsonLd(FAQ_FOR_SCHEMA);

  return (
    <section id="about" className="mx-auto max-w-3xl px-4 py-16 lg:max-w-4xl lg:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <p className="text-sm text-cream/60">
        Полезный материал о выборе напитков в Москве. Телефон:{" "}
        <a href={`tel:${PHONE_TEL}`} className="text-gold underline">
          {PHONE}
        </a>
        . Каталог —{" "}
        <a href="#catalog" className="text-gold underline">
          выше на странице
        </a>
        .
      </p>

      <article className="mt-10 space-y-14 border-t border-white/10 pt-12">
        {homeArticleSections.map((section) => (
          <section key={section.id} aria-labelledby={`article-${section.id}`}>
            <h2 id={`article-${section.id}`} className="font-display text-2xl text-gold md:text-3xl">
              {section.h2}
            </h2>
            <div className="mt-4">
              <ArticleBlocks blocks={section.blocks} />
            </div>
            {section.details ? (
              <details className="group mt-8 rounded-xl border border-white/10 bg-black/20 p-4 open:bg-black/30">
                <summary className="cursor-pointer list-none font-medium text-cream marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="text-gold group-open:text-cream">{section.details.title}</span>
                  <span className="ml-2 text-xs text-cream/40">развернуть</span>
                </summary>
                <div className="mt-4 border-t border-white/10 pt-4">
                  <ArticleBlocks blocks={section.details.blocks} />
                </div>
              </details>
            ) : null}
          </section>
        ))}
      </article>
    </section>
  );
}