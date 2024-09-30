import { getMultipleTokenData } from "@/lib/data/getMultipleTokenData";
import { createSupabaseService } from "@repo/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseService();
  const now = new Date().toISOString();

  try {
    if (request.headers.get("password") !== process.env.LISTING_PASSWORD)
      throw new Error("Unauthorized");

    const addresses: string[] = [];

    const { data, error, count } = await supabase
      .from("listings")
      .select("token_address", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(30);

    if (error || !count) throw new Error("Couldn't find listings");

    const tokenData = await getMultipleTokenData(
      data.map((d) => d.token_address)
    );

    await Promise.all(
      tokenData.map(async (token) => {
        await supabase
          .from("listings")
          .update({
            usd_price: token.price,
            volume_24h: token.volume24h,
          })
          .eq("token_address", token.tokenAddress);
        const { data: giveawayData } = await supabase
          .from("giveaways")
          .select("reward_amount")
          .eq("token_address", token.tokenAddress)
          .lt("start_time", now)
          .gt("end_time", now)
          .single();
        if (!giveawayData) return;
        await supabase.from("giveaways").update({
          usd_value: token.price * giveawayData.reward_amount,
        });
      })
    );

    addresses.push(...tokenData.map((d) => d.tokenAddress));

    const pages = Math.ceil(count / 30);

    if (pages > 1) {
      for (let i = 2; i <= pages; i++) {
        const { data: nextData, error: nextError } = await supabase
          .from("listings")
          .select("token_address")
          .order("created_at", { ascending: false })
          .range((i - 1) * 30, i * 30 - 1);
        if (nextError) throw new Error("Couldn't find listings");
        const tokenData = await getMultipleTokenData(
          nextData.map((d) => d.token_address)
        );

        await Promise.all(
          tokenData.map(async (token) => {
            await supabase
              .from("listings")
              .update({
                usd_price: token.price,
                volume_24h: token.volume24h,
              })
              .eq("token_address", token.tokenAddress);
            const { data: giveawayData } = await supabase
              .from("giveaways")
              .select("reward_amount")
              .eq("token_address", token.tokenAddress)
              .lt("start_time", now)
              .gt("end_time", now)
              .single();
            if (!giveawayData) return;
            await supabase.from("giveaways").update({
              usd_value: token.price * giveawayData.reward_amount,
            });
          })
        );

        addresses.push(...tokenData.map((d) => d.tokenAddress));
      }
    }

    const { data: giveawayData, error: giveawayError } = await supabase
      .from("giveaways")
      .select("token_address")
      .not("token_address", "in", `(${addresses.join(",")})`)
      .lt("start_time", now)
      .gt("end_time", now);

    if (giveawayError) throw new Error("Couldn't find giveaways");

    const giveawayAddresses = Array.from(
      new Set(giveawayData.map((d) => d.token_address!))
    );

    const addressCount = giveawayAddresses.length;
    const addressPages = Math.ceil(addressCount / 30);

    for (let i = 1; i <= addressPages; i++) {
      const addressesSlice = giveawayAddresses.slice((i - 1) * 30, i * 30);
      const tokenData2 = await getMultipleTokenData(addressesSlice);

      await Promise.all(
        tokenData2.map(async (token) => {
          const { data: giveawayData } = await supabase
            .from("giveaways")
            .select("id, reward_amount")
            .eq("token_address", token.tokenAddress)
            .lt("start_time", now)
            .gt("end_time", now);
          if (!giveawayData) return;
          await Promise.all(
            giveawayData.map(async (giveaway) => {
              await supabase
                .from("giveaways")
                .update({
                  usd_value: token.price * giveaway.reward_amount,
                })
                .eq("id", giveaway.id);
            })
          );
        })
      );
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
