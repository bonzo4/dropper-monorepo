"use server";

import { createSupabaseServer } from "@repo/lib/supabase";

type options = {
  userId: string;
  twitterId: string;
  username: string;
};

// export async function createTwitterAccount({});
