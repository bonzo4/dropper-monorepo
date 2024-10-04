"use client";

import { createListingComment } from "@/lib/actions/listings/createListingComment";
import { useUser } from "@/lib/hooks/useUser";
import { DropmanRow } from "@/lib/types/user";
import { createSupabaseClient } from "@repo/lib/supabase";
import { Button, Textarea } from "@repo/ui";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  listingId: number;
  dropman: DropmanRow | null;
};

export default function ListingCommentCreate({ listingId, dropman }: Props) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dropman) {
      toast.error("Please login to comment");
      return;
    }

    if (!comment) {
      toast.error("Please enter a comment");
      return;
    }

    setLoading(true);

    const response = await createListingComment({
      listingId,
      userId: dropman.user_id,
      content: comment,
    });

    const data = JSON.parse(response);

    if (data.status === "error") {
      toast.error(data.message);
      setLoading(false);
      return;
    }

    setComment("");
    setLoading(false);
    toast.success("Comment posted!");
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  if (!dropman?.user_id) {
    return (
      <div className="flex w-full">
        <p className="opacity-25">Please login to comment</p>
      </div>
    );
  }

  return (
    <form onSubmit={submitComment} className="flex flex-col w-full gap-4 px-8">
      <h2 className="text-3xl">Submit a Comment</h2>
      <div className="flex flex-row gap-4 w-full items-start">
        <div className="flex rounded-full items-center justify-center overflow-hidden w-[50px] h-[50px] min-w-[50px] min-h-[50px]">
          <Image
            src={dropman.icon}
            alt={dropman.username}
            width={50}
            height={50}
            className="w-auto h-auto"
          />
        </div>
        <div className="flex flex-col w-full grow items-end gap-2">
          <Textarea
            value={comment}
            onChange={handleCommentChange}
            className="w-full"
          />
          <Button type="submit" disabled={loading}>
            Post
          </Button>
        </div>
      </div>
    </form>
  );
}
