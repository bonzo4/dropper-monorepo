"use server";
import { createSupabaseServer } from "@repo/lib/supabase";

type Options = {
  userId: string;
};

export async function deleteTwitterAccount({ userId }: Options) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("twitter_accounts")
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
    message: "Twitter account deleted",
  });
}
