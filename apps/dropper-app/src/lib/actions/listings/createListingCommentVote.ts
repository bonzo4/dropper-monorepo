"use server";
import { createSupabaseServer } from "@repo/lib/supabase";

type Options = {
  commentId: number;
  userId: string;
  is_upvote: boolean;
};

export async function createListingCommentVote({
  commentId,
  userId,
  is_upvote,
}: Options) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase.from("listing_comment_votes").insert({
    comment_id: commentId,
    user_id: userId,
    is_upvote,
  });

  if (error) {
    return JSON.stringify({
      status: "error",
      message: "Error creating comment vote",
    });
  }

  return JSON.stringify({
    status: "success",
    message: "Comment vote created successfully",
  });
}
