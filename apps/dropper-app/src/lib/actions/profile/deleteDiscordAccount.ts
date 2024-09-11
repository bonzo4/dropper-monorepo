"use server";
import { createSupabaseServer } from "@/lib/supabase/server";

type Options = {
  userId: string;
};

export async function deleteDiscordAccount({ userId }: Options) {
  const supabase = createSupabaseServer();

  const { error } = await supabase
    .from("discord_accounts")
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
    message: "Discord account deleted",
  });
}
