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

// Chat that receives every order. Safe to keep in code (it is only an ID).
const ORDER_CHAT_ID = "7599464185";

export const sendTelegramOrder = createServerFn({ method: "POST" })
  .validator((input) => orderSchema.parse(input))
  .handler(async ({ data }) => {
    const text = `🚀 New OxynHost Order!\n\n• Plan: ${data.plan}\n\n• Name: ${data.name}\n\n• Contact: ${data.contact}`;
    const chatId = process.env["TELEGRAM_ORDER_CHAT_ID"] || ORDER_CHAT_ID;

    // Preferred path: plain Telegram Bot API with a bot token.
    // Works anywhere (Vercel included) as long as TELEGRAM_BOT_TOKEN is set.
    const botToken = process.env["TELEGRAM_BOT_TOKEN"];
    if (botToken) {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
      const body = await res.text();
      if (!res.ok) {
        console.error(`Telegram order failed [${res.status}]: ${body}`);
        throw new Error("We could not send your order. Please try again.");
      }
      const parsed = JSON.parse(body) as { ok?: boolean; description?: string };
      if (!parsed.ok) throw new Error(parsed.description ?? "Telegram rejected the order");
      return { success: true };
    }

    // Fallback path: Lovable connector gateway (used inside Lovable preview).
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const telegramKey = process.env["TELEGRAM_API_KEY"];
    if (!lovableKey || !telegramKey) throw new Error("Order delivery is not configured");

    const response = await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": telegramKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat_id: chatId, text }),
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
