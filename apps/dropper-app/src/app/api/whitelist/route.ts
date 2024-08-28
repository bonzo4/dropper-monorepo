import { createSupabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = new URLSearchParams(request.url);

  const walletAddress = searchParams.get("key");

  if (!walletAddress) {
    return NextResponse.json(
      { message: "Missing wallet address" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("solana_wallets")
    .select("*")
    .eq("address", walletAddress)
    .single();

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
