import { faqJsonLd } from "@/lib/schema";

const FAQS = [
  {
    question: "Как оформить заявку на доставку алкоголя?",
    answer:
      "Добавьте товары в корзину на главной, укажите имя, телефон и адрес, отправьте форму. Сервер подтверждает отправку. Можно также позвонить по телефону +7 (925) 121-99-72.",
  },
  {
    question: "Сохраняется ли корзина при обновлении страницы?",
    answer: "Да, состав корзины хранится в localStorage браузера до оформления или очистки.",
  },
  {
    question: "Откуда берутся цены?",
    answer: "Цены импортированы из прежнего каталога alkohouse.online и обновляются через защищённую админ-панель.",
  },
  {
    question: "Работает ли сайт на компьютере?",
    answer: "Да, публичные страницы доступны на мобильных и десктопах без блокировки по User-Agent.",
  },
];

export function FaqSection() {
  const jsonLd = faqJsonLd(FAQS);
  return (
    <section className="mx-auto max-w-3xl px-4 pb-20 lg:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 className="font-display text-2xl text-cream">Вопросы и ответы</h2>
      <dl className="mt-6 space-y-6">
        {FAQS.map((f) => (
          <div key={f.question}>
            <dt className="font-medium text-gold">{f.question}</dt>
            <dd className="mt-2 text-sm text-cream/75">{f.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}