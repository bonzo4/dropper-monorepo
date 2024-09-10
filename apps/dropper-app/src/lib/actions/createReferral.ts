"use server";
import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  userId: string;
  referral: string;
};

export async function createReferral({ supabase, userId, referral }: Options) {
  try {
    const { data, error } = await supabase
      .from("dropmans_view")
      .select("user_id")
      .eq("referral_id", referral)
      .single();

    if (error) {
      throw new Error("Couldn't find referral: " + error.message);
    }

    if (!data.user_id) {
      throw new Error("Referral not found");
    }

    await supabase.from("direct_referrals").insert({
      user_id: userId,
      referrer_id: data.user_id,
    });
  } catch (error: any) {
    console.log(error.message);
  }
}
