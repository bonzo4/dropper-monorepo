"use server";

import { createSupabaseServer } from "@repo/lib/supabase";

type Options = {
  userId: string;
  twitterId: string;
  username: string;
};

export async function createTwitterAccount({
  userId,
  twitterId,
  username,
}: Options) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.from("twitter_accounts").insert({
    user_id: userId,
    twitter_id: twitterId,
    username,
  });

  if (error) {
    return JSON.stringify({
      status: "error",
      message: "Failed to create discord account",
    });
  }

  return JSON.stringify({
    status: "success",
  });
}
