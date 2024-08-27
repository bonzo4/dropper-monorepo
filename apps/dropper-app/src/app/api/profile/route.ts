import { createSupabaseServer } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";
import { NextRequest } from "next/server";

export type ProfilePageData = Pick<
  Database["public"]["Tables"]["dropmans"]["Row"],
  "username" | "created_at" | "exp_points" | "icon" | "drop_points"
>;

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServer();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not Authorized");

    const { data, error } = await supabase
      .from("dropmans")
      .select("username, icon, exp_points, created_at, drop_points")
      .eq("user_id", user.id)
      .single();

    if (error) throw new Error(error.message);

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
