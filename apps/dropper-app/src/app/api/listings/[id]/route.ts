import { createSupabaseServer } from "@/lib/supabase/server";
import { ListingRow } from "@/lib/types/listing";
import { NextRequest } from "next/server";

export type ListingPageData = {
  nextListingId: number | null;
  prevListingId: number | null;
} & ListingRow;

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: number } }
) {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("listings")
    .select("*")
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

  let nextListingId = null;
  let prevListingId = null;

  const { data: next } = await supabase
    .from("listings")
    .select("id")
    .lt("last_bump", data.last_bump)
    .order("id", { ascending: false })
    .range(0, 0)
    .single();
  if (next) {
    nextListingId = next.id;
  }

  const { data: prev } = await supabase
    .from("listings")
    .select("id")
    .gt("last_bump", data.last_bump)
    .order("last_bump", { ascending: true })
    .range(0, 0)
    .single();
  if (prev) {
    prevListingId = prev.id;
  }

  return new Response(
    JSON.stringify({ ...data, nextListingId, prevListingId }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_URL!,
      },
    }
  );
}
