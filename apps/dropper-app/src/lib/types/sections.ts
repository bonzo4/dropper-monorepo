import { Database } from "../supabase/types";
import { AirdropRow } from "./airdrop";

export enum SectionType {
  About = "about",
  Quests = "quests",
  Community = "community",
}

export type AirdropTeamMemberRow =
  Database["public"]["Tables"]["airdrop_team_members"]["Row"];
export type AboutSectionRow =
  Database["public"]["Tables"]["airdrop_about_sections"]["Row"];
export type QuestItemRow =
  Database["public"]["Tables"]["airdrop_quest_items"]["Row"];
export type QuestRow = Database["public"]["Tables"]["airdrop_quests"]["Row"];
export type QuestSectionRow =
  Database["public"]["Tables"]["airdrop_quest_sections"]["Row"];
export type CommunityPostRow =
  Database["public"]["Tables"]["airdrop_community_posts"]["Row"];
export type CommunitySectionRow =
  Database["public"]["Tables"]["airdrop_community_sections"]["Row"];

export type AirdropPageRow = AirdropRow & {
  about_sections: (AboutSectionRow & {
    airdrop_team_members: AirdropTeamMemberRow[];
  })[];
  quest_sections: (QuestSectionRow & {
    quests: (QuestRow & { quest_items: QuestItemRow[] })[];
  })[];
  community_sections: (CommunitySectionRow & {
    community_posts: CommunityPostRow[];
  })[];
};
