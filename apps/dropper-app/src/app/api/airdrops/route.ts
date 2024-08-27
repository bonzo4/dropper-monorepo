import { createSupabaseServer } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let sort = searchParams.get("ascending") as "asc" | "desc" | undefined;
  let sortBy = searchParams.get("sortBy") as
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

  let category = searchParams.get("category") as string | undefined;
  let blockchain = searchParams.get("blockchain") as string | undefined;
  let search = searchParams.get("search") as string | undefined;
  const supabase = createSupabaseServer();

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

  if (sort && sortBy) {
    query.order(sortBy, { ascending: sort === "asc" });
  } else {
    query
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });
  }

  if (search) {
    query.ilike("title, symbol", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_URL!,
      },
    });
  }

  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_URL!,
    },
  });
}
