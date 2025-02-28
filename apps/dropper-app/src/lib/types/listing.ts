import { DatabaseTypes } from "@repo/app-types/database";

export type ListingRow = DatabaseTypes["public"]["Tables"]["listings"]["Row"];
export type ListingInsert =
  DatabaseTypes["public"]["Tables"]["listings"]["Insert"];

export type ListingStats =
  DatabaseTypes["public"]["Tables"]["listing_stats"]["Row"];

export type ListingBumpRow =
  DatabaseTypes["public"]["Tables"]["listing_bumps"]["Row"] & {
    user?: string;
  };

export type ListingCommentRow =
  DatabaseTypes["public"]["Tables"]["listing_comments"]["Row"] & {
    user?: string | null;
    icon_url?: string | null;
    is_upvote?: boolean;
    bump_count?: number;
  };

export type ListingCommentVoteRow =
  DatabaseTypes["public"]["Tables"]["listing_comment_votes"]["Row"];

export type ListingBumpInsert =
  DatabaseTypes["public"]["Tables"]["listing_bumps"]["Insert"];

export const DEFAULT_LISTING: ListingInsert = {
  usd_price: 0,
  volume_24h: 0,
  creator_key: "",
  description: "",
  dexscreener_url: null,
  holder_count: 0,
  name: "",
  ticker: "",
  tx_string: "",
  icon_url: "",
  chain: "SOL",
  token_address: "",
  market_cap: 0,
  is_cto: false,
};
