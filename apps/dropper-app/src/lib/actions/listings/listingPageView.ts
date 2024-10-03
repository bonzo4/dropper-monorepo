"use server";

import { ListingPageData } from "@/lib/data/listings/getListingPage";
import { createSupabaseService } from "@repo/lib/supabase";

type Options = {
  listing: ListingPageData;
};

export async function listingPageView({ listing }: Options) {
  const supabase = await createSupabaseService();

  if (!listing.stats) return;

  const { error } = await supabase
    .from("listing_stats")
    .update({
      views: listing.stats.views + 1,
    })
    .eq("listing_id", listing.id);

  if (error) {
    console.error("Error updating listing stats", error);
  }
}
