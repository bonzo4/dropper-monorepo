"use client";
import { Button } from "@repo/ui";
import { TwitterAccount } from "@/lib/types/profile";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTwitterOauthLink } from "@/lib/actions/profile/getTwitterOauthLink";
import { toast } from "react-toastify";
import { deleteTwitterAccount } from "@/lib/actions/profile/deleteTwitterAccount";

type Props = {
  twitterAccount: TwitterAccount | null;
  userId: string;
};

export default function ConnectTwitter({ twitterAccount, userId }: Props) {
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    const generateLink = async () => {
      const link = await getTwitterOauthLink(userId);

      if (JSON.parse(link).status === "error") {
        toast.error("Error generating Twitter link. Please try again.");
        return;
      }

      setLink(link);
    };

    generateLink();
  }, [userId]);

  const router = useRouter();
  const handleDelete = async () => {
    if (!twitterAccount) return;
    deleteTwitterAccount({ userId: twitterAccount.user_id });
    router.refresh();
  };
  return (
    <div className="flex flex-col w-full gap-4">
      <h2 className="text-3xl">Connect Twitter</h2>
      {!twitterAccount && (
        <a href={link || ""} className="">
          <Button>Link Twitter</Button>
        </a>
      )}
      {twitterAccount && (
        <div className="flex flex-row gap-2 items-center">
          <div>
            <Button onClick={handleDelete}>Disconnect</Button>
          </div>
          {twitterAccount.username ? (
            <p className={cn(mono.className, "text-lg")}>
              Connected as {twitterAccount.username}
            </p>
          ) : (
            <p className={cn(mono.className, "text-lg")}>
              Error Connection. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
