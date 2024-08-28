/**
 * ! Executing this script will delete all data in your database and seed it with 10 whitelisted_wallets.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { SupabaseClient } from "@supabase/supabase-js";
import { DatabaseTypes } from "../../../packages/app-types/src/database";

export async function whitelistWallets(
  supabase: SupabaseClient<DatabaseTypes>
) {
  await supabase
    .from("solana_wallets")
    .delete()
    .eq("address", "9pT6i1LSxsFUd3jX8a3LfPV5A5UqS9mQdU3REPAM9Uev");

  await supabase.from("solana_wallets").insert([
    {
      address: "9pT6i1LSxsFUd3jX8a3LfPV5A5UqS9mQdU3REPAM9Uev",
    },
  ]);
}
