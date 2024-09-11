"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "../../supabase/server";

type Options = {
  listingId: number;
  payerKey: string;
  tx: string;
};

export async function createListingBump({ listingId, payerKey, tx }: Options) {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return JSON.stringify({ status: "error", error: "Please login to bump" });

  const { error } = await supabase.from("listing_bumps").insert({
    listing_id: listingId,
    payer_key: payerKey,
    tx_string: tx,
    user_id: user.id,
  });

  if (error) return JSON.stringify({ status: "error", error: error.message });

  return JSON.stringify({ status: "success" });
}
