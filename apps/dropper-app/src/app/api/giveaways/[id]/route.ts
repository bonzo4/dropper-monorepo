import { createSupabaseServer } from "@/lib/supabase/server";
import { GiveawayRequirementsRow, GiveawayRow } from "@/lib/types/giveaway";
import { NextRequest } from "next/server";

export type GiveawayPageData = {
  giveaway_requirements: GiveawayRequirementsRow | null;
  entryIcons: string[];
  prevGiveawayId: number | null;
  nextGiveawayId: number | null;
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

  let nextGiveawayId = null;
  let prevGiveawayId = null;

  const { data: next } = await supabase
    .from("giveaways")
    .select("id")
    .lt("created_at", data.created_at)
    .order("id", { ascending: false })
    .range(0, 0)
    .single();
  if (next) {
    nextGiveawayId = next.id;
  }

  const { data: prev } = await supabase
    .from("giveaways")
    .select("id")
    .gt("created_at", data.created_at)
    .order("id", { ascending: true })
    .range(0, 0)
    .single();
  if (prev) {
    prevGiveawayId = prev.id;
  }

  const giveaway = { ...data, entryIcons, nextGiveawayId, prevGiveawayId };

  return new Response(JSON.stringify(giveaway), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_URL!,
    },
  });
}
