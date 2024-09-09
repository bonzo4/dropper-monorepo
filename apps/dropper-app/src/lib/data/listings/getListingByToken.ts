import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  token: string;
};

export async function getListingByToken({ supabase, token }: Options) {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("token", token)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
