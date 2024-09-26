import { getMultipleTokenPrice } from "@/lib/data/getMultipleTokenPrice";
import { createSupabaseService } from "@repo/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseService();

  try {
    if (request.headers.get("password") !== process.env.GIVEAWAY_PASSWORD)
      throw new Error("Unauthorized");
    const now = new Date().toISOString();

    const { data, error, count } = await supabase
      .from("giveaways")
      .select("token_address, reward_amount", { count: "exact" })
      .order("created_at", { ascending: false })
      .neq("token_address", null)
      .lt("start_time", now)
      .gt("end_time", now)
      .limit(30);

    if (error || !count) throw new Error("Couldn't find giveaways");

    const tokenData = await getMultipleTokenPrice(data);

    await Promise.all(
      tokenData.map(async (token) => {
        await supabase
          .from("giveaways")
          .update({
            usd_value: token.price,
          })
          .eq("token_address", token.tokenAddress);
      })
    );

    const pages = Math.ceil(count / 30);

    if (pages > 1) {
      for (let i = 2; i <= pages; i++) {
        const { data: nextData, error: nextError } = await supabase
          .from("giveaways")
          .select("token_address, reward_amount")
          .order("created_at", { ascending: false })
          .range((i - 1) * 30, i * 30 - 1);
        if (nextError) throw new Error("Couldn't find giveaways");
        const nextTokenData = await getMultipleTokenPrice(nextData);
        await Promise.all(
          nextTokenData.map(async (token) => {
            await supabase
              .from("giveaways")
              .update({
                usd_value: token.price,
              })
              .eq("token_address", token.tokenAddress);
          })
        );
      }
    }

    return NextResponse.json(JSON.stringify({ message: "success" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(JSON.stringify(err.message), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
