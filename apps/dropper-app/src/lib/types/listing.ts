import { DatabaseTypes } from "@repo/app-types/database";

export type ListingRow = DatabaseTypes["public"]["Tables"]["listings"]["Row"];
export type ListingInsert =
  DatabaseTypes["public"]["Tables"]["listings"]["Insert"];

export type ListingBumpRow =
  DatabaseTypes["public"]["Tables"]["listing_bumps"]["Row"];
export type ListingBumpInsert =
  DatabaseTypes["public"]["Tables"]["listing_bumps"]["Insert"];

export const DEFAULT_LISTING: ListingInsert = {
  ath: 0,
  atv: 0,
  creator_key: "",
  description: "",
  dexscreener_url: null,
  holder_count: 0,
  name: "",
  ticker: "",
  tx_string: "",
  icon_url: "",
  chain: "SOL",
};
