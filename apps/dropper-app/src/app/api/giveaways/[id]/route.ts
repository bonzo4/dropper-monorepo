import { createSupabaseServer } from "@/lib/supabase/server";
import { GiveawayRequirementsRow, GiveawayRow } from "@repo/types/giveaway";
import { NextRequest } from "next/server";

export type GiveawayPageData = {
  giveaway_requirements: GiveawayRequirementsRow | null;
  entryIcons: string[];
} & GiveawayRow;

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: number } }
) {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("giveaways")
    .select("*, giveaway_requirements(*)")
    .eq("id", id)
    .single();

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_URL!,
      },
    });
  }

  const { data: entries } = await supabase
    .from("giveaway_entries")
    .select("user_id")
    .eq("giveaway_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  let entryIcons: string[] = [];

  if (entries) {
    await Promise.all(
      entries.map(async (entry) => {
        const { data: user } = await supabase
          .from("dropmans_view")
          .select("icon")
          .eq("user_id", entry.user_id)
          .single();
        if (user && user.icon) return entryIcons.push(user.icon);
      })
    );
  }
  const giveaway = { ...data, entryIcons };

  return new Response(JSON.stringify(giveaway), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_URL!,
    },
  });
}
