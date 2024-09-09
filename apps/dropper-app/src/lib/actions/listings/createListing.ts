"use server";

import { createSupabaseServer } from "../../supabase/server";
import { ListingInsert } from "../../types/listing";

type Options = {
  listing: string;
  creatorKey: string;
  tx: string;
};

export async function createListing({ listing, creatorKey, tx }: Options) {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return JSON.stringify({
      status: "error",
      error: "Please login to create a listing",
    });

  const listingInsert = JSON.parse(listing) as ListingInsert;
  const { error } = await supabase.from("listings").insert({
    ...listingInsert,
    creator_key: creatorKey,
    tx_string: tx,
    user_id: user.id,
  });

  if (error) return JSON.stringify({ status: "error", error: error.message });

  return JSON.stringify({ status: "success" });
}
