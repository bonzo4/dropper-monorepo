import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
};

export async function getActiveGiveawayIds({ supabase }: Options) {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("giveaways")
      .select("id")
      .neq("tx_string", null)
      .lt("start_time", now)
      .gt("end_time", now);

    if (error) {
      throw error;
    }

    return data.map((giveaway) => giveaway.id);
  } catch (error) {
    console.error("Error fetching active giveaway ids", error);
    return [];
  }
}
