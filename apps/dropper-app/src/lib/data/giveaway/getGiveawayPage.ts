import { GiveawayRequirementsRow, GiveawayRow } from "@/lib/types/giveaway";
import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

export type GiveawayPageData = {
  giveaway_requirements: GiveawayRequirementsRow | null;
  entryIcons: string[];
  prevGiveawayId: number | null;
  nextGiveawayId: number | null;
} & GiveawayRow;

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  id: number;
};

export async function getGiveawayPage({ supabase, id }: Options) {
  try {
    const { data, error } = await supabase
      .from("giveaways")
      .select("*, giveaway_requirements(*)")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(JSON.stringify(error));
    }

    const { data: entries } = await supabase
      .from("giveaway_entries")
      .select("user_id")
      .eq("giveaway_id", id)
      .order("created_at", { ascending: false })
      .limit(10);

    let entryIcons: string[] = [];

    if (entries) {
      await Promise.all(
        entries.map(async (entry) => {
          const { data: user } = await supabase
            .from("dropmans_view")
            .select("icon")
            .eq("user_id", entry.user_id)
            .single();
          if (user && user.icon) return entryIcons.push(user.icon);
        })
      );
    }

    let nextGiveawayId = null;
    let prevGiveawayId = null;

    const { data: next } = await supabase
      .from("giveaways")
      .select("id")
      .lt("created_at", data.created_at)
      .order("created_at", { ascending: false })
      .range(0, 0)
      .single();
    if (next) {
      nextGiveawayId = next.id;
    }

    const { data: prev } = await supabase
      .from("giveaways")
      .select("id")
      .gt("created_at", data.created_at)
      .order("created_at", { ascending: true })
      .range(0, 0)
      .single();
    if (prev) {
      prevGiveawayId = prev.id;
    }

    return {
      ...data,
      entryIcons,
      nextGiveawayId,
      prevGiveawayId,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
