import { createSupabaseServer } from "@repo/lib/supabase";
import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient } from "@supabase/supabase-js";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  sortBy?:
    | "title"
    | "symbol"
    | "questers"
    | "likelihood"
    | "blockchain"
    | "est_airdrop_size"
    | "category"
    | "created_at"
    | "sentiment"
    | undefined;
  sort?: "asc" | "desc" | undefined;
  category?: string | undefined;
  blockchain?: string | undefined;
  search?: string | undefined;
};

export async function getAirdrops({
  supabase,
  sortBy,
  sort,
  category,
  blockchain,
  search,
}: Options) {
  try {
    const query = supabase
      .from("airdrops")
      .select(
        "id, title, symbol, icon_url, questers, likelihood, blockchain, est_airdrop_size, category, sentiment, description, slug"
      )
      .eq("is_published", true);

    if (category) {
      query.eq("category", category);
    }
    if (blockchain) {
      query.eq("blockchain", blockchain);
    }

    if (search) {
      query.ilike("title, symbol", `%${search}%`);
    }

    if (sort && sortBy) {
      query.order(sortBy, { ascending: sort === "asc" });
    } else {
      query
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
