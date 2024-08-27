import { createSupabaseServer } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: number } }
) {
  try {
    const supabase = createSupabaseServer();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not Authorized");

    const { data, error } = await supabase
      .from("giveaway_winners")
      .select("*")
      .eq("giveaway_id", id)
      .eq("user_id", user.id)
      .single();

    if (error) throw new Error("Couldn't find winner");

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_URL!,
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify(err.message), {
      status: 500,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_URL!,
      },
    });
  }
}
