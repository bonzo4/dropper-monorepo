"use server";

import { createSupabaseServer } from "@repo/lib/supabase";

type Options = {
  userId: string;
  address: string;
};

export async function createSolanaWallet({ userId, address }: Options) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.from("solana_wallets").insert({
    user_id: userId,
    address,
  });

  if (error) {
    return JSON.stringify({
      status: "error",
      message: "Failed to create solana wallet",
    });
  }

  return JSON.stringify({
    status: "success",
  });
}
