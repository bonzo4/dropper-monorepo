import { SupabaseClient } from "@supabase/supabase-js";
import { ListingCommentRow } from "../types/listing";
import { DatabaseTypes } from "@repo/app-types/database";
import { useEffect, useState } from "react";

type Options = {
  supabase: SupabaseClient<DatabaseTypes>;
  listingId: number;
  page: number;
};

export function useListingComments({ supabase, listingId, page }: Options) {
  const [comments, setComments] = useState<ListingCommentRow[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const query = supabase
        .from("listing_comments")
        .select("*")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: false });

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
          const { data: user, error } = await supabase
            .from("dropmans_view")
            .select("username")
            .eq("user_id", comment.user_id)
            .single();

          if (error) {
            console.error(error);
            return comment;
          }

          return { ...comment, user: user?.username ?? "Unknown User" };
        })
      );
      setComments(commentsWithUser);
    };

    fetchComments();
  }, [supabase, listingId, page]);

  return { comments, loading };
}
