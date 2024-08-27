import { Database } from "../supabase/types";

export type ListingRow = Database["public"]["Tables"]["listings"]["Row"];
export type ListingInsert = Database["public"]["Tables"]["listings"]["Insert"];

export type ListingBumpRow =
  Database["public"]["Tables"]["listing_bumps"]["Row"];
export type ListingBumpInsert =
  Database["public"]["Tables"]["listing_bumps"]["Insert"];

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
};
