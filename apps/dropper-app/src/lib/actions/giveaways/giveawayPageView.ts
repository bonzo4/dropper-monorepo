"use server";

import { GiveawayPageData } from "@/lib/data/giveaway/getGiveawayPage";
import { createSupabaseService } from "@repo/lib/supabase";

type Options = {
  giveaway: GiveawayPageData;
};

export async function giveawayPageView({ giveaway }: Options) {
  const supabase = await createSupabaseService();

  const totalViews = giveaway.giveaway_stats?.total_views;
  const periodViews = giveaway.giveaway_stats?.period_views;
  if (!totalViews || !periodViews) return;

  const { error } = await supabase
    .from("giveaway_stats")
    .update({
      total_views: totalViews + 1,
      period_views: periodViews + 1,
    })
    .eq("giveaway_stats", giveaway.id);

  if (error) {
    console.error("Error updating listing stats", error);
  }
}
