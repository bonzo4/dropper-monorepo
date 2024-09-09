"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "../../supabase/server";

type UpdateGiveawayTxOptions = {
  giveawayId: string;
  tx: string;
};

export async function updateGiveawayTx({
  giveawayId,
  tx,
}: UpdateGiveawayTxOptions) {
  const supabase = createSupabaseServer();
  const { error } = await supabase
    .from("giveaways")
    .update({ tx_string: tx })
    .match({ id: giveawayId });

  if (error) return JSON.stringify({ status: "error", error: error.message });

  revalidatePath("/", "page");

  return JSON.stringify({
    status: "ok",
  });
}
