"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = createSupabaseServer();

  await supabase.auth.signOut({ scope: "local" });

  revalidatePath("/profile", "page");
  redirect("/");
}
