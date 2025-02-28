"use client";

import PageNav from "@/components/PageNav";
import { useListingComments } from "@/lib/hooks/useListingComments";
import { createSupabaseClient } from "@repo/lib/supabase";
import { cn, mono } from "@repo/ui/utils";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import Image from "next/image";
import ListingComment from "./ListingComment";
import ListingCommentCreate from "./ListingCommentCreate";
import { DropmanRow } from "@/lib/types/user";

type Props = {
  listingId: number;
  listingName: string;
  dropman: DropmanRow | null;
  userBumps: number;
};

export default function ListingCommentList({
  listingId,
  listingName,
  dropman,
  userBumps,
}: Props) {
  const supabase = createSupabaseClient();
  const [page, setPage] = useState(1);

  const { comments, loading, setComments } = useListingComments({
    supabase,
    listingId,
    page,
    userId: dropman?.user_id || null,
  });

  return (
    <div className="flex flex-col w-full gap-4 px-8">
      <ListingCommentCreate
        setComments={setComments}
        listingId={listingId}
        listingName={listingName}
        dropman={dropman}
        userBumps={userBumps}
      />
      <h2 className="text-3xl">Top Comments</h2>
      {loading && (
        <div className="flex w-full justify-center">
          <CgSpinner size={75} className="animate-spin" />
        </div>
      )}
      {comments.length === 0 && !loading && (
        <div className="flex w-full py-6 justify-center">
          <p className="opacity-25 ">
            No Comments found, Be the first to post.
          </p>
        </div>
      )}
      {!loading && comments.length > 0 && (
        <ul className="flex flex-col gap-2 py-7">
          {comments.slice(0, 10).map((comment) => (
            <ListingComment
              key={comment.id}
              comment={comment}
              userId={dropman?.user_id || null}
            />
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
