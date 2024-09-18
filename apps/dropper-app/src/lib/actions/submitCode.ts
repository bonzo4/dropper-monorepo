"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@repo/lib/supabase";

type Options = {
  code: string;
  userId: string;
};

export async function submitCode({ code, userId }: Options) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("user_codes")
    .insert([{ access_code: code, user_id: userId }]);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}
