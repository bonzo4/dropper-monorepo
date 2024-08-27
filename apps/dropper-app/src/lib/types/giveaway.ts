import { Database } from "../supabase/types";

export type GiveawayRow = Database["public"]["Tables"]["giveaways"]["Row"];
export type GiveawayRequirementsRow =
  Database["public"]["Tables"]["giveaway_requirements"]["Row"];

export type GiveawayInsert =
  Database["public"]["Tables"]["giveaways"]["Insert"];
export type GiveawayRequirementsInsert =
  Database["public"]["Tables"]["giveaway_requirements"]["Insert"];

export type GiveawayEntryRow =
  Database["public"]["Tables"]["giveaway_entries"]["Row"];
export type GiveawayWinnerRow =
  Database["public"]["Tables"]["giveaway_winners"]["Row"];

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
  degenpumpfun_url: null,
};
