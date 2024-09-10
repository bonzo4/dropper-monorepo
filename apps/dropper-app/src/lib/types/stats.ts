import { DatabaseTypes } from "@repo/app-types/database";

export type GiveawayStats =
  DatabaseTypes["public"]["Tables"]["user_giveaway_stats"]["Row"];
export type ListingStats =
  DatabaseTypes["public"]["Tables"]["user_listing_stats"]["Row"];

export type UserPoints =
  DatabaseTypes["public"]["Tables"]["user_points"]["Row"];
