import { DatabaseTypes } from "@repo/app-types/database";

export type GiveawayRow = DatabaseTypes["public"]["Tables"]["giveaways"]["Row"];
export type GiveawayRequirementsRow =
  DatabaseTypes["public"]["Tables"]["giveaway_requirements"]["Row"];

export type GiveawayStatsRow =
  DatabaseTypes["public"]["Tables"]["giveaway_stats"]["Row"];

export type GiveawayInsert =
  DatabaseTypes["public"]["Tables"]["giveaways"]["Insert"];
export type GiveawayRequirementsInsert =
  DatabaseTypes["public"]["Tables"]["giveaway_requirements"]["Insert"];

export type GiveawayEntryRow =
  DatabaseTypes["public"]["Tables"]["giveaway_entries"]["Row"];
export type GiveawayWinnerRow =
  DatabaseTypes["public"]["Tables"]["giveaway_winners"]["Row"];

export const DEFAULT_GIVEAWAY: GiveawayInsert = {
  title: "",
  description: "",
  icon_url: "",
  badges: [],
  usd_value: 0,
  end_time: "",
  reward_amount: 0.1,
  start_time: "",
  ticker: "",
  winner_amount: 5,
  entries: 0,
  creator_key: "",
  user_id: "",
};

export const DEFAULT_GIVEAWAY_REQUIREMENTS: GiveawayRequirementsInsert = {
  giveaway_id: 0,
  twitter_url: null,
  tweet_url: null,
  telegram_url: null,
  discord_url: null,
  dexscreener_url: null,
  pumpdotfun_url: null,
  moonshot_url: null,
  moontok_url: null,
};
