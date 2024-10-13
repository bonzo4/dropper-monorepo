import { telegramBot } from "@/lib/telegram";
import { numString } from "@/lib/utils/numString";
import {
  createSupabaseServer,
  createSupabaseService,
} from "@repo/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params: { id } }: { params: { id: number } }
) {
  try {
    if (request.headers.get("password") !== process.env.TELEGRAM_PASSWORD)
      throw new Error("Unauthorized");
    const supabase = await createSupabaseService();

    const { data: giveaway, error } = await supabase
      .from("giveaways")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error("Couldn't find giveaway" + error.message);
    }

    if (!giveaway.tx_string) {
      throw new Error("No tx string");
    }

    const remainingTime = new Date(giveaway.end_time).getTime() - Date.now();
    const remainingTimeString = new Date(remainingTime)
      .toISOString()
      .slice(11, 19);

    const prizeString = `${numString(giveaway.reward_amount)} $${giveaway.token_address === "So11111111111111111111111111111111111111112" ? "SOL" : giveaway.token_address.replaceAll("$", "").slice(0, 8).toUpperCase()}`;

    const messageMarkdown =
      `*🚨 ALERT! NEW DROP! 🚨*\nTitle: ${giveaway.title}\nPrize: ${prizeString}\nWinners: ${giveaway.winner_amount}\nEnds in: ${remainingTimeString}\n[🎁 ENTER NOW 🎁](https://dropper.wtf/drops/${giveaway.id})`
        .replace(/\./g, "\\.")
        .replace(/\!/g, "\\!");

    await telegramBot.api.sendMessage(
      process.env.TELEGRAM_CHAT_ID!,
      messageMarkdown,
      {
        parse_mode: "MarkdownV2",
        link_preview_options: {
          prefer_large_media: true,
          url: `https://dropper.wtf/drops/${giveaway.id}`,
        },
      }
    );

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return NextResponse.json({ message: "Error" + error });
  }
}
