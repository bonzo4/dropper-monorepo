import { ListingRow, ListingStats } from "@/lib/types/listing";
import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

export type ListingPageData = {
  stats: ListingStats | null;
  nextListingId: number | null;
  prevListingId: number | null;
  userBumps: number;
} & ListingRow;

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  id: number;
  userId: string | null;
};

export async function getListingPage({ supabase, id, userId }: Options) {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { data: stats } = await supabase
    .from("listing_stats")
    .select("*")
    .eq("listing_id", id)
    .single();

  let nextListingId = null;
  let prevListingId = null;

  const { data: next } = await supabase
    .from("listings")
    .select("id")
    .lt("last_bump", data.last_bump)
    .order("last_bump", { ascending: false })
    .range(0, 0)
    .single();
  if (next) {
    nextListingId = next.id;
  }

  const { data: prev } = await supabase
    .from("listings")
    .select("id")
    .gt("last_bump", data.last_bump)
    .order("last_bump", { ascending: true })
    .range(0, 0)
    .single();
  if (prev) {
    prevListingId = prev.id;
  }

  let userBumps: number = 0;
  if (userId) {
    const { count } = await supabase
      .from("listing_bumps")
      .select(undefined, { count: "exact" })
      .eq("listing_id", id)
      .eq("user_id", userId)
      .single();
    userBumps = count || 0;
  }

  return { ...data, stats, nextListingId, prevListingId, userBumps };
}
