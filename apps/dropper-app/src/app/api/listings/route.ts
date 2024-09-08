import { createSupabaseServer } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const supabase = createSupabaseServer();

  let page = searchParams.get("page");
  let pageNumber = page ? parseInt(page) : 1;

  const query = supabase
    .from("listings")
    .select("ticker, name, holder_count, ath, atv, icon_url, description, id")
    .order("last_bump", { ascending: false })
    .neq("tx_string", null);

  if (!isNaN(pageNumber) && pageNumber > 1) {
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
