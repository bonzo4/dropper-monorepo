import { DatabaseTypes } from "@repo/types/database";
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient<DatabaseTypes>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
