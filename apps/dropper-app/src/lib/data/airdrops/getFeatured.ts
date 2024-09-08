import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
};

export async function getFeaturedAirdrops({ supabase }: Options) {
  try {
    const { data, error } = await supabase
      .from("airdrops")
      .select(
        "id, title, symbol, icon_url, questers, likelihood, blockchain, est_airdrop_size, category, sentiment, description, slug"
      )
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
