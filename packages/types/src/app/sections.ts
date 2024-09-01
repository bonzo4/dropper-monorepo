import { DatabaseTypes } from "@repo/types/database";
import { AirdropRow } from "./airdrop";

export enum SectionType {
  About = "about",
  Quests = "quests",
  Community = "community",
}

export type AirdropTeamMemberRow =
  DatabaseTypes["public"]["Tables"]["airdrop_team_members"]["Row"];
export type AboutSectionRow =
  DatabaseTypes["public"]["Tables"]["airdrop_about_sections"]["Row"];
export type QuestItemRow =
  DatabaseTypes["public"]["Tables"]["airdrop_quest_items"]["Row"];
export type QuestRow =
  DatabaseTypes["public"]["Tables"]["airdrop_quests"]["Row"];
export type QuestSectionRow =
  DatabaseTypes["public"]["Tables"]["airdrop_quest_sections"]["Row"];
export type CommunityPostRow =
  DatabaseTypes["public"]["Tables"]["airdrop_community_posts"]["Row"];
export type CommunitySectionRow =
  DatabaseTypes["public"]["Tables"]["airdrop_community_sections"]["Row"];

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
