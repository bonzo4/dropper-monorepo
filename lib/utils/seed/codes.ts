/**
 * ! Executing this script will delete all data in your database and seed it with 10 whitelisted_wallets.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { SupabaseClient } from "@supabase/supabase-js";
import { copycat } from "@snaplet/copycat";
import { DatabaseTypes } from "../../../packages/app-types/src/database";

export async function createCodes(supabase: SupabaseClient<DatabaseTypes>) {
  const accessCodes: { code: string }[] = [];

  for (let i = 0; i < 10; i++) {
    const code = copycat.word(i);
    await supabase.from("access_codes").delete().eq("code", code);
    accessCodes.push({
      code,
    });
  }

  const { error: error2 } = await supabase
    .from("access_codes")
    .insert(accessCodes);

  if (error2) console.log(error2);
}
