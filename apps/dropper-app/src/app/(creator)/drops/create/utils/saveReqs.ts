import { DatabaseTypes } from "@repo/app-types/database";
import { GiveawayRequirementsInsert } from "@/lib/types/giveaway";
import { SupabaseClient } from "@supabase/supabase-js";

type SaveGiveawayRequirementsOptions = {
  requirements: GiveawayRequirementsInsert;
  giveawayId: number;
  supabase: SupabaseClient<DatabaseTypes>;
};

export async function saveGiveawayRequirements({
  requirements,
  giveawayId,
  supabase,
}: SaveGiveawayRequirementsOptions) {
  const { error } = await supabase
    .from("giveaway_requirements")
    .insert({ ...requirements, giveaway_id: giveawayId });

  if (error) throw error;
}
