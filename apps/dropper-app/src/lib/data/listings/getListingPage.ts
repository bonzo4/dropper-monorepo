import { ListingRow } from "@/lib/types/listing";
import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

export type ListingPageData = {
  nextListingId: number | null;
  prevListingId: number | null;
} & ListingRow;

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  id: number;
};

export async function getListingPage({ supabase, id }: Options) {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

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

  return { ...data, nextListingId, prevListingId };
}
