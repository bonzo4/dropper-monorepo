"use server";
import { DatabaseTypes } from "@repo/app-types/database";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export async function createSupabaseService(): Promise<
  SupabaseClient<DatabaseTypes>
> {
  return createClient<DatabaseTypes>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}
