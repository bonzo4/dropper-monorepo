"use server";
import { createSupabaseServer } from "@repo/lib/supabase";
import { revalidatePath } from "next/cache";

type ClaimGiveawayOptions = {
  userId: string;
  giveawayId: number;
};

export async function claimGiveaway({
  userId,
  giveawayId,
}: ClaimGiveawayOptions) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("giveaway_winners")
    .update({
      has_claimed: true,
    })
    .match({
      giveaway_id: giveawayId,
      user_id: userId,
    });

  if (error)
    return JSON.stringify({
      status: "error",
      message: "Something went wrong claiming this drop",
    });

  revalidatePath(`/drops/${giveawayId}`, "page");

  return JSON.stringify({
    status: "ok",
  });
}
