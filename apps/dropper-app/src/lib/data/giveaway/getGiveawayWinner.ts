import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  id: number;
  userId: string | null;
};

export async function getGiveawayWinner({ supabase, id, userId }: Options) {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch giveaway winner");
    }

    const { data, error } = await supabase
      .from("giveaway_winners")
      .select("*")
      .eq("giveaway_id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    return null;
  }
}
