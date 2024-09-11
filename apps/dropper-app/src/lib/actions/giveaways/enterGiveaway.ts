"use server";

import { PublicKey } from "@solana/web3.js";
import { createSupabaseServer } from "../../supabase/server";
import { revalidatePath } from "next/cache";

type EnterGiveawayOptions = {
  userId: string;
  giveawayId: number;
  walletKey: string;
};

export async function enterGiveaway({
  userId,
  giveawayId,
  walletKey,
}: EnterGiveawayOptions) {
  const supabase = createSupabaseServer();

  const { error } = await supabase.from("giveaway_entries").insert({
    user_id: userId,
    giveaway_id: giveawayId,
    wallet_key: walletKey,
  });

  if (error) {
    console.error(error);
    return JSON.stringify({
      status: "error",
      message: `Something went wrong entering this drop`,
    });
  }

  revalidatePath(`/drops/${giveawayId}`, "page");

  return JSON.stringify({
    status: "ok",
  });
}
