import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  slug: string;
};

export async function getAirdropPageData({ supabase, slug }: Options) {
  try {
    const { data, error } = await supabase
      .from("airdrops")
      .select(
        "*, airdrop_about_sections(*, airdrop_team_members(*)), airdrop_quest_sections(*, airdrop_quests(*, airdrop_quest_items(*))), airdrop_community_sections(*, airdrop_community_posts(*))"
      )
      .eq("slug", slug)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
