"use server";

import { createSupabaseServer } from "@repo/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createSupabaseServer();

  await supabase.auth.signOut({ scope: "local" });

  revalidatePath("/profile", "page");
  redirect("/");
}
