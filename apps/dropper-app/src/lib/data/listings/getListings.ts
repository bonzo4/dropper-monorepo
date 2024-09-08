import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

export type ListingCardData = {
  ticker: string;
  name: string;
  holder_count: number;
  ath: number;
  atv: number;
  icon_url: string;
  description: string;
  id: number;
};

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  page?: number;
};

export async function getListings({ supabase, page = 1 }: Options) {
  try {
    const query = supabase
      .from("listings")
      .select("ticker, name, holder_count, ath, atv, icon_url, description, id")
      .order("last_bump", { ascending: false })
      .neq("tx_string", null);

    if (page > 1) {
      const start = (page - 1) * 12;
      const end = start + 12;
      query.range(start, end);
    } else {
      query.range(0, 12);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}
