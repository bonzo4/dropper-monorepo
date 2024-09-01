"use client";
import { Tweet } from "react-twitter-widgets";
import { CommunityPostRow } from "@repo/types/airdrop";

type CommunityPostProps = {
  post: CommunityPostRow;
};

export default function CommunityPost({ post }: CommunityPostProps) {
  const tweetId = post.url.split("/").pop();
  if (!tweetId || isNaN(parseInt(tweetId))) return null;
  return (
    <div className="w-full ">
      <Tweet
        tweetId={tweetId}
        options={{
          width: 550,
          align: "center",
          theme: "dark",
        }}
      />
    </div>
  );
}
