"use server";

import { createSupabaseServer } from "../supabase/server";

type Options = {
  listingId: number;
  payerKey: string;
  tx: string;
};

export async function createListingBump({ listingId, payerKey, tx }: Options) {
  const supabase = createSupabaseServer();

  const { error } = await supabase.from("listing_bumps").insert({
    listing_id: listingId,
    payer_key: payerKey,
    tx_string: tx,
  });

  console.log(error);

  if (error) return JSON.stringify({ status: "error", error: error.message });

  return JSON.stringify({ status: "success" });
}
