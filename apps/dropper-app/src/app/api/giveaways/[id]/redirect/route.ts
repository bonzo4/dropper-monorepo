import { createSupabaseService } from "@repo/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: number } }
) {
  const searchParams = request.nextUrl.searchParams;
  const redirectUrl = searchParams.get("next") || "/";

  const supabase = await createSupabaseService();

  const { data, error } = await supabase
    .from("giveaway_stats")
    .select("total_link_clicks, period_link_clicks")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error updating giveaway stats", error);
  } else {
    await supabase
      .from("giveaway_stats")
      .update({
        total_link_clicks: data.total_link_clicks + 1,
        period_link_clicks: data.period_link_clicks + 1,
      })
      .eq("id", id);
  }

  return NextResponse.redirect(redirectUrl);
}
