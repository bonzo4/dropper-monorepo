"use server";
import { createSupabaseServer } from "@repo/lib/supabase";

type Options = {
  userId: string;
};

export async function deleteSolanaWallet({ userId }: Options) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("solana_wallets")
    .delete()
    .eq("user_id", userId);

  if (error) {
    return JSON.stringify({
      status: "error",
      message: "Couldn't delete error",
    });
  }

  return JSON.stringify({
    status: "success",
    message: "Solana wallet deleted",
  });
}
