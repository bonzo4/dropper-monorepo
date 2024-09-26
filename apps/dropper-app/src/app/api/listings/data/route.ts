import { getMultipleTokens } from "@/lib/data/getMultipleTokens";
import { createSupabaseService } from "@repo/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseService();

  try {
    if (request.headers.get("password") !== process.env.LISTING_PASSWORD)
      throw new Error("Unauthorized");

    const { data, error, count } = await supabase
      .from("listings")
      .select("token_address", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(30);

    if (error || !count) throw new Error("Couldn't find listings");

    const tokenData = await getMultipleTokens(
      data.map((listing) => listing.token_address)
    );

    await Promise.all(
      tokenData.map(async (token) => {
        await supabase
          .from("listings")
          .update({
            ath: token.ath,
            atv: token.atv,
          })
          .eq("token_address", token.tokenAddress);
      })
    );

    const pages = Math.ceil(count / 30);

    if (pages > 1) {
      for (let i = 2; i <= pages; i++) {
        const { data: nextData, error: nextError } = await supabase
          .from("listings")
          .select("token_address")
          .order("created_at", { ascending: false })
          .range((i - 1) * 30, i * 30 - 1);
        if (nextError) throw new Error("Couldn't find listings");
        const nextTokenData = await getMultipleTokens(
          nextData.map((listing) => listing.token_address)
        );
        await Promise.all(
          nextTokenData.map(async (token) => {
            await supabase
              .from("listings")
              .update({
                ath: token.ath,
                atv: token.atv,
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
