import { DatabaseTypes } from "@repo/app-types/database";

export type AirdropBannerRow =
  DatabaseTypes["public"]["Tables"]["airdrop_banners"]["Row"];

export type GiveawayBannerRow =
  DatabaseTypes["public"]["Tables"]["giveaway_banners"]["Row"];

export type ListingBannerRow =
  DatabaseTypes["public"]["Tables"]["listing_banners"]["Row"];
