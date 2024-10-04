"use server";

import { createSupabaseService } from "@repo/lib/supabase";

type Options = {
  listingId: number;
  userId: string;
  content: string;
};

export async function createListingComment({
  listingId,
  userId,
  content,
}: Options) {
  const supabase = await createSupabaseService();

  const { error } = await supabase.from("listing_comments").insert({
    listing_id: listingId,
    user_id: userId,
    content: content,
  });

  if (error) {
    return JSON.stringify({
      status: "error",
      message: "Error creating comment",
    });
  }

  return JSON.stringify({
    status: "success",
    message: "Comment created successfully",
  });
}
