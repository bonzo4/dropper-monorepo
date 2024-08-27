"use server";
import { revalidatePath } from "next/cache";

export function revalidateHomePage() {
  revalidatePath("/");
}
