import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params: { slug } }: { params: { slug: string } }
) {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("airdrops")
    .select(
      "*, about_sections(*, drop_team_members(*)), quest_sections(*, quests(*, quest_items(*))), community_sections(*, community_posts(*))"
    )
    .eq("slug", slug)
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

  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_URL!,
    },
  });
}
