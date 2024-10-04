"use client";

import { createListingCommentVote } from "@/lib/actions/listings/createListingCommentVote";
import { ListingCommentRow } from "@/lib/types/listing";
import { ArrowWhite } from "@repo/ui/icons";
import { cn, dropper, mono } from "@repo/ui/utils";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  comment: ListingCommentRow;
  userId: string | null;
};

export default function ListingComment({ comment, userId }: Props) {
  const [showMore, setShowMore] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const vote = async (direction: "up" | "down") => {
    if (!userId) {
      toast.error("You must be logged in to vote on comments");
      return;
    }
    const response = await createListingCommentVote({
      commentId: comment.id,
      userId,
      is_upvote: direction === "up",
    });

    const data = JSON.parse(response);

    if (data.status === "error") {
      toast.error(data.message);
      return;
    }

    toast.success("Thank you for voting");
    setDisabled(true);
  };

  return (
    <li
      key={comment.user_id}
      className={cn(
        mono.className,
        "flex flex-row gap-4 items-start justify-start text-sm w-full "
      )}
    >
      <div className="flex rounded-full items-center justify-center overflow-hidden w-[50px] h-[50px] min-w-[50px] min-h-[50px]">
        {comment.icon_url ? (
          <Image
            src={comment.icon_url}
            alt={comment.user || "User Icon"}
            width={50}
            height={50}
            className="w-auto h-auto"
          />
        ) : (
          <div className="w-[50px] h-[50px] bg-placeholder rounded-full" />
        )}
      </div>
      <div className="flex flex-col w-full">
        <p className="flex flex-row gap-2 text-nowrap w-[250px] ">
          <span className={cn(dropper.className, "truncate overflow-hidden")}>
            {comment.user}
          </span>
          <span>{new Date(comment.created_at).toLocaleDateString()}</span>
          <span>
            {comment.bump_count} Bump{comment.bump_count === 1 ? "" : "s"}
          </span>
        </p>
        {showMore ? (
          <p className="">{comment.content}</p>
        ) : (
          <p className="max-h-16 max-w-[200px] sm:max-w-full sm:max-h-full">
            {comment.content.slice(0, 64)}
            {comment.content.length > 64 ? "..." : ""}
          </p>
        )}
        <div className="flex flex-row justify-between w-full">
          {comment.content.length > 64 ? (
            <button
              className="font-bold"
              onClick={() => setShowMore((prev) => !prev)}
            >
              Show {showMore ? "Less" : "More"}
            </button>
          ) : (
            <div></div>
          )}
          <div className="flex flex-row items-center justify-center gap-2">
            <button
              onClick={() => vote("down")}
              disabled={comment.is_upvote !== undefined || disabled}
              style={{
                opacity:
                  comment.is_upvote !== undefined && !comment.is_upvote
                    ? 1
                    : 0.25,
              }}
            >
              <ArrowWhite className="w-3 h-3 rotate-90 mt-px hover:opacity-50 hover:cursor-pointer" />
            </button>
            <span>{comment.score}</span>
            <button
              onClick={() => vote("up")}
              disabled={comment.is_upvote !== undefined || disabled}
              style={{
                opacity:
                  comment.is_upvote !== undefined && comment.is_upvote
                    ? 1
                    : 0.25,
              }}
            >
              <ArrowWhite className="w-3 h-3 -rotate-90 mb-px hover:opacity-50 hover:cursor-pointer" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
