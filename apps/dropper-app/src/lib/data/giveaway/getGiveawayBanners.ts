import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
};

export async function getGiveawayBanners({ supabase }: Options) {
  try {
    const query = supabase
      .from("giveaway_banners")
      .select("*")
      .order("order", { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
