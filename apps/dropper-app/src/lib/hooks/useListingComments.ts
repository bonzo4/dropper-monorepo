import { SupabaseClient } from "@supabase/supabase-js";
import { ListingCommentRow, ListingCommentVoteRow } from "../types/listing";
import { DatabaseTypes } from "@repo/app-types/database";
import { useEffect, useState } from "react";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  listingId: number;
  page: number;
  userId: string | null;
};

export function useListingComments({
  supabase,
  listingId,
  page,
  userId,
}: Options) {
  const [comments, setComments] = useState<ListingCommentRow[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const query = supabase
        .from("listing_comments")
        .select("*")
        .eq("listing_id", listingId)
        .order("score", { ascending: false });

      if (page > 1) {
        const start = (page - 1) * 10;
        const end = start + 10;
        query.range(start, end);
      } else {
        query.range(0, 10);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const commentsWithUser = await Promise.all(
        data.map(async (comment) => {
          const { data: user } = await supabase
            .from("dropmans_view")
            .select("username, icon")
            .eq("user_id", comment.user_id)
            .single();

          const voteQuery = supabase
            .from("listing_comment_votes")
            .select("is_upvote")
            .eq("comment_id", comment.id);

          let vote: { is_upvote: boolean } | null = null;
          if (userId) {
            voteQuery.eq("user_id", userId);
            const { data: voteData } = await voteQuery.single();
            vote = voteData;
          }

          const { count } = await supabase
            .from("listing_bumps")
            .select(undefined, { count: "exact" })
            .eq("user_id", comment.user_id)
            .single();

          return {
            ...comment,
            user: user?.username ?? "Unknown User",
            icon_url: user?.icon,
            is_upvote: vote ? vote.is_upvote : undefined,
            bump_count: count ?? 0,
          };
        })
      );
      setLoading(false);
      setComments(commentsWithUser);
    };

    fetchComments();
  }, [supabase, listingId, page, userId]);

  return { comments, loading, setComments };
}
