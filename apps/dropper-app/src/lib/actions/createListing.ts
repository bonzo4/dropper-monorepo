"use server";

import { createSupabaseServer } from "../supabase/server";
import { ListingInsert } from "@repo/types/listings";

type Options = {
  listing: string;
  creatorKey: string;
  tx: string;
};

export async function createListing({ listing, creatorKey, tx }: Options) {
  const supabase = createSupabaseServer();

  const listingInsert = JSON.parse(listing) as ListingInsert;
  const { error } = await supabase.from("listings").insert({
    ...listingInsert,
    creator_key: creatorKey,
    tx_string: tx,
  });

  if (error) return JSON.stringify({ status: "error", error: error.message });

  return JSON.stringify({ status: "success" });
}
