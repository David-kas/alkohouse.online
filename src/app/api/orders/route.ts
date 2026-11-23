import { NextResponse } from "next/server";
import { z } from "zod";
import { sendOrderToTelegram } from "@/lib/telegram";
import { appendOrderLog } from "@/lib/catalog";

const orderSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(6).max(32),
  address: z.string().min(5).max(300),
  comment: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        slug: z.string(),
        name: z.string(),
        price: z.number().positive(),
        image: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  total: z.number().positive(),
  source: z.string().default("website"),
  test: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Проверьте поля формы" }, { status: 400 });
    }

    const testMode =
      parsed.data.test === true || process.env.TELEGRAM_TEST_MODE === "true" || process.env.NODE_ENV !== "production";

    const calcTotal = parsed.data.items.reduce((s, i) => s + i.price * i.quantity, 0);
    if (Math.abs(calcTotal - parsed.data.total) > 1) {
      return NextResponse.json({ success: false, message: "Неверная сумма заказа" }, { status: 400 });
    }

    const result = await sendOrderToTelegram(
      {
        ...parsed.data,
        comment: parsed.data.comment || "",
        total: calcTotal,
      },
      testMode,
    );

    if (!result.ok) {
      if (result.error === "TELEGRAM_NOT_CONFIGURED") {
        return NextResponse.json(
          {
            success: false,
            message: "Telegram не настроен. Задайте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json({ success: false, message: "Не удалось отправить в Telegram" }, { status: 502 });
    }

    await appendOrderLog({ ...parsed.data, total: calcTotal, createdAt: new Date().toISOString(), testMode });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Ошибка сервера" }, { status: 500 });
  }
}