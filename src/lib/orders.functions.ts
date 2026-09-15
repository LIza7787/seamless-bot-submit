import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const isValidContact = (value: string) => {
  const v = value.trim();
  return /^@?[A-Za-z0-9_]{4,32}$/.test(v) || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
};

const orderSchema = z.object({
  plan: z.enum(["Website Hosting", "Virtual Servers", "Dedicated Servers"]),
  name: z.string().trim().min(2).max(100),
  contact: z.string().trim().min(3).max(255).refine(isValidContact, "Enter a valid email or Telegram username"),
});

export const sendTelegramOrder = createServerFn({ method: "POST" })
  .validator((input) => orderSchema.parse(input))
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const telegramKey = process.env["TELEGRAM_API_KEY"];
    const chatId = process.env["TELEGRAM_ORDER_CHAT_ID"];
    if (!lovableKey || !telegramKey || !chatId) throw new Error("Order delivery is not configured");

    const response = await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": telegramKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🚀 New OxynHost Order!\n\n• Plan: ${data.plan}\n\n• Name: ${data.name}\n\n• Contact: ${data.contact}`,
      }),
    });
    const body = await response.text();
    if (!response.ok) {
      console.error(`Telegram order failed [${response.status}]: ${body}`);
      throw new Error("We could not send your order. Please try again.");
    }
    const parsed = JSON.parse(body) as { ok?: boolean; error?: string };
    if (!parsed.ok) throw new Error(parsed.error ?? "Telegram rejected the order");
    return { success: true };
  });