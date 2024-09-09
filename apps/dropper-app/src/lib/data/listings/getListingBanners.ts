import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
};

export async function getListingBanners({ supabase }: Options) {
  try {
    const { data, error } = await supabase
      .from("listing_banners")
      .select()
      .eq("enabled", true)
      .order("order", { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
