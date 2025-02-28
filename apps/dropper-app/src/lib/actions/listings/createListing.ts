"use server";

import { createSupabaseServer } from "@repo/lib/supabase";
import { ListingInsert } from "../../types/listing";
import { getTokenData } from "@/lib/data/getTokenData";

type Options = {
  listing: string;
  creatorKey: string;
  tx: string;
};

export async function createListing({ listing, creatorKey, tx }: Options) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return JSON.stringify({
      status: "error",
      error: "Please login to create a listing",
    });

  const listingInsert = JSON.parse(listing) as ListingInsert;

  const tokenData = await getTokenData(listingInsert.token_address);

  const { error } = await supabase.from("listings").insert({
    ...listingInsert,
    creator_key: creatorKey,
    tx_string: tx,
    user_id: user.id,
    usd_price: tokenData.usdPrice,
    volume_24h: tokenData.volume24h,
    market_cap: Math.round(tokenData.marketCap),
  });

  if (error) return JSON.stringify({ status: "error", error: error.message });

  return JSON.stringify({ status: "success" });
}
