import { createSupabaseServer } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const supabase = createSupabaseServer();

  let page = searchParams.get("page");
  let pageNumber = page ? parseInt(page) : 0;

  const query = supabase.from("listings").select("").neq("tx", null);

  if (!isNaN(pageNumber) && pageNumber > 0) {
    const start = (pageNumber - 1) * 12;
    const end = start + 11;
    query.range(start, end);
  } else {
    query.range(0, 11);
  }

  const { data, error } = await query;

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
    status: 200,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_URL!,
    },
  });
}
