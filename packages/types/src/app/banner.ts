import { DatabaseTypes } from "@repo/types/database";

export type BannerRow = DatabaseTypes["public"]["Tables"]["banners"]["Row"];

export type GiveawayBannerRow =
  DatabaseTypes["public"]["Tables"]["giveaway_banners"]["Row"];

export type ListingBannerRow =
  DatabaseTypes["public"]["Tables"]["listing_banners"]["Row"];
