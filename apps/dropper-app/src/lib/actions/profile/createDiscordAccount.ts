"use server";

import { createSupabaseServer } from "@repo/lib/supabase";

type Options = {
  userId: string;
  discordId: string;
  username: string;
};

export async function createDiscordAccount({
  userId,
  discordId,
  username,
}: Options) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.from("discord_accounts").insert({
    user_id: userId,
    discord_id: discordId,
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
