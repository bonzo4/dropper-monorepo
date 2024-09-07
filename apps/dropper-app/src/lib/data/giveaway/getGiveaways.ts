import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

export type LandingGiveaway = {
  id: number;
  title: string;
  description: string;
  icon_url: string;
  usd_value: number;
  end_time: string;
  entries: number;
  badges: string[];
  reward_amount: number;
  winner_amount: number;
  ticker: string;
  token_address: string | null;
};

export type LandingGiveawayQuery = {
  type?: "ongoing" | "past" | "not_started";
  sort?: "ascending" | "descending";
  sortBy?: "usd_value" | "end_time" | "entries" | "created_at";
  walletKey?: string;
  page?: number;
};

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  query: LandingGiveawayQuery;
};

export async function getGiveaways({
  supabase,
  query: {
    type = "ongoing",
    sort = "descending",
    sortBy = "created_at",
    walletKey,
    page = 1,
  },
}: Options): Promise<LandingGiveaway[]> {
  try {
    const now = new Date().toISOString();
    const query = supabase
      .from("giveaways")
      .select(
        "id, title, description, icon_url, usd_value, end_time, entries, badges, reward_amount, winner_amount, ticker, token_address"
      )
      .neq("tx", null);

    if (!type || type === "ongoing") {
      query.lt("start_time", now).gt("end_time", now);
    } else if (type === "not_started") {
      query.gt("start_time", now);
    } else {
      query.lt("end_time", now);
    }

    if (walletKey && walletKey !== "undefined") {
      query.eq("creator_key", walletKey);
    }
    query.order(sortBy, { ascending: sort === "ascending" });
    query.order("created_at", { ascending: false });

    if (page > 1) {
      const start = (page - 1) * 12;
      const end = start + 12;
      query.range(start, end);
    } else {
      query.range(0, 12);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error("Failed to fetch giveaways");
    }

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
