import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  userId: string;
};

export async function getListingStats({ supabase, userId }: Options) {
  try {
    const { data, error } = await supabase
      .from("user_listing_stats")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw new Error(error.message);

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
