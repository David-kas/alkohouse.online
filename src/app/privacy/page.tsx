import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика обработки данных",
  description: "Политика обработки персональных данных AlkoHouse.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-28 lg:px-6">
      <h1 className="font-display text-3xl text-cream">Политика обработки персональных данных</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-cream/80">
        <p>
          Настоящая политика описывает порядок обработки данных, которые вы передаёте при оформлении заявки на сайте
          alkohouse.online: имя, телефон, адрес и комментарий.
        </p>
        <p>
          Данные используются только для связи по заказу и передаются в защищённые серверные каналы (включая
          уведомления в Telegram при настроенных переменных окружения). Мы не публикуем персональные данные в открытом
          доступе.
        </p>
        <p>
          По вопросам обработки данных свяжитесь по телефону +7 (925) 121-99-72. Вы можете запросить уточнение или
          удаление данных, связавшись с оператором.
        </p>
      </div>
    </article>
  );
}