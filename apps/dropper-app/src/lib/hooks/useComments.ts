import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { DropmanView } from "../types/user";
import { DatabaseTypes } from "@repo/app-types/database";
// import { AirdropCommentRow } from "../types/comment";

type UseCommentsOptions = {
  supabase: SupabaseClient<DatabaseTypes>;
  airdropId: number;
  sortBy?: "best" | "newest";
  page?: number;
};

export const useComments = ({
  supabase,
  airdropId,
  sortBy = "best",
  page = 1,
}: UseCommentsOptions) => {
  const [comments, setComments] = useState<
    (DatabaseTypes["public"]["Tables"]["airdrop_comments"]["Row"] & {
      user?: DropmanView;
    })[]
  >([]);

  useEffect(() => {
    const fetchComments = async () => {
      const query = supabase
        .from("airdrop_comments")
        .select("*")
        .eq("airdrop_id", airdropId)
        .range((page - 1) * 10, page * 10 - 1);

      if (sortBy === "newest") {
        query.order("created_at", { ascending: false });
      } else {
        query.order("up_votes", { ascending: false });
      }

      const { data, error } = await query;
      if (data) {
        const commentsWithUser = await Promise.all(
          data.map(async (comment) => {
            if (!comment.user_id) return comment;
            const { data: user, error } = await supabase
              .from("dropmans_view")
              .select("*")
              .eq("user_id", comment.user_id)
              .single();
            if (error) {
              return comment;
            }
            return { ...comment, user: user };
          })
        );
        setComments(commentsWithUser);
      }
    };
    fetchComments();
  }, [airdropId, supabase, page, sortBy]);

  return { comments };
};
