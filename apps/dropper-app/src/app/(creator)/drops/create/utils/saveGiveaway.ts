import { DatabaseTypes } from "@repo/app-types/database";
import { GiveawayInsert } from "@/lib/types/giveaway";
import { PublicKey } from "@solana/web3.js";
import { SupabaseClient } from "@supabase/supabase-js";

type SaveGiveawayOptions = {
  giveaway: GiveawayInsert;
  supabase: SupabaseClient<DatabaseTypes>;
  giveawayType: "solana" | "spl";
  creatorKey: PublicKey;
};

export async function saveGiveaway({
  giveaway,
  supabase,
  giveawayType,
  creatorKey,
}: SaveGiveawayOptions) {
  if (giveawayType === "solana") delete giveaway.token_address;
  const now = new Date();
  now.setMinutes(now.getMinutes() + 1);
  now.setSeconds(0, 0);
  const startDateMs = now.getTime() + 1000 * 60;
  const endDateMs = startDateMs + 1000 * 60;
  const { data, error } = await supabase
    .from("giveaways")
    .insert({
      ...giveaway,
      start_time: new Date(startDateMs).toISOString(),
      end_time: new Date(endDateMs).toISOString(),
      creator_key: creatorKey.toBase58(),
    })
    .select("id")
    .single();

  if (error) throw error;

  return data.id;
}

type UpdateGiveawayTxOptions = {
  supabase: SupabaseClient<DatabaseTypes>;
  giveawayId: number;
  tx: string;
};

export async function updateGiveawayTx({
  supabase,
  giveawayId,
  tx,
}: UpdateGiveawayTxOptions) {
  const { error } = await supabase
    .from("giveaways")
    .update({ tx })
    .eq("id", giveawayId);

  if (error) throw new Error(error.message);
}
