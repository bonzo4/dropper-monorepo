import { telegramBot } from "@/lib/telegram";
import { numString } from "@/lib/utils/numString";
import { createSupabaseService } from "@repo/lib/supabase";
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

    if (!giveaway.set_winners_tx) {
      throw new Error("No tx string");
    }

    // const { data: winners, error: winnersError } = await supabase
    //   .from("giveaway_winners")
    //   .select("*")
    //   .eq("giveaway_id", giveaway.id);

    // if (winnersError) {
    //   throw new Error("Couldn't find winners" + winnersError.message);
    // }

    // const winnerTelegrams = (
    //   await Promise.all(
    //     winners.map(async (winner) => {
    //       const { data: telegram, error: telegramError } = await supabase
    //         .from("telegram_accounts")
    //         .select("*")
    //         .eq("user_id", winner.user_id)
    //         .single();
    //       if (telegramError) {
    //         return;
    //       }
    //       return telegram;
    //     })
    //   )
    // ).filter((winner) => winner !== undefined);

    const prizeString = `${numString(giveaway.reward_amount)} $${giveaway.token_address === "So11111111111111111111111111111111111111112" ? "SOL" : giveaway.token_address.replaceAll("$", "").slice(0, 8).toUpperCase()}`;

    const messageMarkdown =
      `🎁 *DROP ENDED*🎁\nTitle: ${giveaway.title}\nPrize: ${prizeString}\nWinners: ${giveaway.winner_amount}\n[See if you won!](https://dropper.wtf/drops/${giveaway.id})`
        .replace(/\./g, "\\.")
        .replace(/\!/g, "\\!");

    await telegramBot.api.sendMessage(
      process.env.TELEGRAM_CHAT_ID!,
      messageMarkdown,
      {
        parse_mode: "MarkdownV2",
        link_preview_options: {
          prefer_large_media: true,
          url: `https://dropper.wtf/drops/${234}`,
        },
      }
    );

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return NextResponse.json({ message: "Error" + error });
  }
}
