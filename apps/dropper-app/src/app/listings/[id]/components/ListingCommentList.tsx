"use client";

import PageNav from "@/components/PageNav";
import { useListingComments } from "@/lib/hooks/useListingComments";
import { createSupabaseClient } from "@repo/lib/supabase";
import { cn, mono } from "@repo/ui/utils";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";

type Props = {
  listingId: number;
};

export default function ListingCommentList({ listingId }: Props) {
  const supabase = createSupabaseClient();
  const [page, setPage] = useState(1);

  const { comments, loading } = useListingComments({
    supabase,
    listingId,
    page,
  });

  return (
    <div className="flex flex-col w-full gap-4 px-8">
      <h2 className="text-3xl">Recent Comments</h2>
      <div
        className={cn(
          mono.className,
          "flex flex-row gap-2 justify-between text-base font-bold"
        )}
      >
        <p>Date</p>
      </div>
      {loading && (
        <div className="flex w-full justify-center">
          <CgSpinner size={75} className="animate-spin" />
        </div>
      )}
      {comments.length === 0 && !loading && (
        <div className="flex w-full py-6 justify-center">
          <p className="opacity-25 ">No Comments found</p>
        </div>
      )}
      {!loading && comments.length > 0 && (
        <ul className="flex flex-col gap-2 py-7">
          {comments.slice(0, 10).map((comment, index) => (
            <li
              key={comment.user_id}
              className={cn(
                mono.className,
                "flex flex-row gap-2 justify-between text-sm"
              )}
            >
              <p className="text-nowrap w-[200px] truncate overflow-hidden">
                {10 * (page - 1) + index + 1}.{" "}
                <span className="">{comment.user}</span>
              </p>
              <p className="text-nowrap w-[200px] truncate overflow-hidden">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
      <PageNav
        page={page}
        prevPage={() => setPage(page - 1)}
        nextPage={() => setPage(page + 1)}
        docCount={comments.length}
        maxDocs={10}
      />
    </div>
  );
}
