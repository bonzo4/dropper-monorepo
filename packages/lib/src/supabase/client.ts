import { DatabaseTypes } from "@repo/app-types/database";
import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseClient(): SupabaseClient<DatabaseTypes> {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient<DatabaseTypes>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
