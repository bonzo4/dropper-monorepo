import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
};

export async function getListingIds({ supabase }: Options) {
  try {
    const { data, error } = await supabase.from("listings").select("id");

    if (error) {
      throw error;
    }

    return data.map((listing) => listing.id);
  } catch (error) {
    console.error("Error fetching active giveaway ids", error);
    return [];
  }
}
