"use server";
import { revalidatePath } from "next/cache";

export async function revalidateGiveaway(giveawayId: number) {
  revalidatePath(`/drops/${giveawayId}`);
}
