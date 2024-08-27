"use client";

import { useComments } from "@/lib/hooks/useComments";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useState } from "react";
import Comment from "./Comment";
import { useUser } from "@/lib/hooks/useUser";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type CommentSectionProps = {
  airdropId: number;
};

const CommentSection = ({ airdropId }: CommentSectionProps) => {
  const supabase = createSupabaseClient();
  const { user } = useUser({ supabase });
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"best" | "newest">("best");

  const { comments } = useComments({ supabase, airdropId, sortBy, page });

  const createComment = async (comment: string) => {
    if (!user) return;
    if (!comment) return;
    await supabase
      .from("airdrop_comments")
      .insert({ airdrop_id: airdropId, comment, user_id: user.id });
    setPage(1);
    setSortBy("newest");
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-8 px-10">
      <div className="flex flex-col md:flex-row items-end md:items-center md:justify-between w-full gap-4">
        <Input
          className="w-full"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Comment here"
        />
        <Button onClick={() => createComment(comment)}>Comment</Button>
      </div>
      <div className="w-full flex flex-row items-center justify-end gap-2">
        <span className="text-xs">
          {sortBy.at(0)?.toUpperCase() + sortBy.slice(1)}
        </span>
        <Button
          onClick={() =>
            sortBy === "newest" ? setSortBy("best") : setSortBy("newest")
          }
        >
          Sort By
        </Button>
      </div>
      {comments.length === 0 ? (
        <span>Be the first one to comment</span>
      ) : (
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
};

export default CommentSection;
