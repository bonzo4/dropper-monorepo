import { createSupabaseServer } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export type TickerGiveaway = {
  id: string;
  icon_url: string;
  end_time: string;
  reward_amount: number;
  ticker: string;
  token_address: string;
};

export async function GET(request: NextRequest) {
  const supabase = createSupabaseServer();

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
