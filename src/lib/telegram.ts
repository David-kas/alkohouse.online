import type { OrderPayload } from "./types";
import { PHONE } from "./constants";

export async function sendOrderToTelegram(order: OrderPayload, testMode: boolean): Promise<{ ok: boolean; error?: string }> {
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chatId = testMode
    ? (process.env.TELEGRAM_TEST_CHAT_ID || process.env.TELEGRAM_CHAT_ID || "").trim()
    : (process.env.TELEGRAM_CHAT_ID || "").trim();

  if (!token || !chatId) {
    return { ok: false, error: "TELEGRAM_NOT_CONFIGURED" };
  }

  const lines = order.items.map(
    (i) => `• ${i.name} × ${i.quantity} = ${(i.price * i.quantity).toLocaleString("ru-RU")} ₽`,
  );

  const text = [
    `🛒 Заявка AlkoHouse${testMode ? " (тест)" : ""}`,
    `👤 ${order.name}`,
    `📞 ${order.phone}`,
    `📍 ${order.address}`,
    order.comment ? `💬 ${order.comment}` : "",
    "",
    "Товары:",
    ...lines,
    "",
    `💰 Итого: ${order.total.toLocaleString("ru-RU")} ₽`,
    `🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`,
    `📱 Источник: ${order.source}`,
    `☎️ Сайт: ${PHONE}`,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: body || "TELEGRAM_SEND_FAILED" };
  }

  return { ok: true };
}