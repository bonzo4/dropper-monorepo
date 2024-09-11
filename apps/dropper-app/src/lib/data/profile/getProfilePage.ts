import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

export type ProfilePageData = Pick<
  DatabaseTypes["public"]["Tables"]["dropmans"]["Row"],
  | "username"
  | "created_at"
  | "exp_points"
  | "icon"
  | "drop_points"
  | "referral_id"
>;

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  userId: string;
};

export async function getProfilePageData({ supabase, userId }: Options) {
  try {
    const { data, error } = await supabase
      .from("dropmans")
      .select(
        "username, icon, exp_points, created_at, drop_points, referral_id"
      )
      .eq("user_id", userId)
      .single();

    if (error) throw new Error(error.message);

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
