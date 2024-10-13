import { Bot } from "grammy";

export const telegramBot = new Bot(process.env.TELEGRAM_BOT_TOKEN!, {});
