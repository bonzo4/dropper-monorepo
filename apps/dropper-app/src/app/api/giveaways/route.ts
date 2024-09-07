import { createSupabaseServer } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let type = searchParams.get("type") as
    | "ongoing"
    | "past"
    | "not_started"
    | null;
  let sort = searchParams.get("sort") as "ascending" | "descending" | null;
  let sortBy = searchParams.get("sortBy") as
    | "usd_value"
    | "end_time"
    | "entries"
    | "created_at"
    | null;

  let walletKey = searchParams.get("walletKey") as string | undefined;

  let page = searchParams.get("page");
  let pageNumber = page ? parseInt(page) : 0;

  const supabase = createSupabaseServer();

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

  if (sort && sortBy) {
    query.order(sortBy, { ascending: sort === "ascending" });
  } else {
    query.order("created_at", { ascending: false });
  }

  if (!isNaN(pageNumber) && pageNumber > 0) {
    const start = (pageNumber - 1) * 12;
    const end = start + 12;
    query.range(start, end);
  } else {
    query.range(0, 12);
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
    status: 200,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_URL!,
    },
  });
}
