import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

export type TickerGiveaway = {
  id: number;
  icon_url: string;
  end_time: string;
  reward_amount: number;
  ticker: string;
  token_address: string | null;
};

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
};

export async function getTickers({ supabase }: Options) {
  try {
    const now = new Date().toISOString();
    const query = supabase
      .from("giveaways")
      .select("id, icon_url, end_time, reward_amount, ticker, token_address")
      .order("end_time", { ascending: true })
      .neq("tx", null)
      .lt("start_time", now)
      .gt("end_time", now)
      .limit(10);
    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching tickers", error);
    return [];
  }
}
